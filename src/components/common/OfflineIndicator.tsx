import React, { useState, useEffect } from 'react';
import { WifiOff, Cloud, RefreshCw, CheckCircle2, X } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { offlineSyncQueue } from '../../storage/syncQueue';
import { dataService } from '../../services/dataService';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [pendingCount, setPendingCount] = useState<number>(() => offlineSyncQueue.getPendingCount());
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Escuta atualizações da fila offline e conectividade
  useEffect(() => {
    const updateCount = () => {
      const count = offlineSyncQueue.getPendingCount();
      setPendingCount(count);
      // Se houver novas ações adicionadas à fila, reabre o aviso
      if (count > 0) {
        setIsDismissed(false);
        setIsExiting(false);
      }
    };

    window.addEventListener('offline-sync-queue-updated', updateCount);
    window.addEventListener('storage', updateCount);
    window.addEventListener('online', updateCount);
    window.addEventListener('offline', updateCount);

    return () => {
      window.removeEventListener('offline-sync-queue-updated', updateCount);
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('online', updateCount);
      window.removeEventListener('offline', updateCount);
    };
  }, []);

  // Função para fechar/dispensar com animação suave de saída
  const handleDismiss = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsExiting(true);
    setTimeout(() => {
      setIsDismissed(true);
      setIsExiting(false);
    }, 280);
  };

  // Função para disparar sincronização com a nuvem e sair da tela
  const handleTriggerSync = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isOnline) {
      handleDismiss();
      return;
    }

    try {
      setIsSyncing(true);
      await dataService.syncPendingOfflineQueue();
      setSyncSuccess(true);
      setPendingCount(offlineSyncQueue.getPendingCount());
      // Aguarda 1.2s para o usuário visualizar a confirmação e sai da tela
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsDismissed(true);
          setIsExiting(false);
          setSyncSuccess(false);
          setIsSyncing(false);
        }, 280);
      }, 1200);
    } catch (err) {
      console.warn('Erro ao sincronizar com a nuvem:', err);
      setIsSyncing(false);
      handleDismiss();
    }
  };

  // Se tudo sincronizado e online, ou se dispensado pelo usuário, sai da tela
  if (isDismissed) return null;
  if (isOnline && pendingCount === 0 && !syncSuccess) return null;

  // Banner no Modo Offline (sem internet)
  if (!isOnline) {
    return (
      <div
        id="offline-status-banner"
        role="alert"
        aria-live="polite"
        className={`fixed top-14 sm:top-16 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-sm sm:max-w-md transition-all duration-300 ease-out select-none ${
          isExiting ? 'opacity-0 -translate-y-4 scale-95 pointer-events-none' : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        <div
          onClick={handleDismiss}
          className="w-full flex items-center justify-between gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-[#943F17] to-[#B85324] text-white shadow-xl border border-white/25 backdrop-blur-md cursor-pointer hover:brightness-105 active:scale-98 transition group"
          title="Modo offline: toque para fechar o aviso"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-1 rounded-full bg-white/20 shrink-0">
              <WifiOff className="w-4 h-4 animate-pulse text-white" />
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-xs font-bold leading-tight truncate">
                Modo Offline
              </span>
              <span className="text-[10px] sm:text-[11px] text-white/90 leading-tight truncate">
                Dados locais em uso • Toque para fechar
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Fechar aviso de modo offline"
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 active:scale-90 transition-transform cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Banner responsivo de sincronização com a nuvem (Fila Pendente ou Sucesso)
  return (
    <div
      id="sync-queue-banner"
      role="status"
      aria-live="polite"
      className={`fixed top-14 sm:top-16 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-sm sm:max-w-md transition-all duration-300 ease-out select-none ${
        isExiting ? 'opacity-0 -translate-y-4 scale-95 pointer-events-none' : 'opacity-100 translate-y-0 scale-100'
      }`}
    >
      <div
        onClick={syncSuccess ? handleDismiss : handleTriggerSync}
        className={`w-full flex items-center justify-between gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-white shadow-xl border border-white/25 backdrop-blur-md cursor-pointer hover:brightness-105 active:scale-98 transition ${
          syncSuccess
            ? 'bg-gradient-to-r from-[#186343] to-[#2E8B57]'
            : 'bg-gradient-to-r from-[#1E563E] to-[#276F50]'
        }`}
        title="Toque para sincronizar e sair da tela"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="p-1.5 rounded-full bg-white/20 shrink-0 flex items-center justify-center">
            {isSyncing ? (
              <RefreshCw className="w-4 h-4 text-white animate-spin" />
            ) : syncSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-white" />
            ) : (
              <Cloud className="w-4 h-4 text-white" />
            )}
          </span>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              {!isSyncing && !syncSuccess && (
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping inline-block" />
              )}
              <span className="text-xs sm:text-xs font-bold leading-tight truncate">
                {isSyncing
                  ? 'Sincronizando com a nuvem...'
                  : syncSuccess
                  ? 'Sincronizado com a Nuvem!'
                  : `${pendingCount} ${pendingCount === 1 ? 'ação aguardando' : 'ações aguardando'}`}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-white/90 leading-tight truncate">
              {isSyncing
                ? 'Enviando dados para o servidor...'
                : syncSuccess
                ? 'Tudo atualizado no Firebase com sucesso!'
                : 'Sincronização com a nuvem • Toque para enviar e sair'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!syncSuccess && !isSyncing && (
            <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
              Sincronizar
            </span>
          )}

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dispensar aviso de sincronização"
            title="Dispensar aviso"
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 active:scale-90 transition-transform cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
