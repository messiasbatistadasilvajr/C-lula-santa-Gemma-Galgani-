import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { offlineSyncQueue } from '../../storage/syncQueue';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const pendingCount = offlineSyncQueue.getPendingCount();

  if (isOnline && pendingCount === 0) return null;

  if (!isOnline) {
    return (
      <div 
        id="offline-status-banner"
        className="fixed top-14 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full bg-[#B85324] px-4 py-1.5 text-xs font-semibold text-white shadow-lg border border-white/20 animate-pulse"
      >
        <WifiOff className="w-3.5 h-3.5" />
        <span>Modo Offline — Dados locais em uso</span>
      </div>
    );
  }

  // Se voltou online e tem fila pendente
  return (
    <div 
      id="sync-queue-banner"
      className="fixed top-14 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full bg-[#276F50] px-4 py-1.5 text-xs font-semibold text-white shadow-lg border border-white/20"
    >
      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
      <span>{pendingCount} ação(ões) aguardando sincronização com a nuvem</span>
    </div>
  );
};
