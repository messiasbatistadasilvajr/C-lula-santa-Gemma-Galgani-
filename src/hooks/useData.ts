import { useState, useEffect } from 'react';
import { localDataService } from '../services/dataService';

export function useData() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = localDataService.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  return {
    currentUser: localDataService.getCurrentUser(),
    posts: localDataService.getPosts(),
    prayers: localDataService.getPrayers(),
    events: localDataService.getEvents(),
    albums: localDataService.getAlbums(),
    notices: localDataService.getNotices(),
    scales: localDataService.getScales(),
    songs: localDataService.getSongs(),
    donors: localDataService.getDonors(),
    campaigns: localDataService.getCampaigns(),
    donations: localDataService.getDonations(),
    dailyLiturgy: localDataService.getDailyLiturgy(),
    saintOfDay: localDataService.getSaintOfDay(),
    bgOpacity: localDataService.getBgOpacity(),
    firebaseUser: localDataService.getFirebaseUser(),
    isConnectedToFirebase: localDataService.isConnectedToFirebase(),
    
    // Actions
    loginWithGoogle: () => localDataService.loginWithGoogle(),
    logout: () => localDataService.logout(),
    updateProfile: (data: Parameters<typeof localDataService.updateProfile>[0]) => localDataService.updateProfile(data),
    switchRole: (role: 'admin' | 'formador' | 'membro') => localDataService.switchRole(role),
    addPost: (data: Parameters<typeof localDataService.addPost>[0]) => localDataService.addPost(data),
    togglePostLike: (postId: string) => localDataService.togglePostLike(postId),
    addComment: (postId: string, text: string) => localDataService.addComment(postId, text),
    addPrayer: (content: string, category: Parameters<typeof localDataService.addPrayer>[1], urgent?: boolean) => localDataService.addPrayer(content, category, urgent),
    togglePrayForIntention: (prayerId: string) => localDataService.togglePrayForIntention(prayerId),
    markPrayerAnswered: (prayerId: string) => localDataService.markPrayerAnswered(prayerId),
    deletePrayer: (prayerId: string) => localDataService.deletePrayer(prayerId),
    setEventRSVP: (eventId: string, status: Parameters<typeof localDataService.setEventRSVP>[1]) => localDataService.setEventRSVP(eventId, status),
    addEvent: (event: Parameters<typeof localDataService.addEvent>[0]) => localDataService.addEvent(event),
    deleteEvent: (eventId: string) => localDataService.deleteEvent(eventId),
    addScale: (scale: Parameters<typeof localDataService.addScale>[0]) => localDataService.addScale(scale),
    updateScale: (id: string, partial: Parameters<typeof localDataService.updateScale>[1]) => localDataService.updateScale(id, partial),
    deleteScale: (id: string) => localDataService.deleteScale(id),
    addSong: (song: Parameters<typeof localDataService.addSong>[0]) => localDataService.addSong(song),
    updateSong: (id: string, partial: Parameters<typeof localDataService.updateSong>[1]) => localDataService.updateSong(id, partial),
    deleteSong: (id: string) => localDataService.deleteSong(id),
    upsertDonor: (donor: Parameters<typeof localDataService.upsertDonor>[0]) => localDataService.upsertDonor(donor),
    deleteDonor: (donorId: string) => localDataService.deleteDonor(donorId),
    addCampaign: (campaign: Parameters<typeof localDataService.addCampaign>[0]) => localDataService.addCampaign(campaign),
    deleteCampaign: (campaignId: string) => localDataService.deleteCampaign(campaignId),
    createPixDonation: (params: Parameters<typeof localDataService.createPixDonation>[0]) => localDataService.createPixDonation(params),
    confirmPixPaymentWebhook: (donationId: string) => localDataService.confirmPixPaymentWebhook(donationId),
    generateWhatsAppSummary: (scaleId?: string) => localDataService.generateWhatsAppSummary(scaleId),
    getWhatsAppShareLink: (scaleId?: string) => localDataService.getWhatsAppShareLink(scaleId),
    getMessages: (channelId: string) => localDataService.getMessages(channelId),
    sendMessage: (channelId: string, text: string) => localDataService.sendMessage(channelId, text),
    addPhotoToAlbum: (albumId: string, photo: Parameters<typeof localDataService.addPhotoToAlbum>[1]) => localDataService.addPhotoToAlbum(albumId, photo),
    addNotice: (notice: Parameters<typeof localDataService.addNotice>[0]) => localDataService.addNotice(notice),
    setBgOpacity: (opacity: number) => localDataService.setBgOpacity(opacity),
    resetToMock: () => localDataService.resetToMock(),
  };
}

