/**
 * Serviço de Dados da Célula Santa Gemma Galgani
 * Suporte completo a Firestore em Tempo Real + Cache Local & Offline + Autenticação Google
 */

import { 
  UserProfile, 
  CommunityPost, 
  PrayerIntention, 
  CalendarEvent, 
  ChatMessage, 
  RSVPStatus,
  GalleryAlbum,
  GalleryPhoto,
  CellNotice,
  MeetingScale,
  DailyLiturgy,
  SaintOfDay,
  CellSong,
  UserRole,
  DonorProfile,
  DonationCampaign,
  DonationRecord,
  DonationType,
  PaymentGatewayType
} from '../types';
import { STORAGE_KEYS } from '../storage/localStorageKeys';
import { offlineSyncQueue } from '../storage/syncQueue';
import { generatePixCopyPaste } from '../utils/pixGenerator';
import { 
  MOCK_USERS, 
  INITIAL_POSTS, 
  INITIAL_PRAYERS, 
  INITIAL_EVENTS, 
  INITIAL_MESSAGES,
  INITIAL_ALBUMS,
  INITIAL_NOTICES,
  INITIAL_SCALES,
  SAMPLE_LITURGY,
  SAMPLE_SAINT,
  INITIAL_SONGS,
  INITIAL_DONORS,
  INITIAL_CAMPAIGNS,
  INITIAL_DONATIONS
} from './mockData';
import { 
  db, 
  auth, 
  loginWithGoogle as fbLoginWithGoogle, 
  logoutUser as fbLogoutUser,
  handleFirestoreError,
  OperationType 
} from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

class DataService {
  private currentUser: UserProfile;
  private firebaseUser: User | null = null;
  private isFirebaseConnected: boolean = false;
  private posts: CommunityPost[];
  private prayers: PrayerIntention[];
  private events: CalendarEvent[];
  private chatMessages: Record<string, ChatMessage[]>;
  private albums: GalleryAlbum[];
  private notices: CellNotice[];
  private scales: MeetingScale[];
  private songs: CellSong[];
  private donors: DonorProfile[];
  private campaigns: DonationCampaign[];
  private donations: DonationRecord[];
  private dailyLiturgy: DailyLiturgy;
  private saintOfDay: SaintOfDay;
  private bgOpacity: number;
  private listeners: Set<() => void> = new Set();
  private unsubscribers: (() => void)[] = [];

