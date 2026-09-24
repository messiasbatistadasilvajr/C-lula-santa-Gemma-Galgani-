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
  UserRole
} from '../types';
import { STORAGE_KEYS } from '../storage/localStorageKeys';
import { offlineSyncQueue } from '../storage/syncQueue';
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
  INITIAL_SONGS
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
    this.dailyLiturgy = SAMPLE_LITURGY;
    this.saintOfDay = SAMPLE_SAINT;
    this.bgOpacity = this.loadFromStorage(STORAGE_KEYS.BG_OPACITY, 0.45);

    this.initFirebaseAuth();
  }

  private loadFromStorage<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
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
          // Atualiza perfil com dados reais da conta Google
          const isAdminEmail = user.email === 'messiasbjunior76@gmail.com';
          this.currentUser = {
            ...this.currentUser,
            id: user.uid,
            name: user.displayName || this.currentUser.name,
            email: user.email || this.currentUser.email,
            avatarUrl: user.photoURL || this.currentUser.avatarUrl,
            role: isAdminEmail ? 'admin' : this.currentUser.role,
          };
          this.saveToStorage(STORAGE_KEYS.CURRENT_USER, this.currentUser);
          this.setupFirestoreListeners();
        } else {
          this.teardownFirestoreListeners();
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
      const isAdminEmail = user.email === 'messiasbjunior76@gmail.com';
      this.currentUser = {
        ...this.currentUser,
        id: user.uid,
        name: user.displayName || 'Membro Shalom',
        email: user.email || '',
        avatarUrl: user.photoURL || this.currentUser.avatarUrl,
        role: isAdminEmail ? 'admin' : this.currentUser.role,
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

    if (this.firebaseUser) {
      const path = `posts/${newPost.id}`;
      setDoc(doc(db, 'posts', newPost.id), newPost)
        .catch(err => {
          console.warn('Erro ao salvar post no Firestore:', err);
        });
    }

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
        if (this.firebaseUser) {
          updateDoc(doc(db, 'posts', postId), {
            likesCount: updated.likesCount,
            hasLiked: updated.hasLiked,
          }).catch(err => console.warn('Erro ao curtir post no Firestore:', err));
        }
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

        if (this.firebaseUser) {
          setDoc(doc(db, 'posts', postId, 'comments', newComment.id), newComment)
            .catch(err => console.warn('Erro ao salvar comentário no Firestore:', err));
        }

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

    if (this.firebaseUser) {
      setDoc(doc(db, 'prayers', newPrayer.id), newPrayer)
        .catch(err => console.warn('Erro ao salvar oração no Firestore:', err));
    }

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
        if (this.firebaseUser) {
          updateDoc(doc(db, 'prayers', prayerId), {
            prayerCount: updated.prayerCount,
            userPrayed: updated.userPrayed,
          }).catch(err => console.warn('Erro ao orar no Firestore:', err));
        }
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
        if (this.firebaseUser) {
          updateDoc(doc(db, 'prayers', prayerId), {
            answered: nextAnswered,
          }).catch(err => console.warn('Erro ao atualizar oração no Firestore:', err));
        }
        return {
          ...prayer,
          answered: nextAnswered,
        };
      }
      return prayer;
    });
    this.saveToStorage(STORAGE_KEYS.PRAYERS, this.prayers);
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

        if (this.firebaseUser) {
          updateDoc(doc(db, 'events', eventId), {
            rsvpStatus: updated.rsvpStatus,
            attendingCount: updated.attendingCount,
            maybeCount: updated.maybeCount,
            declinedCount: updated.declinedCount,
          }).catch(err => console.warn('Erro ao atualizar RSVP no Firestore:', err));
        }

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

    if (this.firebaseUser) {
      setDoc(doc(db, 'events', newEvent.id), newEvent)
        .catch(err => console.warn('Erro ao salvar evento no Firestore:', err));
    }

    return newEvent;
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

    if (this.firebaseUser) {
      setDoc(doc(db, 'scales', newScale.id), newScale)
        .catch(err => console.warn('Erro ao salvar escala no Firestore:', err));
    }

    return newScale;
  }

  public updateScale(id: string, partial: Partial<MeetingScale>): void {
    this.scales = this.scales.map(s => {
      if (s.id === id) {
        const updated = { ...s, ...partial };
        if (this.firebaseUser) {
          updateDoc(doc(db, 'scales', id), partial)
            .catch(err => console.warn('Erro ao atualizar escala no Firestore:', err));
        }
        return updated;
      }
      return s;
    });
    this.saveToStorage(STORAGE_KEYS.SCALES, this.scales);
  }

  public deleteScale(id: string): void {
    this.scales = this.scales.filter(s => s.id !== id);
    this.saveToStorage(STORAGE_KEYS.SCALES, this.scales);
    if (this.firebaseUser) {
      deleteDoc(doc(db, 'scales', id))
        .catch(err => console.warn('Erro ao excluir escala no Firestore:', err));
    }
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

    if (this.firebaseUser) {
      setDoc(doc(db, 'songs', newSong.id), newSong)
        .catch(err => console.warn('Erro ao salvar cântico no Firestore:', err));
    }

    return newSong;
  }

  public updateSong(id: string, partial: Partial<CellSong>): void {
    this.songs = this.songs.map(song => {
      if (song.id === id) {
        const updated = { ...song, ...partial };
        if (this.firebaseUser) {
          updateDoc(doc(db, 'songs', id), partial)
            .catch(err => console.warn('Erro ao atualizar cântico no Firestore:', err));
        }
        return updated;
      }
      return song;
    });
    this.saveToStorage(STORAGE_KEYS.SONGS, this.songs);
  }

  public deleteSong(id: string): void {
    this.songs = this.songs.filter(s => s.id !== id);
    this.saveToStorage(STORAGE_KEYS.SONGS, this.songs);
    if (this.firebaseUser) {
      deleteDoc(doc(db, 'songs', id))
        .catch(err => console.warn('Erro ao excluir cântico no Firestore:', err));
    }
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

    if (this.firebaseUser) {
      setDoc(doc(db, 'chats', channelId, 'messages', newMessage.id), newMessage)
        .catch(err => console.warn('Erro ao enviar mensagem no Firestore:', err));
    }

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

    if (this.firebaseUser) {
      setDoc(doc(db, 'notices', newNotice.id), newNotice)
        .catch(err => console.warn('Erro ao salvar aviso no Firestore:', err));
    }

    return newNotice;
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
    this.bgOpacity = 0.45;
    this.notify();
  }
}

export const localDataService = new DataService();
export const dataService = localDataService;
