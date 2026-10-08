import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Tv } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { VideoPlayer } from '../components/player/VideoPlayer';
import { EpisodeItem } from '../types';

interface WatchPageProps {
  contentId: string;
  initialEpisodeId?: string;
  onBack: () => void;
}

export const WatchPage: React.FC<WatchPageProps> = ({
  contentId,
  initialEpisodeId,
  onBack
}) => {
  const { getContentById, getEpisodesForSeries } = useContent();

  const content = getContentById(contentId);
  const episodes = content?.type === 'series' ? getEpisodesForSeries(contentId) : [];

  const [currentEpisode, setCurrentEpisode] = useState<EpisodeItem | undefined>(() => {
    if (initialEpisodeId) {
      return episodes.find((e) => e.id === initialEpisodeId);
    }
    return episodes[0];
  });

  useEffect(() => {
    if (initialEpisodeId && episodes.length > 0) {
      const match = episodes.find((e) => e.id === initialEpisodeId);
      if (match) setCurrentEpisode(match);
    } else if (episodes.length > 0 && !currentEpisode) {
      setCurrentEpisode(episodes[0]);
    }
  }, [initialEpisodeId, episodes, currentEpisode]);

  if (!content) {
    return (
      <div className="py-24 text-center text-slate-400">
        <p className="text-base font-bold text-white">Title not found</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
        >
          Return to Browse
        </button>
      </div>
    );
  }

  const handleNextEpisode = () => {
    if (!currentEpisode || episodes.length === 0) return;
    const currentIndex = episodes.findIndex((e) => e.id === currentEpisode.id);
    if (currentIndex >= 0 && currentIndex < episodes.length - 1) {
      setCurrentEpisode(episodes[currentIndex + 1]);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Video Player */}
      <VideoPlayer
        content={content}
        currentEpisode={currentEpisode}
        episodes={episodes}
        onBack={onBack}
        onNextEpisode={episodes.length > 1 ? handleNextEpisode : undefined}
        onSelectEpisode={(ep) => setCurrentEpisode(ep)}
      />

      {/* Episode selector for Series */}
      {content.type === 'series' && episodes.length > 0 && (
        <div className="p-6 rounded-3xl bg-[#08111A] border border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-white">
            <Tv className="w-5 h-5 text-[#14B8FF]" />
            <h3 className="font-display font-bold text-lg">Season Episodes</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {episodes.map((ep) => {
              const isSelected = currentEpisode?.id === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => setCurrentEpisode(ep)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#00E5A8]/15 border-[#00E5A8] text-white shadow-lg shadow-[#00E5A8]/10'
                      : 'bg-white/5 border-white/5 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <span className="text-[11px] font-bold text-[#00E5A8] block">
                    Ep {ep.episode}
                  </span>
                  <span className="text-xs font-semibold truncate block mt-0.5">
                    {ep.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
