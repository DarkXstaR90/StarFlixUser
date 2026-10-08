import React from 'react';
import { Flame, Sparkles, Film, Tv, Radio, ArrowRight, Play, AlertCircle, Crown } from 'lucide-react';
import { ContentHero } from '../components/content/ContentHero';
import { ContentRow } from '../components/content/ContentRow';
import { ContinueWatchingRow } from '../components/content/ContinueWatchingRow';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  onSelectContent: (contentId: string) => void;
  onPlayContent: (contentId: string, episodeId?: string) => void;
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
  onOpenPlans: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectContent,
  onPlayContent,
  onNavigate,
  onOpenAuth,
  onOpenPlans
}) => {
  const {
    allContent,
    movies,
    series,
    sliders,
    categories,
    history,
    settings,
    announcements,
    loading
  } = useContent();
  const { currentUser, signInAsGuest } = useAuth();

  // If not authenticated, security rules require auth != null to read content
  if (!currentUser) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="max-w-xl space-y-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-[#00E5A8] to-[#14B8FF] flex items-center justify-center text-black font-display font-black text-3xl shadow-xl shadow-[#00E5A8]/20 animate-pulse">
            S
          </div>

          <div className="space-y-2">
            <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
              StreamFlix Live
            </h1>
            <p className="text-sm sm:text-base text-slate-400">
              Sign in to unlock full real-time access to complete series, movies, uncensored releases, and 1080p streaming.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => signInAsGuest()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#00E5A8] hover:bg-[#00E5A8]/90 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#00E5A8]/30 flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Enter Live Stream</span>
            </button>
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-colors cursor-pointer"
            >
              Sign In Account
            </button>
            <button
              onClick={onOpenPlans}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-colors cursor-pointer"
            >
              VIP Membership Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && allContent.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="w-8 h-8 border-2 border-[#00E5A8] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-slate-400">Connecting to Firebase Realtime Stream...</p>
      </div>
    );
  }

  // Active announcement
  const activeAnnouncement =
    settings.announcementMessage ||
    (announcements.length > 0 && announcements[0].active !== false ? announcements[0].message : null);

  // Group content by categories for rows
  const categoryRows = categories
    .map((cat) => ({
      category: cat,
      items: allContent.filter(
        (c) =>
          c.genre?.toLowerCase() === cat.id.toLowerCase() ||
          c.genre?.toLowerCase() === cat.name.toLowerCase()
      )
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="space-y-10 sm:space-y-12 pb-16">
      {/* Global Announcement from Realtime Firebase Settings */}
      {activeAnnouncement && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#00E5A8]/15 via-[#14B8FF]/15 to-transparent border border-[#00E5A8]/30 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-[#00E5A8] shrink-0" />
          <p className="text-xs text-slate-200 font-medium">{activeAnnouncement}</p>
        </div>
      )}

      {/* Hero Carousel with real Firebase sliders */}
      <ContentHero
        sliders={sliders}
        fallbackItems={allContent}
        onSelect={onSelectContent}
        onPlay={onPlayContent}
      />

      {/* Real-time Continue Watching Row */}
      {history.length > 0 && (
        <ContinueWatchingRow
          items={history}
          onResume={(contentId, episodeId) => onPlayContent(contentId, episodeId)}
        />
      )}

      {/* Real Series Row */}
      {series.length > 0 && (
        <ContentRow
          title="Featured Series"
          icon={<Tv className="w-5 h-5 text-[#14B8FF]" />}
          items={series}
          onSelect={onSelectContent}
          onPlay={onPlayContent}
          onViewAll={() => onNavigate('/series')}
        />
      )}

      {/* Real Movies Row */}
      {movies.length > 0 && (
        <ContentRow
          title="Movies & Specials"
          icon={<Film className="w-5 h-5 text-[#00E5A8]" />}
          items={movies}
          onSelect={onSelectContent}
          onPlay={onPlayContent}
          onViewAll={() => onNavigate('/movies')}
        />
      )}

      {/* Dynamic Category Rows from Firebase */}
      {categoryRows.map(({ category, items }) => (
        <ContentRow
          key={category.id}
          title={category.name}
          icon={<Flame className="w-5 h-5" style={{ color: category.color || '#00E5A8' }} />}
          items={items}
          onSelect={onSelectContent}
          onPlay={onPlayContent}
          onViewAll={() => onNavigate(`/category/${category.id}`)}
        />
      ))}

      {/* Complete Real Releases Row */}
      {allContent.length > 0 && (
        <ContentRow
          title="Latest Releases"
          icon={<Sparkles className="w-5 h-5 text-amber-400" />}
          items={allContent}
          onSelect={onSelectContent}
          onPlay={onPlayContent}
          onViewAll={() => onNavigate('/catalog')}
        />
      )}
    </div>
  );
};