  constructor() {
    this.currentUser = this.loadFromStorage(STORAGE_KEYS.CURRENT_USER, MOCK_USERS[0]);
    this.posts = this.loadFromStorage(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    this.prayers = this.loadFromStorage(STORAGE_KEYS.PRAYERS, INITIAL_PRAYERS);
    this.events = this.loadFromStorage(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    this.chatMessages = this.loadFromStorage(STORAGE_KEYS.CHAT_MESSAGES, INITIAL_MESSAGES);
    this.albums = this.loadFromStorage(STORAGE_KEYS.ALBUMS, INITIAL_ALBUMS);
    this.notices = this.loadFromStorage(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
    this.scales = this.loadFromStorage(STORAGE_KEYS.SCALES, INITIAL_SCALES);
    this.songs = this.loadFromStorage(STORAGE_KEYS.SONGS, INITIAL_SONGS);
    this.donors = this.loadFromStorage(STORAGE_KEYS.DONORS, INITIAL_DONORS);
    this.campaigns = this.loadFromStorage(STORAGE_KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
    this.donations = this.loadFromStorage(STORAGE_KEYS.DONATIONS, INITIAL_DONATIONS);
    this.dailyLiturgy = SAMPLE_LITURGY;
    this.saintOfDay = SAMPLE_SAINT;
    this.bgOpacity = this.loadFromStorage(STORAGE_KEYS.BG_OPACITY, 0.45);

    this.initFirebaseAuth();
    this.setupFirestoreListeners();

    // Sincroniza fila offline assim que o navegador detectar conexão restabelecida
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('Conexão restabelecida! Processando sincronização offline...');
        this.syncPendingOfflineQueue().catch(console.warn);
      });
    }
  }

  private loadFromStorage<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      } else {
        // Garantir que a chave exista imediatamente no localStorage para suporte 100% offline
        localStorage.setItem(key, JSON.stringify(fallback));
      }
    } catch (e) {
      console.warn(`Erro ao carregar chave ${key} do storage:`, e);
    }
    return fallback;
  }

  private saveToStorage<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn(`Erro ao persistir chave ${key}:`, e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Erro no listener de dados:', err);
      }
    });
  }

  // ---- INICIALIZAÇÃO FIREBASE AUTH & FIRESTORE REALTIME ----
  private initFirebaseAuth(): void {
    try {
      onAuthStateChanged(auth, (user) => {
        this.firebaseUser = user;
        if (user) {
          this.isFirebaseConnected = true;
          const isCoordinatorOrFormador =
            user.displayName?.toLowerCase().includes('cristiane alves') ||
            user.displayName?.toLowerCase().includes('francisco josé') ||
            user.displayName?.toLowerCase().includes('francisco jose');
          this.currentUser = {
            ...this.currentUser,
            id: user.uid,
            name: user.displayName || this.currentUser.name,
            email: user.email || this.currentUser.email,
            avatarUrl: user.photoURL || this.currentUser.avatarUrl,
            role: isCoordinatorOrFormador ? 'admin' : 'membro',
          };
          this.saveToStorage(STORAGE_KEYS.CURRENT_USER, this.currentUser);
          this.setupFirestoreListeners();
        } else {
          // Mantém os listeners do Firestore ativos mesmo sem login Google para sincronizar o grupo
          this.isFirebaseConnected = true;
          if (this.unsubscribers.length === 0) {
            this.setupFirestoreListeners();
          }
        }
        this.notify();
      });
    } catch (e) {
      console.warn('Firebase Auth não inicializado ainda:', e);
    }
  }

  private setupFirestoreListeners(): void {
    this.teardownFirestoreListeners();

    try {
      // 1. Posts listener
      const postsCol = 'posts';
      const unsubPosts = onSnapshot(collection(db, postsCol), (snapshot) => {
        if (!snapshot.empty) {
          const remotePosts: CommunityPost[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as CommunityPost;
            remotePosts.push({ ...data, id: docSnap.id });
          });
          if (remotePosts.length > 0) {
            this.posts = remotePosts;
            this.saveToStorage(STORAGE_KEYS.POSTS, this.posts);
          }
        }
      }, (error) => {
        console.warn('Firestore onSnapshot posts fallback:', error.message);
      });
      this.unsubscribers.push(unsubPosts);

      // 2. Prayers listener
      const prayersCol = 'prayers';
      const unsubPrayers = onSnapshot(collection(db, prayersCol), (snapshot) => {
        if (!snapshot.empty) {
          const remotePrayers: PrayerIntention[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as PrayerIntention;
            remotePrayers.push({ ...data, id: docSnap.id });
          });
          if (remotePrayers.length > 0) {
            this.prayers = remotePrayers;
            this.saveToStorage(STORAGE_KEYS.PRAYERS, this.prayers);
          }
        }
      }, (error) => {
        console.warn('Firestore onSnapshot prayers fallback:', error.message);
      });
      this.unsubscribers.push(unsubPrayers);

      // 3. Notices listener
      const noticesCol = 'notices';
      const unsubNotices = onSnapshot(collection(db, noticesCol), (snapshot) => {
        if (!snapshot.empty) {
          const remoteNotices: CellNotice[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as CellNotice;
            remoteNotices.push({ ...data, id: docSnap.id });
          });
          if (remoteNotices.length > 0) {
            this.notices = remoteNotices;
            this.saveToStorage(STORAGE_KEYS.NOTICES, this.notices);
          }
        }
      }, (error) => {
        console.warn('Firestore onSnapshot notices fallback:', error.message);
      });
      this.unsubscribers.push(unsubNotices);

      // 4. Scales listener
      const scalesCol = 'scales';
      const unsubScales = onSnapshot(collection(db, scalesCol), (snapshot) => {
        if (!snapshot.empty) {
          const remoteScales: MeetingScale[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as MeetingScale;
            remoteScales.push({ ...data, id: docSnap.id });
          });
          if (remoteScales.length > 0) {
            this.scales = remoteScales;
            this.saveToStorage(STORAGE_KEYS.SCALES, this.scales);
          }
        }
      }, (error) => {
        console.warn('Firestore onSnapshot scales fallback:', error.message);
      });
      this.unsubscribers.push(unsubScales);

      // 5. Songs listener
      const songsCol = 'songs';
      const unsubSongs = onSnapshot(collection(db, songsCol), (snapshot) => {
        if (!snapshot.empty) {
          const remoteSongs: CellSong[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as CellSong;
            remoteSongs.push({ ...data, id: docSnap.id });
          });
          if (remoteSongs.length > 0) {
            this.songs = remoteSongs;
            this.saveToStorage(STORAGE_KEYS.SONGS, this.songs);
          }
        }
      }, (error) => {
        console.warn('Firestore onSnapshot songs fallback:', error.message);
      });
      this.unsubscribers.push(unsubSongs);

      // 6. Events listener (Agenda)
      const eventsCol = 'events';
      const unsubEvents = onSnapshot(collection(db, eventsCol), (snapshot) => {
        if (!snapshot.empty) {
          const remoteEvents: CalendarEvent[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as CalendarEvent;
            remoteEvents.push({ ...data, id: docSnap.id });
          });
          if (remoteEvents.length > 0) {
            this.events = remoteEvents;
            this.saveToStorage(STORAGE_KEYS.EVENTS, this.events);
          }
        }
      }, (error) => {
        console.warn('Firestore onSnapshot events fallback:', error.message);
      });
      this.unsubscribers.push(unsubEvents);

      // 7. Donors listener (Dizify Membros & Aniversários - Garante que todos os 48 irmãos oficiais estejam sempre presentes)
      const unsubDonors = onSnapshot(collection(db, 'donors'), (snapshot) => {
        const remoteMap = new Map<string, DonorProfile>();
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as DonorProfile;
          const cleanPhone = (data.phone || '').replace(/\D/g, '');
          // Ignora os 4 mocks antigos de DDD 11 (Lucas Silveira, Ir. Maria Clara, Gabriel Santos, Sara Albuquerque)
          if (cleanPhone.startsWith('119')) return;
          remoteMap.set(docSnap.id, { ...data, id: docSnap.id });
        });

        // Garante que todos os 48 membros oficiais (INITIAL_DONORS) existam na lista e no Firestore
        const mergedDonors: DonorProfile[] = INITIAL_DONORS.map((official) => {
          const existingRemote =
            remoteMap.get(official.id) ||
            Array.from(remoteMap.values()).find(
              (r) => r.phone.replace(/\D/g, '') === official.phone.replace(/\D/g, '')
            );

          if (existingRemote) {
            remoteMap.delete(existingRemote.id);
            return {
              ...existingRemote,
              name: official.name,
              phone: official.phone,
              birthDate: official.birthDate,
              maritalStatus: official.maritalStatus,
              leadershipBadge: official.leadershipBadge,
            };
          } else {
            // Sincroniza membro oficial faltante para o Firestore
            const cleanDoc = Object.fromEntries(
              Object.entries(official).filter(([, v]) => v !== undefined)
            );
            setDoc(doc(db, 'donors', official.id), cleanDoc).catch(() => {});
            return official;
          }
        });

        // Adiciona eventuais novos membros cadastrados manualmente que não estão nos 48 iniciais
        remoteMap.forEach((extraDonor) => {
          mergedDonors.push(extraDonor);
        });

        this.donors = mergedDonors;
        this.saveToStorage(STORAGE_KEYS.DONORS, this.donors);
      }, (error) => {
        console.warn('Firestore onSnapshot donors fallback:', error.message);
      });
      this.unsubscribers.push(unsubDonors);

      // 8. Campaigns listener (Dizify Campanhas)
      const unsubCampaigns = onSnapshot(collection(db, 'campaigns'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteCampaigns: DonationCampaign[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as DonationCampaign;
            remoteCampaigns.push({ ...data, id: docSnap.id });
          });
          if (remoteCampaigns.length > 0) {
            this.campaigns = remoteCampaigns;
            this.saveToStorage(STORAGE_KEYS.CAMPAIGNS, this.campaigns);
          }
        }
      }, (error) => {
        console.warn('Firestore onSnapshot campaigns fallback:', error.message);
      });
      this.unsubscribers.push(unsubCampaigns);

      // 9. Donations listener (Dizify Histórico de Ofertas PIX)
      const unsubDonations = onSnapshot(collection(db, 'donations'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteDonations: DonationRecord[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as DonationRecord;
            remoteDonations.push({ ...data, id: docSnap.id });
          });
          if (remoteDonations.length > 0) {
            this.donations = remoteDonations;
            this.saveToStorage(STORAGE_KEYS.DONATIONS, this.donations);
          }
        }
      }, (error) => {
        console.warn('Firestore onSnapshot donations fallback:', error.message);
      });
      this.unsubscribers.push(unsubDonations);

    } catch (err) {
      console.warn('Erro ao configurar listeners do Firestore:', err);
    }
  }

  private teardownFirestoreListeners(): void {
    this.unsubscribers.forEach((unsub) => {
      try {
        unsub();
      } catch (e) {
        // no-op
      }
    });
    this.unsubscribers = [];
  }

  // ---- AUTENTICAÇÃO ----
  public async loginWithGoogle(): Promise<User | null> {
    const user = await fbLoginWithGoogle();
    if (user) {
      this.firebaseUser = user;
      const isCoordinatorOrFormador =
        user.displayName?.toLowerCase().includes('cristiane alves') ||
        user.displayName?.toLowerCase().includes('francisco josé') ||
        user.displayName?.toLowerCase().includes('francisco jose');
      this.currentUser = {
        ...this.currentUser,
        id: user.uid,
        name: user.displayName || 'Membro Shalom',
        email: user.email || '',
        avatarUrl: user.photoURL || this.currentUser.avatarUrl,
        role: isCoordinatorOrFormador ? 'admin' : 'membro',
      };
      this.saveToStorage(STORAGE_KEYS.CURRENT_USER, this.currentUser);
      this.setupFirestoreListeners();
    }
    return user;
  }

  public async logout(): Promise<void> {
    await fbLogoutUser();
    this.firebaseUser = null;
    this.teardownFirestoreListeners();
    this.currentUser = MOCK_USERS[0];
    this.saveToStorage(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    this.notify();
  }

  public getFirebaseUser(): User | null {
    return this.firebaseUser;
  }

  public isConnectedToFirebase(): boolean {
    return this.isFirebaseConnected || Boolean(this.firebaseUser);
  }

  // ---- USUÁRIO ATUAL & PERMISSÕES ----
  public getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  public setCurrentUser(user: UserProfile): void {
    this.currentUser = user;
    this.saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
  }

  public updateProfile(data: Partial<UserProfile>): UserProfile {
    this.currentUser = {
      ...this.currentUser,
      ...data,
    };
    this.saveToStorage(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    offlineSyncQueue.enqueue('UPDATE', 'profile', data as Record<string, unknown>);

    // Firestore sync if connected
    if (this.firebaseUser) {
      const userPath = `users/${this.currentUser.id}`;
      setDoc(doc(db, 'users', this.currentUser.id), this.currentUser, { merge: true })
        .catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, userPath);
        });
    }

    return this.currentUser;
  }

  public switchRole(role: UserProfile['role']): void {
    const matched = MOCK_USERS.find(u => u.role === role) || {
      ...this.currentUser,
      role,
    };
    this.setCurrentUser(matched);
  }

  // ---- POSTS / MURAL ----
  public getPosts(): CommunityPost[] {
    return this.posts;
  }

  public addPost(data: Omit<CommunityPost, 'id' | 'createdAt' | 'likesCount' | 'hasLiked' | 'commentsCount' | 'comments'>): CommunityPost {
    const newPost: CommunityPost = {
      ...data,
      id: `post_${Date.now()}`,
      createdAt: 'Agora mesmo',
      likesCount: 0,
      hasLiked: false,
      commentsCount: 0,
      comments: [],
    };

    this.posts = [newPost, ...this.posts];
    this.saveToStorage(STORAGE_KEYS.POSTS, this.posts);
    offlineSyncQueue.enqueue('CREATE', 'post', newPost as unknown as Record<string, unknown>);

    setDoc(doc(db, 'posts', newPost.id), newPost)
      .catch(err => {
        console.warn('Erro ao salvar post no Firestore:', err);
      });

    return newPost;
  }

  public togglePostLike(postId: string): void {
    this.posts = this.posts.map(p => {
      if (p.id === postId) {
        const nextHasLiked = !p.hasLiked;
        const updated = {
          ...p,
          hasLiked: nextHasLiked,
          likesCount: nextHasLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
        };
        updateDoc(doc(db, 'posts', postId), {
          likesCount: updated.likesCount,
          hasLiked: updated.hasLiked,
        }).catch(err => console.warn('Erro ao curtir post no Firestore:', err));
        return updated;
      }
      return p;
    });
    this.saveToStorage(STORAGE_KEYS.POSTS, this.posts);
  }

  public addComment(postId: string, content: string): void {
    if (!content.trim()) return;
    this.posts = this.posts.map(p => {
      if (p.id === postId) {
        const newComment = {
          id: `comment_${Date.now()}`,
          authorId: this.currentUser.id,
          authorName: this.currentUser.name,
          authorAvatar: this.currentUser.avatarUrl,
          content,
          createdAt: 'Agora mesmo',
        };
        const updated = {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, newComment],
        };

        setDoc(doc(db, 'posts', postId, 'comments', newComment.id), newComment)
          .catch(err => console.warn('Erro ao salvar comentário no Firestore:', err));

        return updated;
      }
      return p;
    });
    this.saveToStorage(STORAGE_KEYS.POSTS, this.posts);
  }

  // ---- INTERCESSÃO & PEDIDOS DE ORAÇÃO ----
  public getPrayers(): PrayerIntention[] {
    return this.prayers;
  }

  public addPrayer(content: string, category: PrayerIntention['category'], urgent: boolean = false): PrayerIntention {
    const newPrayer: PrayerIntention = {
      id: `prayer_${Date.now()}`,
      authorId: this.currentUser.id,
      authorName: this.currentUser.name,
      authorRole: this.currentUser.role,
      category,
      content,
      prayerCount: 1,
      userPrayed: true,
      createdAt: 'Agora mesmo',
      urgent,
      answered: false,
    };

    this.prayers = [newPrayer, ...this.prayers];
    this.saveToStorage(STORAGE_KEYS.PRAYERS, this.prayers);
    offlineSyncQueue.enqueue('CREATE', 'prayer', newPrayer as unknown as Record<string, unknown>);

    setDoc(doc(db, 'prayers', newPrayer.id), newPrayer)
      .catch(err => console.warn('Erro ao salvar oração no Firestore:', err));

    return newPrayer;
  }

  public togglePrayForIntention(prayerId: string): void {
    this.prayers = this.prayers.map(prayer => {
      if (prayer.id === prayerId) {
        const nextPrayed = !prayer.userPrayed;
        const updated = {
          ...prayer,
          userPrayed: nextPrayed,
          prayerCount: nextPrayed ? prayer.prayerCount + 1 : Math.max(0, prayer.prayerCount - 1),
        };

        // Enfileira para sincronização offline
        offlineSyncQueue.enqueue('UPDATE', 'prayer', {
          prayerId,
          userPrayed: updated.userPrayed,
          prayerCount: updated.prayerCount
        });

        updateDoc(doc(db, 'prayers', prayerId), {
          prayerCount: updated.prayerCount,
          userPrayed: updated.userPrayed,
        }).catch(err => console.warn('Erro ao orar no Firestore:', err));
        return updated;
      }
      return prayer;
    });
    this.saveToStorage(STORAGE_KEYS.PRAYERS, this.prayers);
  }

  public markPrayerAnswered(prayerId: string): void {
    this.prayers = this.prayers.map(prayer => {
      if (prayer.id === prayerId) {
        const nextAnswered = !prayer.answered;

        // Enfileira para sincronização offline
        offlineSyncQueue.enqueue('UPDATE', 'prayer', {
          prayerId,
          answered: nextAnswered
        });

        updateDoc(doc(db, 'prayers', prayerId), {
          answered: nextAnswered,
        }).catch(err => console.warn('Erro ao atualizar oração no Firestore:', err));
        return {
          ...prayer,
          answered: nextAnswered,
        };
      }
      return prayer;
    });
    this.saveToStorage(STORAGE_KEYS.PRAYERS, this.prayers);
  }

  public deletePrayer(prayerId: string): void {
    this.prayers = this.prayers.filter(p => p.id !== prayerId);
    this.saveToStorage(STORAGE_KEYS.PRAYERS, this.prayers);
    offlineSyncQueue.enqueue('DELETE', 'prayer', { prayerId });

    deleteDoc(doc(db, 'prayers', prayerId))
      .catch(err => console.warn('Erro ao deletar oração no Firestore:', err));
  }

  // ---- AGENDA & RSVP ----
  public getEvents(): CalendarEvent[] {
    return this.events;
  }

  public setEventRSVP(eventId: string, status: RSVPStatus): void {
    this.events = this.events.map(ev => {
      if (ev.id === eventId) {
        const prevStatus = ev.rsvpStatus;
        let attendingCount = ev.attendingCount;
        let maybeCount = ev.maybeCount;
        let declinedCount = ev.declinedCount;

        if (prevStatus === 'attending') attendingCount = Math.max(0, attendingCount - 1);
        if (prevStatus === 'maybe') maybeCount = Math.max(0, maybeCount - 1);
        if (prevStatus === 'declined') declinedCount = Math.max(0, declinedCount - 1);

        const newStatus = prevStatus === status ? null : status;
        if (newStatus === 'attending') attendingCount++;
        if (newStatus === 'maybe') maybeCount++;
        if (newStatus === 'declined') declinedCount++;

        const updated = {
          ...ev,
          rsvpStatus: newStatus,
          attendingCount,
          maybeCount,
          declinedCount,
        };

        // Enfileira ação de RSVP para sincronização offline
        offlineSyncQueue.enqueue('UPDATE', 'rsvp', {
          eventId,
          status: newStatus,
          attendingCount,
          maybeCount,
          declinedCount
        });

        updateDoc(doc(db, 'events', eventId), {
          rsvpStatus: updated.rsvpStatus,
          attendingCount: updated.attendingCount,
          maybeCount: updated.maybeCount,
          declinedCount: updated.declinedCount,
        }).catch(err => console.warn('Erro ao atualizar RSVP no Firestore:', err));

        return updated;
      }
      return ev;
    });
    this.saveToStorage(STORAGE_KEYS.EVENTS, this.events);
  }

  public addEvent(event: Omit<CalendarEvent, 'id' | 'attendingCount' | 'maybeCount' | 'declinedCount'>): CalendarEvent {
    const newEvent: CalendarEvent = {
      ...event,
      id: `ev-${Date.now()}`,
      attendingCount: 1,
      maybeCount: 0,
      declinedCount: 0,
      rsvpStatus: 'attending',
    };
    this.events = [newEvent, ...this.events];
    this.saveToStorage(STORAGE_KEYS.EVENTS, this.events);

    // Enfileira evento criado offline
    offlineSyncQueue.enqueue('CREATE', 'event', newEvent as unknown as Record<string, unknown>);

    setDoc(doc(db, 'events', newEvent.id), newEvent)
      .catch(err => console.warn('Erro ao salvar evento no Firestore:', err));

    return newEvent;
  }

  public deleteEvent(eventId: string): void {
    this.events = this.events.filter(e => e.id !== eventId);
    this.saveToStorage(STORAGE_KEYS.EVENTS, this.events);
    offlineSyncQueue.enqueue('DELETE', 'event', { eventId });

    deleteDoc(doc(db, 'events', eventId))
      .catch(err => console.warn('Erro ao deletar evento no Firestore:', err));
  }

  /**
   * Sincroniza todas as mutações acumuladas offline quando a conectividade for restabelecida
   */
  public async syncPendingOfflineQueue(): Promise<void> {
    const items = offlineSyncQueue.getItems();
    if (items.length === 0 || !this.firebaseUser) return;

    for (const item of items) {
      try {
        if (item.entity === 'event' && item.action === 'CREATE') {
          const ev = item.payload as unknown as CalendarEvent;
          await setDoc(doc(db, 'events', ev.id), ev);
        } else if (item.entity === 'event' && item.action === 'DELETE') {
          const { eventId } = item.payload as { eventId: string };
          await deleteDoc(doc(db, 'events', eventId));
        } else if (item.entity === 'rsvp' && item.action === 'UPDATE') {
          const { eventId, status, attendingCount, maybeCount, declinedCount } = item.payload as {
            eventId: string;
            status: RSVPStatus;
            attendingCount: number;
            maybeCount: number;
            declinedCount: number;
          };
          await updateDoc(doc(db, 'events', eventId), {
            rsvpStatus: status,
            attendingCount,
            maybeCount,
            declinedCount
          });
        } else if (item.entity === 'prayer' && item.action === 'CREATE') {
          const p = item.payload as unknown as PrayerIntention;
          await setDoc(doc(db, 'prayers', p.id), p);
        } else if (item.entity === 'prayer' && item.action === 'UPDATE') {
          const { prayerId, ...rest } = item.payload as { prayerId: string; [k: string]: unknown };
          await updateDoc(doc(db, 'prayers', prayerId), rest);
        } else if (item.entity === 'prayer' && item.action === 'DELETE') {
          const { prayerId } = item.payload as { prayerId: string };
          await deleteDoc(doc(db, 'prayers', prayerId));
        }
      } catch (err) {
        console.warn(`Erro ao sincronizar item offline ${item.id}:`, err);
      }
    }

    offlineSyncQueue.clearQueue();
    this.notify();
  }

  // ---- ESCALAS DE SERVIÇO & ROTEIRO DO ENCONTRO ----
  public getScales(): MeetingScale[] {
    return this.scales;
  }

  public addScale(scaleData: Omit<MeetingScale, 'id'>): MeetingScale {
    const newScale: MeetingScale = {
      ...scaleData,
      id: `scale_${Date.now()}`,
    };
    this.scales = [newScale, ...this.scales];
    this.saveToStorage(STORAGE_KEYS.SCALES, this.scales);

    setDoc(doc(db, 'scales', newScale.id), newScale)
      .catch(err => console.warn('Erro ao salvar escala no Firestore:', err));

    return newScale;
  }

  public updateScale(id: string, partial: Partial<MeetingScale>): void {
    this.scales = this.scales.map(s => {
      if (s.id === id) {
        const updated = { ...s, ...partial };
        updateDoc(doc(db, 'scales', id), partial)
          .catch(err => console.warn('Erro ao atualizar escala no Firestore:', err));
        return updated;
      }
      return s;
    });
    this.saveToStorage(STORAGE_KEYS.SCALES, this.scales);
  }

  public deleteScale(id: string): void {
    this.scales = this.scales.filter(s => s.id !== id);
    this.saveToStorage(STORAGE_KEYS.SCALES, this.scales);
    deleteDoc(doc(db, 'scales', id))
      .catch(err => console.warn('Erro ao excluir escala no Firestore:', err));
  }

  // ---- CANCIONEIRO DA CÉLULA ----
  public getSongs(): CellSong[] {
    return this.songs;
  }

  public addSong(songData: Omit<CellSong, 'id'>): CellSong {
    const newSong: CellSong = {
      ...songData,
      id: `song_${Date.now()}`,
    };
    this.songs = [newSong, ...this.songs];
    this.saveToStorage(STORAGE_KEYS.SONGS, this.songs);

    setDoc(doc(db, 'songs', newSong.id), newSong)
      .catch(err => console.warn('Erro ao salvar cântico no Firestore:', err));

    return newSong;
  }

  public updateSong(id: string, partial: Partial<CellSong>): void {
    this.songs = this.songs.map(song => {
      if (song.id === id) {
        const updated = { ...song, ...partial };
        updateDoc(doc(db, 'songs', id), partial)
          .catch(err => console.warn('Erro ao atualizar cântico no Firestore:', err));
        return updated;
      }
      return song;
    });
    this.saveToStorage(STORAGE_KEYS.SONGS, this.songs);
  }

  public deleteSong(id: string): void {
    this.songs = this.songs.filter(s => s.id !== id);
    this.saveToStorage(STORAGE_KEYS.SONGS, this.songs);
    deleteDoc(doc(db, 'songs', id))
      .catch(err => console.warn('Erro ao excluir cântico no Firestore:', err));
  }

  // ---- LITURGIA & SANTO DO DIA ----
  public getDailyLiturgy(): DailyLiturgy {
    return this.dailyLiturgy;
  }

  public getSaintOfDay(): SaintOfDay {
    return this.saintOfDay;
  }

  // ---- GERADOR DE RESUMO PARA WHATSAPP COM 1 TOQUE ----
  public generateWhatsAppSummary(scaleId?: string): string {
    const currentScale = this.scales.find(s => s.id === scaleId) || this.scales[0] || INITIAL_SCALES[0];
    const urgentPrayers = this.prayers.filter(p => p.urgent && !p.answered).slice(0, 3);
    const recentNotices = this.notices.slice(0, 2);

    let text = `🕊️ *CÉLULA SANTA GEMMA GALGANI • COMUNIDADE SHALOM*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📅 *PRÓXIMO ENCONTRO:* ${currentScale.meetingDate}\n`;
    text += `📖 *Tema:* "${currentScale.theme}"\n`;
    text += `🎙️ *Formador(a):* ${currentScale.formador}\n\n`;

    text += `📋 *ESCALA DE SERVIÇOS:*\n`;
    text += `• 🎵 *Música / Louvor:* ${currentScale.musicLeader}\n`;
    text += `• 🚪 *Acolhida & Recepção:* ${currentScale.welcomeLeader}\n`;
    text += `• 🍞 *Lanche / Ágape Fraterno:* ${currentScale.snackLeader}\n`;
    text += `• 🕯️ *Intercessão Prévia:* ${currentScale.intercessionLeader}\n`;
    text += `• 🕊️ *Animação / Condução:* ${currentScale.animator}\n\n`;

    if (currentScale.notes) {
      text += `📌 *Observação:* ${currentScale.notes}\n\n`;
    }

    if (urgentPrayers.length > 0) {
      text += `🙏 *CADEIA DE ORAÇÃO (INTENÇÕES URGENTES):*\n`;
      urgentPrayers.forEach(p => {
        text += `• _${p.content}_ (por ${p.authorName})\n`;
      });
      text += `\n`;
    }

    if (recentNotices.length > 0) {
      text += `📢 *AVISOS DA COORDENAÇÃO:*\n`;
      recentNotices.forEach(n => {
        text += `• *${n.title}:* ${n.content.slice(0, 100)}...\n`;
      });
      text += `\n`;
    }

    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `_"Tudo por Jesus, nada sem Maria, com a bênção de Santa Gemma Galgani!"_ ✨\n`;
    text += `Shalom! Esperamos você com o coração aberto! ❤️`;

    return text;
  }

  public getWhatsAppShareLink(scaleId?: string): string {
    const text = this.generateWhatsAppSummary(scaleId);
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  }

  // ---- CHAT ----
  public getMessages(channelId: string): ChatMessage[] {
    return this.chatMessages[channelId] || [];
  }

  public sendMessage(channelId: string, text: string): ChatMessage {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      channelId,
      senderId: this.currentUser.id,
      senderName: this.currentUser.name,
      senderRole: this.currentUser.role,
      senderAvatar: this.currentUser.avatarUrl,
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    };

    const currentChannelMessages = this.chatMessages[channelId] || [];
    this.chatMessages = {
      ...this.chatMessages,
      [channelId]: [...currentChannelMessages, newMessage],
    };

    this.saveToStorage(STORAGE_KEYS.CHAT_MESSAGES, this.chatMessages);

    setDoc(doc(db, 'chats', channelId, 'messages', newMessage.id), newMessage)
      .catch(err => console.warn('Erro ao enviar mensagem no Firestore:', err));

    return newMessage;
  }

  // ---- GALERIA / ÁLBUNS ----
  public getAlbums(): GalleryAlbum[] {
    return this.albums;
  }

  public addPhotoToAlbum(albumId: string, photoData: Omit<GalleryPhoto, 'id'>): GalleryPhoto {
    const newPhoto: GalleryPhoto = {
      ...photoData,
      id: `photo_${Date.now()}`,
    };

    this.albums = this.albums.map(alb => {
      if (alb.id === albumId) {
        return {
          ...alb,
          photoCount: alb.photoCount + 1,
          photos: [newPhoto, ...alb.photos],
        };
      }
      return alb;
    });

    this.saveToStorage(STORAGE_KEYS.ALBUMS, this.albums);
    return newPhoto;
  }

  // ---- AVISOS ----
  public getNotices(): CellNotice[] {
    return this.notices;
  }

  public addNotice(noticeData: Omit<CellNotice, 'id'>): CellNotice {
    const newNotice: CellNotice = {
      ...noticeData,
      id: `notice_${Date.now()}`,
    };

    this.notices = [newNotice, ...this.notices];
    this.saveToStorage(STORAGE_KEYS.NOTICES, this.notices);

    setDoc(doc(db, 'notices', newNotice.id), newNotice)
      .catch(err => console.warn('Erro ao salvar aviso no Firestore:', err));

    return newNotice;
  }

  // ---- MÓDULO DIZIFY: ARRECADAÇÃO, BOT WHATSAPP, PIX & ANIVERSÁRIOS ----
  public getDonors(): DonorProfile[] {
    return this.donors;
  }

  public upsertDonor(data: Omit<DonorProfile, 'id' | 'totalDonated' | 'donationsCount' | 'createdAt'> & { id?: string }): DonorProfile {
    const cleanPhone = data.phone.trim();
    const existing = this.donors.find(
      d => d.id === data.id || d.phone.replace(/\D/g, '') === cleanPhone.replace(/\D/g, '')
    );

    if (existing) {
      const updated: DonorProfile = {
        ...existing,
        name: data.name.trim() || existing.name,
        phone: cleanPhone || existing.phone,
        birthDate: data.birthDate.trim() || existing.birthDate,
        email: data.email !== undefined ? data.email : existing.email,
      };
      this.donors = this.donors.map(d => (d.id === existing.id ? updated : d));
      this.saveToStorage(STORAGE_KEYS.DONORS, this.donors);

      setDoc(doc(db, 'donors', updated.id), updated).catch(err =>
        console.warn('Erro ao atualizar contribuinte no Firestore:', err)
      );
      return updated;
    }

    const created: DonorProfile = {
      id: data.id || `donor_${Date.now()}`,
      name: data.name.trim(),
      phone: cleanPhone,
      birthDate: data.birthDate.trim() || '14/10/1998',
      leadershipBadge: data.leadershipBadge || 'Membro',
      email: data.email || '',
      totalDonated: 0,
      donationsCount: 0,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };

    this.donors = [created, ...this.donors];
    this.saveToStorage(STORAGE_KEYS.DONORS, this.donors);

    setDoc(doc(db, 'donors', created.id), created).catch(err =>
      console.warn('Erro ao criar contribuinte no Firestore:', err)
    );

    return created;
  }

  public deleteDonor(donorId: string): void {
    this.donors = this.donors.filter(d => d.id !== donorId);
    this.saveToStorage(STORAGE_KEYS.DONORS, this.donors);

    deleteDoc(doc(db, 'donors', donorId)).catch(err =>
      console.warn('Erro ao remover contribuinte no Firestore:', err)
    );
  }

  public getCampaigns(): DonationCampaign[] {
    return this.campaigns;
  }

  public addCampaign(data: Omit<DonationCampaign, 'id' | 'currentAmount'>): DonationCampaign {
    const newCampaign: DonationCampaign = {
      ...data,
      id: `camp_${Date.now()}`,
      currentAmount: 0,
    };

    this.campaigns = [newCampaign, ...this.campaigns];
    this.saveToStorage(STORAGE_KEYS.CAMPAIGNS, this.campaigns);

    setDoc(doc(db, 'campaigns', newCampaign.id), newCampaign).catch(err =>
      console.warn('Erro ao criar campanha no Firestore:', err)
    );

    return newCampaign;
  }

  public deleteCampaign(campaignId: string): void {
    this.campaigns = this.campaigns.filter(c => c.id !== campaignId);
    this.saveToStorage(STORAGE_KEYS.CAMPAIGNS, this.campaigns);

    deleteDoc(doc(db, 'campaigns', campaignId)).catch(err =>
      console.warn('Erro ao remover campanha no Firestore:', err)
    );
  }

  public getDonations(): DonationRecord[] {
    return this.donations;
  }

  public createPixDonation(params: {
    donorName: string;
    donorPhone: string;
    donorBirthDate?: string;
    amount: number;
    type: DonationType;
    campaignId?: string;
    campaignTitle?: string;
    gateway?: PaymentGatewayType;
    pixCopyPaste?: string;
    externalReference?: string;
  }): DonationRecord {
    // Garante que o membro esteja cadastrado no banco de doadores
    const donor = this.upsertDonor({
      name: params.donorName,
      phone: params.donorPhone,
      birthDate: params.donorBirthDate || '14/10/1998',
    });

    const campaign = params.campaignId
      ? this.campaigns.find(c => c.id === params.campaignId)
      : undefined;

    const resolvedTitle =
      params.campaignTitle ||
      campaign?.title ||
      (params.type === 'comunhao_bens'
        ? 'Caixinha da Célula'
        : 'Oferta Espontânea da Célula');

    const pixString =
      params.pixCopyPaste ||
      generatePixCopyPaste({
        pixKey: campaign?.pixKey || 'shcelsantagemmagalganipql@gmail.com',
        merchantName: 'CELULA SANTA GEMMA',
        merchantCity: 'SAO PAULO',
        amount: params.amount,
        txid: `SG${Date.now().toString().slice(-8)}`,
        description: resolvedTitle,
      });

    const nowFormatted = new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const record: DonationRecord = {
      id: `don_${Date.now()}`,
      donorId: donor.id,
      donorName: donor.name,
      donorPhone: donor.phone,
      amount: params.amount,
      type: params.type,
      campaignId: params.campaignId,
      campaignTitle: resolvedTitle,
      status: 'pending',
      gateway: params.gateway || 'mercadopago',
      pixCopyPaste: pixString,
      externalReference: params.externalReference || `PIX_${Date.now().toString().slice(-6)}`,
      createdAt: nowFormatted,
      thankYouSent: false,
    };

    this.donations = [record, ...this.donations];
    this.saveToStorage(STORAGE_KEYS.DONATIONS, this.donations);

    setDoc(doc(db, 'donations', record.id), record).catch(err =>
      console.warn('Erro ao salvar doação pendente no Firestore:', err)
    );

    return record;
  }

  /**
   * Processa a confirmação automática do Webhook de Pagamento PIX:
   * 1. Marca a doação como 'paid' e registra paidAt + thankYouSent = true
   * 2. Soma o valor na campanha correspondente (se aplicável)
   * 3. Atualiza o histórico e total doado do membro no banco de dados
   */
  public confirmPixPaymentWebhook(donationId: string): DonationRecord | null {
    let confirmedDonation: DonationRecord | null = null;
    const paidAt = new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    this.donations = this.donations.map(don => {
      if (don.id === donationId && don.status !== 'paid') {
        const updated: DonationRecord = {
          ...don,
          status: 'paid',
          paidAt,
          thankYouSent: true,
        };
        confirmedDonation = updated;

        updateDoc(doc(db, 'donations', updated.id), {
          status: 'paid',
          paidAt,
          thankYouSent: true,
        }).catch(err => console.warn('Erro ao confirmar PIX no Firestore:', err));
        return updated;
      }
      if (don.id === donationId) {
        confirmedDonation = don;
      }
      return don;
    });

    if (confirmedDonation) {
      const target = confirmedDonation as DonationRecord;

      // Atualiza o progresso da campanha se vinculada
      if (target.campaignId) {
        this.campaigns = this.campaigns.map(c => {
          if (c.id === target.campaignId) {
            const updatedCamp = {
              ...c,
              currentAmount: c.currentAmount + target.amount,
            };
            updateDoc(doc(db, 'campaigns', c.id), {
              currentAmount: updatedCamp.currentAmount,
            }).catch(err => console.warn('Erro ao atualizar campanha no Firestore:', err));
            return updatedCamp;
          }
          return c;
        });
        this.saveToStorage(STORAGE_KEYS.CAMPAIGNS, this.campaigns);
      }

      // Atualiza o acumulado do membro contribuinte
      this.donors = this.donors.map(d => {
        if (
          d.id === target.donorId ||
          d.phone.replace(/\D/g, '') === target.donorPhone.replace(/\D/g, '')
        ) {
          const updatedDonor: DonorProfile = {
            ...d,
            totalDonated: d.totalDonated + target.amount,
            donationsCount: d.donationsCount + 1,
            lastDonationAt: paidAt,
          };
          updateDoc(doc(db, 'donors', d.id), {
            totalDonated: updatedDonor.totalDonated,
            donationsCount: updatedDonor.donationsCount,
            lastDonationAt: paidAt,
          }).catch(err => console.warn('Erro ao atualizar doador no Firestore:', err));
          return updatedDonor;
        }
        return d;
      });
      this.saveToStorage(STORAGE_KEYS.DONORS, this.donors);
      this.saveToStorage(STORAGE_KEYS.DONATIONS, this.donations);
    }

    return confirmedDonation;
  }

  // ---- CONTROLE DE FUNDO (SANTA GEMMA PARALLAX) ----
  public getBgOpacity(): number {
    return this.bgOpacity;
  }

  public setBgOpacity(opacity: number): void {
    this.bgOpacity = Math.max(0.1, Math.min(1, opacity));
    this.saveToStorage(STORAGE_KEYS.BG_OPACITY, this.bgOpacity);
  }

  // ---- RESTAURAR DADOS / LIMPAR ----
  public resetToMock(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.POSTS);
    localStorage.removeItem(STORAGE_KEYS.PRAYERS);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.ALBUMS);
    localStorage.removeItem(STORAGE_KEYS.NOTICES);
    localStorage.removeItem(STORAGE_KEYS.SCALES);
    localStorage.removeItem(STORAGE_KEYS.SONGS);
    localStorage.removeItem(STORAGE_KEYS.DONORS);
    localStorage.removeItem(STORAGE_KEYS.CAMPAIGNS);
    localStorage.removeItem(STORAGE_KEYS.DONATIONS);
    localStorage.removeItem(STORAGE_KEYS.WHATSAPP_BOT_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.BG_OPACITY);
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);

    this.currentUser = MOCK_USERS[0];
    this.posts = INITIAL_POSTS;
    this.prayers = INITIAL_PRAYERS;
    this.events = INITIAL_EVENTS;
    this.chatMessages = INITIAL_MESSAGES;
    this.albums = INITIAL_ALBUMS;
    this.notices = INITIAL_NOTICES;
    this.scales = INITIAL_SCALES;
    this.songs = INITIAL_SONGS;
    this.donors = INITIAL_DONORS;
    this.campaigns = INITIAL_CAMPAIGNS;
    this.donations = INITIAL_DONATIONS;
    this.bgOpacity = 0.45;
    this.notify();
  }
}

export const localDataService = new DataService();
export const dataService = localDataService;

