import React from 'react';
import { 
  Home, 
  CalendarDays, 
  HeartHandshake, 
  MessageCircle, 
  User 
} from 'lucide-react';

export type MainTab = 'home' | 'agenda' | 'intercessao' | 'chat' | 'perfil';

interface BottomNavProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  unreadChatCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadChatCount = 2,
}) => {
  const tabs = [
    {
      id: 'home' as MainTab,
      label: 'Início',
      icon: Home,
    },
    {
      id: 'agenda' as MainTab,
      label: 'Agenda',
      icon: CalendarDays,
    },
    {
      id: 'intercessao' as MainTab,
      label: 'Intercessão',
      icon: HeartHandshake,
    },
    {
      id: 'chat' as MainTab,
      label: 'Chat',
      icon: MessageCircle,
      badge: unreadChatCount,
    },
    {
      id: 'perfil' as MainTab,
      label: 'Perfil',
      icon: User,
    },
  ];

  return (
    <nav 
      aria-label="Navegação principal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECE7DF] shadow-lg max-w-md mx-auto"
    >
      <div className="flex items-center justify-around h-16 px-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center transition-all relative group cursor-pointer active:scale-95 ${
                isActive ? 'text-[#7B1113]' : 'text-[#8A7C75] hover:text-[#554741]'
              }`}
            >
              {/* Active pill background indicator */}
              <div className={`relative px-3 py-1 rounded-full transition-all duration-200 ${
                isActive ? 'bg-[#7B1113]/10 font-bold' : ''
              }`}>
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#7B1113] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight transition-colors ${
                isActive ? 'font-bold text-[#7B1113]' : 'font-medium'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Safe bottom area for iOS home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};
