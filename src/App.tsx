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
import { TercoVirtual } from './pages/TercoVirtual';
import { NovenaTestemunhos } from './pages/NovenaTestemunhos';
import { ModoEncontro } from './pages/ModoEncontro';
import { OfertasDizify } from './pages/OfertasDizify';

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
          donors={data.donors}
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
          onNavigate={(tab) => setCurrentTab(tab)}
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
          onNavigate={(tab) => setCurrentTab(tab)}
        />
      )}

      {currentTab === 'agenda' && (
        <Agenda
          events={data.events}
          onSetRSVP={data.setEventRSVP}
          currentRole={data.currentUser.role}
          onAddEvent={data.addEvent}
          onDeleteEvent={data.deleteEvent}
          onNavigate={(tab) => setCurrentTab(tab)}
        />
      )}

      {currentTab === 'intercessao' && (
        <Intercessao
          prayers={data.prayers}
          onTogglePray={data.togglePrayForIntention}
          onAddPrayer={data.addPrayer}
          onMarkAnswered={data.markPrayerAnswered}
          onDeletePrayer={data.deletePrayer}
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
          donors={data.donors}
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
        <SantaGemma 
          onBack={() => setCurrentTab('home')} 
          onNavigate={(tab) => setCurrentTab(tab)}
        />
      )}

      {currentTab === 'terco' && (
        <TercoVirtual
          onBack={() => setCurrentTab('home')}
          cellIntention="Pela fidelidade dos irmãos da Célula Santa Gemma Galgani, frutos vocacionais e paz nas famílias."
        />
      )}

      {currentTab === 'novena' && (
        <NovenaTestemunhos
          onBack={() => setCurrentTab('home')}
          currentRole={data.currentUser.role}
          userName={data.currentUser.name}
          onNavigateToTerco={() => setCurrentTab('terco')}
        />
      )}

      {currentTab === 'modo-encontro' && (
        <ModoEncontro
          onBack={() => setCurrentTab('home')}
          songs={data.songs}
          currentScale={data.scales[0]}
          currentRole={data.currentUser.role}
          onNavigateToCancioneiro={() => setCurrentTab('cancioneiro')}
        />
      )}

      {(currentTab === 'ofertas' || currentTab === 'membros') && (
        <OfertasDizify
          donors={data.donors}
          campaigns={data.campaigns}
          donations={data.donations}
          currentRole={data.currentUser.role}
          userName={data.currentUser.name}
          initialTab={currentTab === 'membros' ? 'membros-db' : 'whatsapp-bot'}
          onUpsertDonor={data.upsertDonor}
          onDeleteDonor={data.deleteDonor}
          onAddCampaign={data.addCampaign}
          onDeleteCampaign={data.deleteCampaign}
          onCreatePixDonation={data.createPixDonation}
          onConfirmWebhook={data.confirmPixPaymentWebhook}
          onBack={() => setCurrentTab('home')}
        />
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
