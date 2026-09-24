/**
 * Arquitetura de Fila de Sincronização Offline (Camada 1 -> Camada 2)
 * 
 * Permite que ações realizadas sem conexão sejam enfileiradas e posteriormente
 * enviadas para o Supabase PostgreSQL quando a conectividade for restabelecida.
 */

import { SyncQueueItem } from '../types';
import { STORAGE_KEYS } from './localStorageKeys';

class OfflineSyncQueueManager {
  private getQueue(): SyncQueueItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveQueue(queue: SyncQueueItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
    } catch (err) {
      console.warn('Erro ao salvar fila offline:', err);
    }
  }

  public enqueue(action: SyncQueueItem['action'], entity: SyncQueueItem['entity'], payload: Record<string, unknown>): SyncQueueItem {
    const item: SyncQueueItem = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      action,
      entity,
      payload,
      createdAt: Date.now(),
      attempts: 0,
    };

    const current = this.getQueue();
    current.push(item);
    this.saveQueue(current);
    return item;
  }

  public getPendingCount(): number {
    return this.getQueue().length;
  }

  public getItems(): SyncQueueItem[] {
    return this.getQueue();
  }

  public clearQueue(): void {
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
  }
}

export const offlineSyncQueue = new OfflineSyncQueueManager();
