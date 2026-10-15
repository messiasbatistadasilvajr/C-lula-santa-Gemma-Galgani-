/**
 * Serviço de Cache Persistente Multi-Camada (IndexedDB + LocalStorage + ServiceWorker)
 * Célula Santa Gemma Galgani - Comunidade Católica Shalom
 * 
 * Garante que todas as orações e publicações do mural fiquem 100% disponíveis
 * e navegáveis mesmo quando os irmãos estiverem sem sinal de celular ou sem internet.
 */

import { CommunityPost, PrayerIntention, PersistentCacheMetadata } from '../types';
import { STORAGE_KEYS } from '../storage/localStorageKeys';
import { INITIAL_POSTS, INITIAL_PRAYERS } from './mockData';

const DB_NAME = 'santa_gemma_cache_db';
const DB_VERSION = 1;
const STORE_POSTS = 'cached_posts';
const STORE_PRAYERS = 'cached_prayers';
const STORE_META = 'cached_metadata';

class PersistentCacheService {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private memoryPosts: CommunityPost[] | null = null;
  private memoryPrayers: PrayerIntention[] | null = null;
  private metadata: PersistentCacheMetadata;

  constructor() {
    this.metadata = this.loadMetadata();
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      this.initIndexedDB();
    }
  }

  // ---- INDEXEDDB INITIALIZATION ----
  private initIndexedDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_POSTS)) {
            db.createObjectStore(STORE_POSTS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORE_PRAYERS)) {
            db.createObjectStore(STORE_PRAYERS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORE_META)) {
            db.createObjectStore(STORE_META, { keyPath: 'key' });
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = (e) => {
          console.warn('IndexedDB não pôde ser aberto, utilizando LocalStorage como fallback:', e);
          reject(e);
        };
      } catch (err) {
        console.warn('Erro ao inicializar IndexedDB:', err);
        reject(err);
      }
    });

    return this.dbPromise;
  }

  // ---- METADATA MANAGEMENT ----
  private loadMetadata(): PersistentCacheMetadata {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CACHE_METADATA);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }

    return {
      lastUpdated: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      lastSyncedTimestamp: Date.now(),
      postsCount: INITIAL_POSTS.length,
      prayersCount: INITIAL_PRAYERS.length,
      offlinePendingPostsCount: 0,
      offlinePendingPrayersCount: 0,
      isHealthy: true,
      source: 'localstorage',
    };
  }

  private saveMetadata(partial: Partial<PersistentCacheMetadata>): void {
    this.metadata = {
      ...this.metadata,
      ...partial,
      lastUpdated: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    try {
      localStorage.setItem(STORAGE_KEYS.CACHE_METADATA, JSON.stringify(this.metadata));
    } catch (e) {
      console.warn('Erro ao salvar metadados do cache:', e);
    }

    this.notifyCacheUpdate();
  }

  public getCacheMetadata(): PersistentCacheMetadata {
    return this.metadata;
  }

  private notifyCacheUpdate(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('persistent-cache-changed', {
        detail: this.metadata,
      }));
    }
  }

  // ---- POSTS CACHE (MURAL) ----
  public async savePosts(posts: CommunityPost[]): Promise<void> {
    this.memoryPosts = posts;

    // 1. Salva no LocalStorage (acesso síncrono imediato)
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    } catch (e) {
      console.warn('LocalStorage cheio para posts, confiando no IndexedDB:', e);
    }

    // 2. Salva no IndexedDB (alta capacidade p/ fotos e comentários)
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      try {
        const db = await this.initIndexedDB();
        const tx = db.transaction([STORE_POSTS], 'readwrite');
        const store = tx.objectStore(STORE_POSTS);
        store.clear();
        posts.forEach(post => store.put(post));
      } catch (err) {
        console.warn('Erro ao persistir posts no IndexedDB:', err);
      }
    }

    const pendingCount = this.getPendingPostsCount();
    this.saveMetadata({
      postsCount: posts.length,
      lastSyncedTimestamp: Date.now(),
      offlinePendingPostsCount: pendingCount,
      source: 'indexeddb',
    });
  }

  public getPostsSync(fallback: CommunityPost[] = INITIAL_POSTS): CommunityPost[] {
    if (this.memoryPosts && this.memoryPosts.length > 0) {
      return this.memoryPosts;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.POSTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.memoryPosts = parsed;
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Erro ao ler posts do cache localStorage:', e);
    }

    this.memoryPosts = fallback;
    return fallback;
  }

  public async getPostsFromIndexedDB(): Promise<CommunityPost[]> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return this.getPostsSync();
    }

    try {
      const db = await this.initIndexedDB();
      return new Promise((resolve) => {
        const tx = db.transaction([STORE_POSTS], 'readonly');
        const store = tx.objectStore(STORE_POSTS);
        const req = store.getAll();
        req.onsuccess = () => {
          if (req.result && req.result.length > 0) {
            this.memoryPosts = req.result;
            resolve(req.result);
          } else {
            resolve(this.getPostsSync());
          }
        };
        req.onerror = () => {
          resolve(this.getPostsSync());
        };
      });
    } catch {
      return this.getPostsSync();
    }
  }

  // ---- PRAYERS CACHE (INTERCESSÃO) ----
  public async savePrayers(prayers: PrayerIntention[]): Promise<void> {
    this.memoryPrayers = prayers;

    // 1. Salva no LocalStorage
    try {
      localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify(prayers));
    } catch (e) {
      console.warn('LocalStorage cheio para orações:', e);
    }

    // 2. Salva no IndexedDB
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      try {
        const db = await this.initIndexedDB();
        const tx = db.transaction([STORE_PRAYERS], 'readwrite');
        const store = tx.objectStore(STORE_PRAYERS);
        store.clear();
        prayers.forEach(prayer => store.put(prayer));
      } catch (err) {
        console.warn('Erro ao persistir orações no IndexedDB:', err);
      }
    }

    const pendingCount = this.getPendingPrayersCount();
    this.saveMetadata({
      prayersCount: prayers.length,
      lastSyncedTimestamp: Date.now(),
      offlinePendingPrayersCount: pendingCount,
      source: 'indexeddb',
    });
  }

  public getPrayersSync(fallback: PrayerIntention[] = INITIAL_PRAYERS): PrayerIntention[] {
    if (this.memoryPrayers && this.memoryPrayers.length > 0) {
      return this.memoryPrayers;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRAYERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.memoryPrayers = parsed;
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Erro ao ler orações do cache localStorage:', e);
    }

    this.memoryPrayers = fallback;
    return fallback;
  }

  public async getPrayersFromIndexedDB(): Promise<PrayerIntention[]> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return this.getPrayersSync();
    }

    try {
      const db = await this.initIndexedDB();
      return new Promise((resolve) => {
        const tx = db.transaction([STORE_PRAYERS], 'readonly');
        const store = tx.objectStore(STORE_PRAYERS);
        const req = store.getAll();
        req.onsuccess = () => {
          if (req.result && req.result.length > 0) {
            this.memoryPrayers = req.result;
            resolve(req.result);
          } else {
            resolve(this.getPrayersSync());
          }
        };
        req.onerror = () => {
          resolve(this.getPrayersSync());
        };
      });
    } catch {
      return this.getPrayersSync();
    }
  }

  // ---- FILAS DE SINCRONIZAÇÃO OFFLINE DEDICADAS (MURAL & ORAÇÕES) ----
  public recordOfflinePost(post: CommunityPost): void {
    try {
      const current = this.getPendingPosts();
      const filtered = current.filter(p => p.id !== post.id);
      filtered.unshift({ ...post, isOfflinePending: true });
      localStorage.setItem(STORAGE_KEYS.OFFLINE_PENDING_POSTS, JSON.stringify(filtered));
      this.saveMetadata({ offlinePendingPostsCount: filtered.length });
    } catch (e) {
      console.warn('Erro ao registrar post offline:', e);
    }
  }

  public getPendingPosts(): CommunityPost[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.OFFLINE_PENDING_POSTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public getPendingPostsCount(): number {
    return this.getPendingPosts().length;
  }

  public removePendingPost(postId: string): void {
    try {
      const current = this.getPendingPosts();
      const updated = current.filter(p => p.id !== postId);
      localStorage.setItem(STORAGE_KEYS.OFFLINE_PENDING_POSTS, JSON.stringify(updated));
      this.saveMetadata({ offlinePendingPostsCount: updated.length });
    } catch (e) {
      console.warn('Erro ao remover post pendente:', e);
    }
  }

  public recordOfflinePrayer(prayer: PrayerIntention): void {
    try {
      const current = this.getPendingPrayers();
      const filtered = current.filter(p => p.id !== prayer.id);
      filtered.unshift({ ...prayer, isOfflinePending: true });
      localStorage.setItem(STORAGE_KEYS.OFFLINE_PENDING_PRAYERS, JSON.stringify(filtered));
      this.saveMetadata({ offlinePendingPrayersCount: filtered.length });
    } catch (e) {
      console.warn('Erro ao registrar oração offline:', e);
    }
  }

  public getPendingPrayers(): PrayerIntention[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.OFFLINE_PENDING_PRAYERS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public getPendingPrayersCount(): number {
    return this.getPendingPrayers().length;
  }

  public removePendingPrayer(prayerId: string): void {
    try {
      const current = this.getPendingPrayers();
      const updated = current.filter(p => p.id !== prayerId);
      localStorage.setItem(STORAGE_KEYS.OFFLINE_PENDING_PRAYERS, JSON.stringify(updated));
      this.saveMetadata({ offlinePendingPrayersCount: updated.length });
    } catch (e) {
      console.warn('Erro ao remover oração pendente:', e);
    }
  }

  // ---- ESTIMATIVA DE ESPAÇO PERSISTIDO ----
  public async estimateStorageUsage(): Promise<{ usedBytes: number; quotaBytes: number; percentage: number }> {
    if (typeof navigator !== 'undefined' && 'storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        const used = estimate.usage || 0;
        const quota = estimate.quota || 0;
        const percentage = quota > 0 ? (used / quota) * 100 : 0;
        return {
          usedBytes: used,
          quotaBytes: quota,
          percentage: Math.min(100, Math.round(percentage * 10) / 10),
        };
      } catch {
        // fallback
      }
    }

    // Estimativa com base no localStorage
    let totalChars = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          totalChars += (localStorage.getItem(key) || '').length;
        }
      }
    } catch {
      // fallback
    }

    return {
      usedBytes: totalChars * 2, // UTF-16
      quotaBytes: 5 * 1024 * 1024,
      percentage: Math.round(((totalChars * 2) / (5 * 1024 * 1024)) * 100),
    };
  }
}

export const persistentCacheService = new PersistentCacheService();
