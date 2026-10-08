export type ContentType = 'movie' | 'series';

export interface PlanAccess {
  freeAllowed?: boolean;
  freeDelayDays?: number;
  requireListedOnly?: boolean;
  requirePlan?: boolean;
}

export interface VideoSources {
  '1080p'?: string;
  '720p'?: string;
  '480p'?: string;
  '360p'?: string;
  [key: string]: string | undefined;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  poster: string;
  backdrop: string;
  genre: string; // e.g. "adult", "action", "romance", etc.
  type: ContentType;
  rating?: string | number;
  year?: string | number;
  status?: string; // "published", "ongoing", "completed"
  duration?: string;
  seasons?: string | number;
  planAccess?: PlanAccess;
  videoUrl?: string; // direct mp4 url for movies
  videoSources?: VideoSources;
  availableAt?: number;
  timestamp?: number;
  updatedAt?: number;
  episodeCount?: number;
}

export interface EpisodeItem {
  id: string;
  seriesId: string;
  season: number;
  episode: number;
  title: string;
  description?: string;
  thumbnail: string;
  videoUrl: string;
  duration?: string | number;
  timestamp?: number;
  updatedAt?: number;
}

export interface SliderItem {
  id: string;
  contentId: string;
  image: string;
  order: number;
  title?: string;
  timestamp?: number;
  updatedAt?: number;
  content?: ContentItem;
}

export interface CategoryItem {
  id: string;
  name: string;
  color?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  adFree?: boolean;
  color?: string;
  description?: string;
  logo?: string;
  bgImage?: string;
  background?: string;
  tier?: number;
  active?: boolean;
  timestamp?: number;
  updatedAt?: number;
}

export interface PlatformSettings {
  appVersion?: string;
  minVersion?: string;
  defaultQuality?: string;
  forceUpdate?: boolean;
  maintenanceMessage?: string;
  maintenanceMode?: boolean;
  paymentInstructions?: string;
  telegramSupport?: string;
  whatsappSupport?: string;
  upiId?: string;
  announcementTitle?: string;
  announcementMessage?: string;
  tmdbKey?: string;
  updateUrl?: string;
  updatedAt?: number;
}

export interface UserHistoryItem {
  id: string;
  contentId: string;
  seriesId?: string;
  episodeId?: string;
  episodeNumber?: number;
  title: string;
  poster?: string;
  positionSeconds: number;
  durationSeconds: number;
  timestamp: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: number;
  isAdmin: boolean;
  myList?: Record<string, boolean | number>;
  history?: Record<string, UserHistoryItem>;
  subscription?: string;
  planId?: string;
  planName?: string;
  subscriptionExpires?: number;
  redeemCode?: string;
  redeemedAt?: number;
  isBanned?: boolean;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  date?: string;
  timestamp?: number;
  active?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp?: number;
  read?: boolean;
}

export interface ContentFilterOptions {
  searchQuery?: string;
  category?: string;
  type?: ContentType | 'all';
  sortBy?: 'popular' | 'recent' | 'rating' | 'title';
}
