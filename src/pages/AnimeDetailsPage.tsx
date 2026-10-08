import React from 'react';
import {
  Play,
  Plus,
  Check,
  Star,
  Film,
  Tv,
  Calendar,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { EpisodeItem } from '../types';

interface AnimeDetailsPageProps {
  contentId: string;
  onBack: () => void;
  onPlayEpisode: (contentId: string, episodeId?: string) => void;
  onSelectContent: (id: string) => void;
}

export const AnimeDetailsPage: React.FC<AnimeDetailsPageProps> = ({
  contentId,
  onBack,
  onPlayEpisode
}) => {
  const { getContentById, getEpisodesForSeries, isInMyList, toggleMyList } = useContent();

  const content = getContentById(contentId);
  const episodes = content?.type === 'series' ? getEpisodesForSeries(contentId) : [];
  const inList = content ? isInMyList(content.id) : false;

  if (!content) {
    return (
      <div className="py-24 text-center text-slate-400">
        <p className="text-base font-bold text-white">Title not found</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
        >
          Return to Library
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Hero Overview Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#08111A] border border-white/5 p-6 sm:p-10 shadow-2xl">
        {/* Backdrop Image */}
        {content.backdrop && (
          <div
            className="absolute inset-0 bg-cover bg-center filter brightness-[0.25] contrast-[1.1]"
            style={{ backgroundImage: `url(${content.backdrop})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08111A] via-[#08111A]/80 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          {/* Poster Card */}
          <div className="w-40 sm:w-56 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden bg-[#0D1722] border border-white/10 shadow-2xl">
            <img
              src={content.poster || content.backdrop}
              alt={content.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Column */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#00E5A8] text-black">
                {content.type}
              </span>
              {content.genre && (
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/10 text-slate-200 uppercase">
                  {content.genre}
                </span>
              )}
              {content.rating && (
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-300" />
                  {content.rating}
                </span>
              )}
              {content.status && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-300">
                  {content.status}
                </span>
              )}
            </div>

            <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight">
              {content.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              {content.year && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {content.year}
                </span>
              )}
              {content.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {content.duration}
                </span>
              )}
              {content.seasons && (
                <span className="flex items-center gap-1">
                  <Tv className="w-3.5 h-3.5 text-slate-500" />
                  {content.seasons} Season{Number(content.seasons) > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              {content.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const firstEp = episodes[0];
                  onPlayEpisode(content.id, firstEp?.id);
                }}
                className="px-6 py-3 rounded-2xl bg-[#00E5A8] hover:bg-[#00E5A8]/90 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#00E5A8]/30 flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>
                  {content.type === 'movie'
                    ? 'Watch Movie'
                    : episodes.length > 0
                    ? `Play Episode ${episodes[0].episode}`
                    : 'Watch Now'}
                </span>
              </button>

              <button
                onClick={() => toggleMyList(content.id)}
                className={`px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider border flex items-center gap-2 transition-all cursor-pointer ${
                  inList
                    ? 'bg-[#00E5A8]/20 border-[#00E5A8] text-[#00E5A8]'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                }`}
              >
                {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{inList ? 'In My List' : 'Add to List'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes List (if Series) */}
      {content.type === 'series' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <h2 className="font-display font-bold text-xl text-white">Episodes ({episodes.length})</h2>
          </div>

          {episodes.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-[#08111A] rounded-2xl border border-white/5">
              <p className="text-xs">No streaming episodes added for this series yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {episodes.map((ep) => (
                <div
                  key={ep.id}
                  onClick={() => onPlayEpisode(content.id, ep.id)}
                  className="group p-3 rounded-2xl bg-[#08111A] border border-white/5 hover:border-[#00E5A8]/40 transition-all cursor-pointer flex gap-3.5 items-center"
                >
                  <div className="w-28 sm:w-32 aspect-video rounded-xl overflow-hidden bg-[#0D1722] relative shrink-0">
                    <img
                      src={ep.thumbnail || content.backdrop || content.poster}
                      alt={ep.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                      <div className="w-8 h-8 rounded-full bg-[#00E5A8] text-black flex items-center justify-center shadow-md">
                        <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-[#00E5A8] block">
                      Episode {ep.episode}
                    </span>
                    <h3 className="font-semibold text-xs sm:text-sm text-white group-hover:text-[#00E5A8] transition-colors truncate">
                      {ep.title}
                    </h3>
                    {ep.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {ep.description}
                      </p>
                    )}
                    {ep.duration && (
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        {ep.duration} min
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
