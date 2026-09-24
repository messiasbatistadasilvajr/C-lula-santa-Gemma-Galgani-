import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Users, 
  MessageSquare, 
  CheckCheck, 
  Sparkles,
  Smile
} from 'lucide-react';
import { ChatChannel, ChatMessage, UserRole } from '../types';
import { INITIAL_CHANNELS } from '../services/mockData';

interface ChatProps {
  currentUser: {
    id: string;
    name: string;
    role: UserRole;
    avatarUrl: string;
  };
  getMessages: (channelId: string) => ChatMessage[];
  onSendMessage: (channelId: string, text: string) => void;
}

export const Chat: React.FC<ChatProps> = ({
  currentUser,
  getMessages,
  onSendMessage,
}) => {
  const [activeChannelId, setActiveChannelId] = useState<string>('chan_geral');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels: ChatChannel[] = INITIAL_CHANNELS;
  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];
  const messages = getMessages(activeChannelId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, activeChannelId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(activeChannelId, inputText.trim());
    setInputText('');
  };

  const handleQuickSend = (text: string) => {
    onSendMessage(activeChannelId, text);
  };

  const roleBadge: Record<UserRole, { label: string; badge: string }> = {
    admin: { label: 'Coordenação', badge: 'bg-amber-100 text-amber-900 border-amber-300' },
    formador: { label: 'Formadora', badge: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    membro: { label: 'Membro', badge: 'bg-[#F4EFEB] text-[#7B1113] border-[#E8DFD8]' },
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-132px)] max-w-md mx-auto">
      {/* Channel Selector Bar */}
      <div className="bg-white/90 backdrop-blur-md border-b border-[#ECE7DF] px-3 py-2 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {channels.map(channel => {
            const isActive = channel.id === activeChannelId;
            return (
              <button
                key={channel.id}
                type="button"
                onClick={() => setActiveChannelId(channel.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer relative active:scale-95 ${
                  isActive
                    ? 'bg-[#7B1113] text-white shadow-xs'
                    : 'bg-[#F8F6F2] text-[#554741] hover:bg-[#EFEAE2] border border-[#ECE7DF]'
                }`}
              >
                <span>{channel.name}</span>
                {channel.unreadCount > 0 && !isActive && (
                  <span className="w-4 h-4 rounded-full bg-[#E5C158] text-[#36070D] text-[10px] font-bold flex items-center justify-center">
                    {channel.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active channel info subheader */}
      <div className="bg-[#FAF8F5]/85 backdrop-blur-sm px-4 py-2 border-b border-[#ECE7DF] flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-[#241E1C]">{activeChannel.name}</span>
        </div>
        <span className="text-[10px] text-[#8A7C75]">
          Fraternidade & Oração
        </span>
      </div>

      {/* Messages Thread - Semi-translucent so Santa Gemma is visible */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F6F2]/60 backdrop-blur-xs">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#8A7C75]">
            <MessageSquare className="w-8 h-8 mb-2 opacity-50 text-[#7B1113]" />
            <p className="text-xs font-semibold">Nenhuma mensagem neste canal ainda.</p>
            <p className="text-[11px] mt-1">Inicie a conversa partilhando com seus irmãos!</p>
          </div>
        ) : (
          messages.map(msg => {
            const isMine = msg.isMine || msg.senderId === currentUser.id;
            const badge = roleBadge[msg.senderRole] || roleBadge.membro;

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                {!isMine && (
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-7 h-7 rounded-full object-cover shrink-0 border border-[#ECE7DF] mb-1"
                  />
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-xs space-y-1 ${
                    isMine
                      ? 'bg-[#7B1113] text-white rounded-br-xs'
                      : 'bg-white/95 backdrop-blur-sm text-[#241E1C] border border-white/70 rounded-bl-xs'
                  }`}
                >
                  {/* Sender name for other users */}
                  {!isMine && (
                    <div className="flex items-center gap-1.5 pb-0.5">
                      <span className="text-[11px] font-bold text-[#7B1113]">
                        {msg.senderName}
                      </span>
                      <span className={`text-[9px] font-bold px-1 rounded border ${badge.badge}`}>
                        {badge.label}
                      </span>
                    </div>
                  )}

                  {/* Message body */}
                  <p className="text-xs leading-relaxed break-words whitespace-pre-wrap">
                    {msg.text}
                  </p>

                  {/* Timestamp and delivery check */}
                  <div
                    className={`flex items-center justify-end gap-1 text-[9px] ${
                      isMine ? 'text-white/75' : 'text-[#8A7C75]'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isMine && <CheckCheck className="w-3 h-3 text-[#E5C158]" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reaction Pills */}
      <div className="bg-white/80 backdrop-blur-sm px-3 py-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-[#ECE7DF]/60 text-xs">
        <span className="text-[10px] text-[#8A7C75] shrink-0 font-medium">Rápido:</span>
        {[
          '🙏 Amém!',
          '✨ Louvado seja Deus!',
          '❤️ Paz e Bem!',
          '✝ Santa Gemma, rogai por nós!'
        ].map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickSend(q)}
            className="px-2.5 py-0.5 rounded-full bg-[#F4EFEB] hover:bg-[#EAE2D8] active:scale-95 text-[11px] text-[#4A3D36] whitespace-nowrap transition cursor-pointer border border-[#E0D8CB]"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Message Bar */}
      <form 
        onSubmit={handleSend}
        className="bg-white/95 backdrop-blur-md border-t border-[#ECE7DF] p-2.5 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          placeholder={`Mensagem em ${activeChannel.name}...`}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          className="flex-1 rounded-xl bg-[#F8F6F2] border border-[#D9D0C5] px-3 py-2.5 text-xs text-[#241E1C] placeholder-[#8A7C75] focus:outline-[#7B1113]"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-10 h-10 rounded-xl bg-[#7B1113] hover:bg-[#580C14] active:scale-95 disabled:opacity-40 text-white flex items-center justify-center transition shadow-xs shrink-0 cursor-pointer"
          aria-label="Enviar mensagem"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
