/**
 * Chaves de armazenamento local (Camada 1 - Memória Local)
 * Utilizadas para manter o estado funcional e cache offline
 */

export const STORAGE_KEYS = {
  CURRENT_USER: 'sg_user_profile_v3',
  POSTS: 'sg_community_posts_v2',
  PRAYERS: 'sg_prayer_intentions_v1',
  EVENTS: 'sg_calendar_events_v2',
  CHAT_MESSAGES: 'sg_chat_messages_v1',
  ALBUMS: 'sg_gallery_albums_v1',
  NOTICES: 'sg_cell_notices_v1',
  BG_OPACITY: 'sg_bg_opacity_v1',
  OFFLINE_QUEUE: 'sg_offline_sync_queue_v1',
  APP_SETTINGS: 'sg_app_settings_v1',
  PRAYED_SET: 'sg_prayed_intentions_ids_v1',
  SCALES: 'sg_meeting_scales_v2',
  SONGS: 'sg_cell_songs_v1',
  DONORS: 'sg_dizify_donors_v5',
  CAMPAIGNS: 'sg_dizify_campaigns_v2',
  DONATIONS: 'sg_dizify_donations_v2',
  WHATSAPP_BOT_HISTORY: 'sg_dizify_whatsapp_bot_v2',
} as const;

