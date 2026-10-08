import { ref, onValue, set, update, remove, get } from 'firebase/database';
import { database, ADMIN_UID } from './firebase';
import {
  ContentItem,
  EpisodeItem,
  SliderItem,
  CategoryItem,
  SubscriptionPlan,
  PlatformSettings,
  AnnouncementItem,
  NotificationItem
} from '../types';

export interface ContentSnapshot {
  movies: ContentItem[];
  series: ContentItem[];
  allContent: ContentItem[];
  episodes: EpisodeItem[];
  sliders: SliderItem[];
  categories: CategoryItem[];
  subscriptionPlans: SubscriptionPlan[];
  settings: PlatformSettings;
  announcements: AnnouncementItem[];
  notifications: NotificationItem[];
  loading: boolean;
  error: string | null;
}

type Listener = (data: ContentSnapshot) => void;

class ContentService {
  private listeners: Listener[] = [];
  private state: ContentSnapshot = {
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
  };

  private unsubContent: (() => void) | null = null;
  private unsubCategories: (() => void) | null = null;
  private unsubPlans: (() => void) | null = null;
  private unsubSettings: (() => void) | null = null;
  private unsubAnnouncements: (() => void) | null = null;
  private unsubNotifications: (() => void) | null = null;

  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch {}
    }
  }

  public initRealtimeListeners(isAuthenticated: boolean) {
    if (!database) {
      this.state.loading = false;
      this.notify();
      return;
    }

    // Cleanup existing listeners if any
    this.cleanup();

    if (!isAuthenticated) {
      // Security rules require auth != null to read content, categories, etc.
      this.state = {
        ...this.state,
        loading: false,
        error: null
      };
      this.notify();
      return;
    }

    this.state.loading = true;
    this.state.error = null;
    this.notify();

    // 1. Listen to 'content' in real-time
    const contentRef = ref(database, 'content');
    this.unsubContent = onValue(
      contentRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          this.state.movies = [];
          this.state.series = [];
          this.state.allContent = [];
          this.state.episodes = [];
          this.state.sliders = [];
        } else {
          const val = snapshot.val() || {};

          // Movies
          const rawMovies = val.movies || {};
          const movies: ContentItem[] = Object.keys(rawMovies).map((key) => {
            const m = rawMovies[key];
            return {
              id: m.id || key,
              title: m.title || 'Untitled Movie',
              description: m.description || '',
              poster: m.poster || '',
              backdrop: m.backdrop || m.poster || '',
              genre: m.genre || 'General',
              type: 'movie',
              rating: m.rating || '8.0',
              year: m.year || '2026',
              status: m.status || 'published',
              duration: m.duration ? `${m.duration}m` : undefined,
              planAccess: m.planAccess,
              videoUrl: m.videoUrl,
              videoSources: m.videoSources,
              availableAt: m.availableAt,
              timestamp: m.timestamp,
              updatedAt: m.updatedAt
            };
          });

          // Episodes
          const rawEpisodes = val.episodes || {};
          const episodes: EpisodeItem[] = Object.keys(rawEpisodes).map((key) => {
            const ep = rawEpisodes[key];
            return {
              id: ep.id || key,
              seriesId: ep.seriesId || '',
              season: Number(ep.season) || 1,
              episode: Number(ep.episode) || 1,
              title: ep.title || `Episode ${ep.episode || 1}`,
              description: ep.description || '',
              thumbnail: ep.thumbnail || '',
              videoUrl: ep.videoUrl || '',
              duration: ep.duration,
              timestamp: ep.timestamp,
              updatedAt: ep.updatedAt
            };
          });

          // Series
          const rawSeries = val.series || {};
          const series: ContentItem[] = Object.keys(rawSeries).map((key) => {
            const s = rawSeries[key];
            const epCount = episodes.filter((e) => e.seriesId === (s.id || key)).length;
            return {
              id: s.id || key,
              title: s.title || 'Untitled Series',
              description: s.description || '',
              poster: s.poster || '',
              backdrop: s.backdrop || s.poster || '',
              genre: s.genre || 'General',
              type: 'series',
              rating: s.rating || '8.0',
              year: s.year || '2026',
              status: s.status || 'ongoing',
              seasons: s.seasons || 1,
              planAccess: s.planAccess,
              episodeCount: epCount || (s.seasons ? Number(s.seasons) * 12 : 0),
              availableAt: s.availableAt,
              timestamp: s.timestamp,
              updatedAt: s.updatedAt
            };
          });

          const allContent = [...series, ...movies].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

          // Sliders
          const rawSliders = val.sliders || {};
          const sliders: SliderItem[] = Object.keys(rawSliders)
            .map((key) => {
              const sl = rawSliders[key];
              const matchedContent = allContent.find((c) => c.id === sl.contentId);
              return {
                id: sl.id || key,
                contentId: sl.contentId || '',
                image: sl.image || matchedContent?.backdrop || matchedContent?.poster || '',
                order: Number(sl.order) || 0,
                title: sl.title || matchedContent?.title || '',
                timestamp: sl.timestamp,
                updatedAt: sl.updatedAt,
                content: matchedContent
              };
            })
            .sort((a, b) => b.order - a.order);

          this.state.movies = movies;
          this.state.series = series;
          this.state.allContent = allContent;
          this.state.episodes = episodes;
          this.state.sliders = sliders;
        }

        this.state.loading = false;
        this.notify();
      },
      (err) => {
        this.state.loading = false;
        this.state.error = err.message;
        this.notify();
      }
    );

    // 2. Listen to 'categories' in real-time
    const catRef = ref(database, 'categories');
    this.unsubCategories = onValue(catRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        this.state.categories = Object.keys(val).map((slug) => ({
          id: slug,
          name: val[slug]?.name || slug,
          color: val[slug]?.color || '#00E5A8'
        }));
      } else {
        this.state.categories = [];
      }
      this.notify();
    });

    // 3. Listen to 'subscriptionPlans' in real-time
    const plansRef = ref(database, 'subscriptionPlans');
    this.unsubPlans = onValue(plansRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        this.state.subscriptionPlans = Object.keys(val).map((id) => ({
          id,
          ...val[id]
        }));
      } else {
        this.state.subscriptionPlans = [];
      }
      this.notify();
    });

    // 4. Listen to 'settings' in real-time
    const settingsRef = ref(database, 'settings');
    this.unsubSettings = onValue(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        this.state.settings = snapshot.val() as PlatformSettings;
      }
      this.notify();
    });

    // 5. Listen to 'announcements' in real-time
    const annRef = ref(database, 'announcements');
    this.unsubAnnouncements = onValue(annRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        this.state.announcements = Object.keys(val).map((id) => ({
          id,
          ...val[id]
        }));
      } else {
        this.state.announcements = [];
      }
      this.notify();
    });

    // 6. Listen to 'notifications' in real-time
    const notifRef = ref(database, 'notifications');
    this.unsubNotifications = onValue(notifRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        this.state.notifications = Object.keys(val).map((id) => ({
          id,
          ...val[id]
        }));
      } else {
        this.state.notifications = [];
      }
      this.notify();
    });
  }

  public cleanup() {
    if (this.unsubContent) {
      this.unsubContent();
      this.unsubContent = null;
    }
    if (this.unsubCategories) {
      this.unsubCategories();
      this.unsubCategories = null;
    }
    if (this.unsubPlans) {
      this.unsubPlans();
      this.unsubPlans = null;
    }
    if (this.unsubSettings) {
      this.unsubSettings();
      this.unsubSettings = null;
    }
    if (this.unsubAnnouncements) {
      this.unsubAnnouncements();
      this.unsubAnnouncements = null;
    }
    if (this.unsubNotifications) {
      this.unsubNotifications();
      this.unsubNotifications = null;
    }
  }

  public getContentById(id: string): ContentItem | null {
    return this.state.allContent.find((c) => c.id === id) || null;
  }

  public getEpisodesForSeries(seriesId: string): EpisodeItem[] {
    return this.state.episodes
      .filter((e) => e.seriesId === seriesId)
      .sort((a, b) => a.season - b.season || a.episode - b.episode);
  }

  public getEpisode(seriesId: string, episodeId: string): EpisodeItem | null {
    return this.state.episodes.find((e) => e.seriesId === seriesId && e.id === episodeId) || null;
  }

  // --- Real Admin Actions (Writing directly to Firebase RTDB for UID 8Bgh1o0L0BMatKXIOPaeekE0x9F3) ---

  public async saveMovie(movie: ContentItem): Promise<void> {
    if (!database) return;
    const id = movie.id || 'm-' + Math.random().toString(36).substring(2, 9);
    const movieData = {
      ...movie,
      id,
      type: 'movie',
      updatedAt: Date.now(),
      timestamp: movie.timestamp || Date.now()
    };
    await set(ref(database, `content/movies/${id}`), movieData);
  }

  public async deleteMovie(id: string): Promise<void> {
    if (!database) return;
    await remove(ref(database, `content/movies/${id}`));
  }

  public async saveSeries(series: ContentItem): Promise<void> {
    if (!database) return;
    const id = series.id || 's-' + Math.random().toString(36).substring(2, 9);
    const seriesData = {
      ...series,
      id,
      type: 'series',
      updatedAt: Date.now(),
      timestamp: series.timestamp || Date.now()
    };
    await set(ref(database, `content/series/${id}`), seriesData);
  }

  public async deleteSeries(id: string): Promise<void> {
    if (!database) return;
    await remove(ref(database, `content/series/${id}`));
    // Also remove matching episodes
    const eps = this.getEpisodesForSeries(id);
    for (const ep of eps) {
      await remove(ref(database, `content/episodes/${ep.id}`));
    }
  }

  public async saveEpisode(episode: EpisodeItem): Promise<void> {
    if (!database) return;
    const id = episode.id || 'ep-' + Math.random().toString(36).substring(2, 9);
    const epData = {
      ...episode,
      id,
      updatedAt: Date.now(),
      timestamp: episode.timestamp || Date.now()
    };
    await set(ref(database, `content/episodes/${id}`), epData);
  }

  public async deleteEpisode(id: string): Promise<void> {
    if (!database) return;
    await remove(ref(database, `content/episodes/${id}`));
  }

  public async saveSlider(slider: SliderItem): Promise<void> {
    if (!database) return;
    const id = slider.id || 'sl-' + Math.random().toString(36).substring(2, 9);
    const sliderData = {
      contentId: slider.contentId,
      id,
      image: slider.image,
      order: slider.order || Date.now(),
      title: slider.title || '',
      updatedAt: Date.now(),
      timestamp: slider.timestamp || Date.now()
    };
    await set(ref(database, `content/sliders/${id}`), sliderData);
  }

  public async deleteSlider(id: string): Promise<void> {
    if (!database) return;
    await remove(ref(database, `content/sliders/${id}`));
  }

  public async saveCategory(slug: string, category: { name: string; color?: string }): Promise<void> {
    if (!database) return;
    await set(ref(database, `categories/${slug}`), category);
  }

  public async deleteCategory(slug: string): Promise<void> {
    if (!database) return;
    await remove(ref(database, `categories/${slug}`));
  }

  public async updateSettings(settings: PlatformSettings): Promise<void> {
    if (!database) return;
    await update(ref(database, 'settings'), {
      ...settings,
      updatedAt: Date.now()
    });
  }

  public async savePlan(plan: SubscriptionPlan): Promise<void> {
    if (!database) return;
    const id = plan.id || 'p-' + Math.random().toString(36).substring(2, 9);
    const planData = {
      ...plan,
      id,
      updatedAt: Date.now(),
      timestamp: plan.timestamp || Date.now()
    };
    await set(ref(database, `subscriptionPlans/${id}`), planData);
  }

  public async deletePlan(id: string): Promise<void> {
    if (!database) return;
    await remove(ref(database, `subscriptionPlans/${id}`));
  }
}

export const contentService = new ContentService();
