import React, { useState } from 'react';
import { Header } from './Header';
import { BottomNav, MainTab } from './BottomNav';
import { SecondaryMenuSheet } from './SecondaryMenuSheet';
import { PWAInstallBanner } from '../common/PWAInstallBanner';
import { OfflineIndicator } from '../common/OfflineIndicator';
import { ParallaxSantaGemmaBg } from '../common/ParallaxSantaGemmaBg';
import { CellReminderNotifier } from '../common/CellReminderNotifier';
import { UserRole } from '../../types';

interface MobileShellProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  bgOpacity: number;
  onSetBgOpacity: (opacity: number) => void;
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({
  activeTab,
  onTabChange,
  currentRole,
  onSwitchRole,
  bgOpacity,
  onSetBgOpacity,
  children,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Cycle background opacity: 0.35 -> 0.55 -> 0.75 -> 0.90 -> 0.35
  const handleToggleBgOpacity = () => {
    const steps = [0.35, 0.55, 0.75, 0.90];
    const currentIndex = steps.findIndex(s => Math.abs(s - bgOpacity) < 0.1);
    const nextIndex = currentIndex === -1 || currentIndex === steps.length - 1 ? 0 : currentIndex + 1;
    onSetBgOpacity(steps[nextIndex]);
  };

  // Map sub-tabs to active indicator
  const isMainTab = ['home', 'agenda', 'intercessao', 'chat', 'perfil'].includes(activeTab);
  const bottomNavActive: MainTab = isMainTab ? (activeTab as MainTab) : 'home';

  return (
    <div className="min-h-screen relative flex justify-center text-[#241E1C] overflow-x-hidden selection:bg-[#7B1113] selection:text-white">
      {/* 
        PARALLAX SANTA GEMMA BACKGROUND:
        Covers the ENTIRE page/viewport behind everything, with smooth parallax motion on scroll.
      */}
      <ParallaxSantaGemmaBg opacity={bgOpacity} />

      {/* Mobile container - Responsive smartphone frame centered on desktop with elegant translucent backdrop */}
      <div className="w-full max-w-md min-h-screen bg-[#FBF9F6]/80 backdrop-blur-md shadow-2xl flex flex-col relative border-x border-[#E0D8CB]/70 z-10">
        {/* Offline indicator banner */}
        <OfflineIndicator />

        {/* Agendador Global de Lembretes Push e Locais (Segundas e Sextas às 19:00) */}
        <CellReminderNotifier
          onNavigateToAgenda={() => onTabChange('agenda')}
          onNavigateToLiveMeeting={() => onTabChange('modo-encontro')}
        />

        {/* Mobile Header */}
        <div className="relative z-30">
          <Header
            onOpenMenu={() => setIsMenuOpen(true)}
            onOpenNotices={() => onTabChange('avisos')}
            onGoHome={() => onTabChange('home')}
            currentRole={currentRole}
            bgOpacity={bgOpacity}
            onToggleBgOpacity={handleToggleBgOpacity}
          />
        </div>

        {/* PWA Install Banner */}
        <div className="relative z-20">
          <PWAInstallBanner />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden relative z-10 pb-4">
          {children}
        </main>

        {/* Fixed Bottom Navigation */}
        <div className="relative z-40">
          <BottomNav
            activeTab={bottomNavActive}
            onTabChange={(tab) => onTabChange(tab)}
          />
        </div>

        {/* Secondary Menu Drawer */}
        <SecondaryMenuSheet
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onNavigate={(tabId) => onTabChange(tabId)}
          currentRole={currentRole}
          onSwitchRole={onSwitchRole}
        />
      </div>
    </div>
  );
};
