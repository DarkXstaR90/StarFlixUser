import React, { useState, useEffect } from 'react';
import { Play, Plus, Check, Info, ChevronLeft, ChevronRight, Star, Film, Tv } from 'lucide-react';
import { SliderItem, ContentItem } from '../../types';
import { useContent } from '../../context/ContentContext';

interface ContentHeroProps {
  sliders: SliderItem[];
  fallbackItems: ContentItem[];
  onSelect: (contentId: string) => void;
  onPlay: (contentId: string) => void;
}

export const ContentHero: React.FC<ContentHeroProps> = ({
  sliders,
  fallbackItems,
  onSelect,
  onPlay
}) => {
  const { isInMyList, toggleMyList } = useContent();
  const [currentIndex, setCurrentIndex] = useState(0);

  // If sliders exist, map each slider to its content item; otherwise use fallbackItems
  const heroItems: {
    id: string;
    contentId: string;
    title: string;
    description: string;
    image: string;
    genre?: string;
    rating?: string | number;
    year?: string | number;
    type?: string;
    content?: ContentItem;
  }[] = sliders.length > 0
    ? sliders.map((sl) => ({
        id: sl.id,
        contentId: sl.contentId,
        title: sl.content?.title || sl.title || 'Featured Title',
        description: sl.content?.description || '',
        image: sl.image || sl.content?.backdrop || sl.content?.poster || '',
        genre: sl.content?.genre,
        rating: sl.content?.rating,
        year: sl.content?.year,
        type: sl.content?.type,
        content: sl.content
      }))
    : fallbackItems.slice(0, 5).map((item) => ({
        id: item.id,
        contentId: item.id,
        title: item.title,
        description: item.description,
        image: item.backdrop || item.poster,
        genre: item.genre,
        rating: item.rating,
        year: item.year,
        type: item.type,
        content: item
      }));

  // Auto-advance hero carousel every 7 seconds
  useEffect(() => {
    if (heroItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroItems.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [heroItems.length]);

  if (heroItems.length === 0) return null;

  const current = heroItems[currentIndex] || heroItems[0];
  const inList = isInMyList(current.contentId);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? heroItems.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heroItems.length);
  };

  return (
    <div className="relative w-full h-[65vh] sm:h-[72vh] lg:h-[80vh] min-h-[460px] max-h-[760px] overflow-hidden rounded-3xl bg-[#08111A] border border-white/5 shadow-2xl">
      {/* Background Backdrop Image */}
      {current.image ? (
        <img
          key={current.id}
          src={current.image}
          alt={current.title}
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05] transition-all duration-700 transform scale-100 animate-fadeIn"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-[#05080D] via-[#0D1722] to-[#05080D]" />
      )}

      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#05080D] via-[#05080D]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#05080D] via-[#05080D]/70 to-transparent w-full md:w-3/4" />

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-end pb-12 sm:pb-16 z-10">
        <div className="max-w-2xl space-y-3.5">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#00E5A8] text-black">
              Featured
            </span>

            {current.type && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/60 text-white border border-white/10 flex items-center gap-1 backdrop-blur-md">
                {current.type === 'movie' ? <Film className="w-3 h-3 text-[#00E5A8]" /> : <Tv className="w-3 h-3 text-[#14B8FF]" />}
                {current.type}
              </span>
            )}

            {current.genre && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-slate-200 border border-white/10 backdrop-blur-md capitalize">
                {current.genre}
              </span>
            )}

            {current.rating && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-300" />
                {current.rating}
              </span>
            )}

            {current.year && (
              <span className="text-xs text-slate-300 font-medium">
                {current.year}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight line-clamp-2 drop-shadow-md">
            {current.title}
          </h1>

          {/* Description */}
          {current.description && (
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed max-w-xl text-shadow">
              {current.description}
            </p>
          )}

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onPlay(current.contentId)}
              className="px-6 py-3 rounded-2xl bg-[#00E5A8] hover:bg-[#00E5A8]/90 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#00E5A8]/30 flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Watch Now</span>
            </button>

            <button
              onClick={() => toggleMyList(current.contentId)}
              className={`px-5 py-3 rounded-2xl backdrop-blur-md font-bold text-xs uppercase tracking-wider border flex items-center gap-2 transition-all cursor-pointer ${
                inList
                  ? 'bg-[#00E5A8]/20 border-[#00E5A8] text-[#00E5A8]'
                  : 'bg-black/40 hover:bg-white/10 border-white/20 text-white'
              }`}
            >
              {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{inList ? 'In My List' : 'Add to List'}</span>
            </button>

            <button
              onClick={() => onSelect(current.contentId)}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
              title="More Details"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {heroItems.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all z-20 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all z-20 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 right-6 sm:right-12 flex items-center gap-1.5 z-20">
            {heroItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? 'w-6 bg-[#00E5A8]' : 'w-1.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
