import React, { useState } from 'react';
import { useData } from './hooks/useData';
import { MobileShell } from './components/layouts/MobileShell';
import { Home } from './pages/Home';
import { Agenda } from './pages/Agenda';
import { Intercessao } from './pages/Intercessao';
import { Chat } from './pages/Chat';
import { Perfil } from './pages/Perfil';
import { Galeria } from './pages/Galeria';
import { Formacao } from './pages/Formacao';
import { Avisos } from './pages/Avisos';
import { SantaGemma } from './pages/SantaGemma';
import { SimuladorPermissoes } from './pages/SimuladorPermissoes';
import { Escalas } from './pages/Escalas';
import { Liturgia } from './pages/Liturgia';
import { Cancioneiro } from './pages/Cancioneiro';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const data = useData();

  return (
    <MobileShell
      activeTab={currentTab}
      onTabChange={setCurrentTab}
      currentRole={data.currentUser.role}
      onSwitchRole={data.switchRole}
      bgOpacity={data.bgOpacity}
      onSetBgOpacity={data.setBgOpacity}
    >
      {currentTab === 'home' && (
        <Home
          currentUser={data.currentUser}
          posts={data.posts}
          onLikePost={data.togglePostLike}
          onAddComment={data.addComment}
          onAddPost={data.addPost}
          onNavigateToAgenda={() => setCurrentTab('agenda')}
          onNavigate={(tab) => setCurrentTab(tab)}
        />
      )}

      {currentTab === 'escalas' && (
        <Escalas
          scales={data.scales}
          currentRole={data.currentUser.role}
          onAddScale={data.addScale}
          onUpdateScale={data.updateScale}
          onGenerateWhatsApp={data.generateWhatsAppSummary}
          getWhatsAppShareUrl={data.getWhatsAppShareLink}
          onBack={() => setCurrentTab('home')}
        />
      )}

      {currentTab === 'liturgia' && (
        <Liturgia
          liturgy={data.dailyLiturgy}
          saint={data.saintOfDay}
          onBack={() => setCurrentTab('home')}
        />
      )}

      {currentTab === 'cancioneiro' && (
        <Cancioneiro
          songs={data.songs}
          currentRole={data.currentUser.role}
          onAddSong={data.addSong}
          onBack={() => setCurrentTab('home')}
        />
      )}

      {currentTab === 'agenda' && (
        <Agenda
          events={data.events}
          onSetRSVP={data.setEventRSVP}
          currentRole={data.currentUser.role}
          onAddEvent={data.addEvent}
          onNavigate={(tab) => setCurrentTab(tab)}
        />
      )}

      {currentTab === 'intercessao' && (
        <Intercessao
          prayers={data.prayers}
          onTogglePray={data.togglePrayForIntention}
          onAddPrayer={data.addPrayer}
          onMarkAnswered={data.markPrayerAnswered}
        />
      )}

      {currentTab === 'chat' && (
        <Chat
          currentUser={data.currentUser}
          getMessages={data.getMessages}
          onSendMessage={data.sendMessage}
        />
      )}

      {currentTab === 'perfil' && (
        <Perfil
          currentUser={data.currentUser}
          posts={data.posts}
          prayers={data.prayers}
          events={data.events}
          onSwitchRole={data.switchRole}
          onUpdateProfile={data.updateProfile}
          onResetToMock={data.resetToMock}
          bgOpacity={data.bgOpacity}
          onSetBgOpacity={data.setBgOpacity}
          onNavigate={(tab) => setCurrentTab(tab)}
          firebaseUser={data.firebaseUser}
          isConnectedToFirebase={data.isConnectedToFirebase}
          onLoginWithGoogle={data.loginWithGoogle}
          onLogoutFirebase={data.logout}
        />
      )}

      {currentTab === 'galeria' && (
        <Galeria 
          albums={data.albums}
          onBack={() => setCurrentTab('home')}
          onAddPhoto={data.addPhotoToAlbum}
        />
      )}

      {currentTab === 'formacao' && (
        <Formacao onBack={() => setCurrentTab('home')} />
      )}

      {currentTab === 'avisos' && (
        <Avisos 
          notices={data.notices}
          currentRole={data.currentUser.role}
          onBack={() => setCurrentTab('home')}
          onAddNotice={data.addNotice}
        />
      )}

      {currentTab === 'santagemma' && (
        <SantaGemma onBack={() => setCurrentTab('home')} />
      )}

      {currentTab === 'permissoes' && (
        <SimuladorPermissoes
          currentRole={data.currentUser.role}
          onSwitchRole={data.switchRole}
          onNavigate={(tab) => setCurrentTab(tab)}
          onBack={() => setCurrentTab('perfil')}
        />
      )}
    </MobileShell>
  );
}
