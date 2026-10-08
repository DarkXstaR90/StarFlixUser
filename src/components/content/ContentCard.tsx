import React, { useState } from 'react';
import { Play, Plus, Check, Star, Film, Tv } from 'lucide-react';
import { ContentItem } from '../../types';
import { useContent } from '../../context/ContentContext';

interface ContentCardProps {
  content: ContentItem;
  onSelect: (contentId: string) => void;
  onPlay: (contentId: string) => void;
  size?: 'normal' | 'large' | 'compact';
}

export const ContentCard: React.FC<ContentCardProps> = ({
  content,
  onSelect,
  onPlay,
  size = 'normal'
}) => {
  const { isInMyList, toggleMyList } = useContent();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const inList = isInMyList(content.id);

  const handleToggleList = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMyList(content.id);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay(content.id);
  };

  return (
    <div
      onClick={() => onSelect(content.id)}
      className="group relative flex flex-col cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 focus:outline-none"
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-[#0D1722] border border-white/5 group-hover:border-[#00E5A8]/50 shadow-md group-hover:shadow-xl group-hover:shadow-[#00E5A8]/10 transition-all">
        {/* Poster Image */}
        {!imageError && content.poster ? (
          <img
            src={content.poster}
            alt={content.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#0D1722] to-[#152332]">
            <Film className="w-8 h-8 text-[#00E5A8]/40 mb-2" />
            <span className="text-xs font-bold text-slate-300 line-clamp-2">{content.title}</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05080D] via-black/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center gap-1">
            {content.type === 'movie' ? <Film className="w-2.5 h-2.5 text-[#00E5A8]" /> : <Tv className="w-2.5 h-2.5 text-[#14B8FF]" />}
            {content.type}
          </span>

          {content.rating && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#00E5A8] text-black flex items-center gap-0.5 shadow-sm">
              <Star className="w-2.5 h-2.5 fill-black" />
              {content.rating}
            </span>
          )}
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] z-10">
          <button
            onClick={handlePlayClick}
            className="w-11 h-11 rounded-full bg-[#00E5A8] hover:bg-[#00E5A8]/90 text-black flex items-center justify-center shadow-lg shadow-[#00E5A8]/30 transform hover:scale-110 transition-all cursor-pointer"
            title="Stream Now"
          >
            <Play className="w-5 h-5 fill-black ml-0.5" />
          </button>

          <button
            onClick={handleToggleList}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
              inList
                ? 'bg-[#00E5A8]/20 border-[#00E5A8] text-[#00E5A8]'
                : 'bg-black/60 border-white/20 text-white hover:border-white'
            }`}
            title={inList ? 'Remove from My List' : 'Add to My List'}
          >
            {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Info Details */}
      <div className="mt-2.5 flex flex-col gap-0.5">
        <h3 className="font-semibold text-xs sm:text-sm text-white group-hover:text-[#00E5A8] transition-colors truncate">
          {content.title}
        </h3>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          {content.year && <span>{content.year}</span>}
          {content.genre && (
            <>
              <span>•</span>
              <span className="capitalize">{content.genre}</span>
            </>
          )}
          {content.duration && (
            <>
              <span>•</span>
              <span>{content.duration}</span>
            </>
          )}
          {content.seasons && (
            <>
              <span>•</span>
              <span>{content.seasons} Season{Number(content.seasons) > 1 ? 's' : ''}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
