import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  ContentItem,
  EpisodeItem,
  SliderItem,
  CategoryItem,
  SubscriptionPlan,
  PlatformSettings,
  AnnouncementItem,
  NotificationItem,
  UserHistoryItem
} from '../types';
import { contentService, ContentSnapshot } from '../services/contentService';
import { userService } from '../services/userService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface ContentContextType {
  allContent: ContentItem[];
  movies: ContentItem[];
  series: ContentItem[];
  episodes: EpisodeItem[];
  sliders: SliderItem[];
  categories: CategoryItem[];
  subscriptionPlans: SubscriptionPlan[];
  settings: PlatformSettings;
  announcements: AnnouncementItem[];
  notifications: NotificationItem[];
  myList: ContentItem[];
  myListIds: string[];
  history: UserHistoryItem[];
  loading: boolean;
  isInMyList: (contentId: string) => boolean;
  toggleMyList: (contentId: string) => Promise<boolean>;
  saveWatchProgress: (item: Omit<UserHistoryItem, 'id' | 'timestamp'>) => Promise<void>;
  getContentById: (id: string) => ContentItem | null;
  getEpisodesForSeries: (seriesId: string) => EpisodeItem[];
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [snapshot, setSnapshot] = useState<ContentSnapshot>({
    movies: [],
    series: [],
    allContent: [],
    episodes: [],
    sliders: [],
    categories: [],
    subscriptionPlans: [],
    settings: {},
    announcements: [],
    notifications: [],
    loading: true,
    error: null
  });

  const [rawMyList, setRawMyList] = useState<Record<string, boolean | number>>({});
  const [history, setHistory] = useState<UserHistoryItem[]>([]);

  // 1. Initialize real-time content listeners whenever auth status changes
  useEffect(() => {
    contentService.initRealtimeListeners(Boolean(currentUser));
    const unsubContent = contentService.subscribe((data) => {
      setSnapshot(data);
    });

    return () => {
      unsubContent();
      contentService.cleanup();
    };
  }, [currentUser]);

  // 2. Initialize real-time user data listeners (myList, history)
  useEffect(() => {
    if (!currentUser?.uid) {
      setRawMyList({});
      setHistory([]);
      return;
    }

    const unsubUser = userService.subscribeUserData(currentUser.uid, ({ myList, history: userHistory }) => {
      setRawMyList(myList);
      setHistory(userHistory);
    });

    return () => unsubUser();
  }, [currentUser?.uid]);

  const myListIds = Object.keys(rawMyList);
  const myList = snapshot.allContent.filter((c) => myListIds.includes(c.id));

  const isInMyList = useCallback(
    (contentId: string) => Boolean(rawMyList[contentId]),
    [rawMyList]
  );

  const toggleMyList = useCallback(
    async (contentId: string) => {
      if (!currentUser) {
        showToast('Please sign in to add to your list', 'info');
        return false;
      }
      const inList = isInMyList(contentId);
      const updated = await userService.toggleMyList(currentUser.uid, contentId, inList);
      showToast(updated ? 'Added to My List' : 'Removed from My List', 'success');
      return updated;
    },
    [currentUser, isInMyList, showToast]
  );

  const saveWatchProgress = useCallback(
    async (item: Omit<UserHistoryItem, 'id' | 'timestamp'>) => {
      if (!currentUser) return;
      await userService.updateWatchProgress(currentUser.uid, item);
    },
    [currentUser]
  );

  const getContentById = useCallback(
    (id: string) => {
      return snapshot.allContent.find((c) => c.id === id) || null;
    },
    [snapshot.allContent]
  );

  const getEpisodesForSeries = useCallback(
    (seriesId: string) => {
      return snapshot.episodes
        .filter((e) => e.seriesId === seriesId)
        .sort((a, b) => a.season - b.season || a.episode - b.episode);
    },
    [snapshot.episodes]
  );

  return (
    <ContentContext.Provider
      value={{
        allContent: snapshot.allContent,
        movies: snapshot.movies,
        series: snapshot.series,
        episodes: snapshot.episodes,
        sliders: snapshot.sliders,
        categories: snapshot.categories,
        subscriptionPlans: snapshot.subscriptionPlans,
        settings: snapshot.settings,
        announcements: snapshot.announcements,
        notifications: snapshot.notifications,
        myList,
        myListIds,
        history,
        loading: snapshot.loading,
        isInMyList,
        toggleMyList,
        saveWatchProgress,
        getContentById,
        getEpisodesForSeries
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within ContentProvider');
  return context;
};
