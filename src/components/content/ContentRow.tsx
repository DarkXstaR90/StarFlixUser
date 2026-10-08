import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { ContentItem } from '../../types';
import { ContentCard } from './ContentCard';

interface ContentRowProps {
  title: string;
  icon?: React.ReactNode;
  items: ContentItem[];
  onSelect: (contentId: string) => void;
  onPlay: (contentId: string) => void;
  onViewAll?: () => void;
}

export const ContentRow: React.FC<ContentRowProps> = ({
  title,
  icon,
  items,
  onSelect,
  onPlay,
  onViewAll
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative group/row space-y-3.5">
      {/* Row Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {icon}
          <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
            {title}
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
            {items.length}
          </span>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-bold text-[#00E5A8] hover:text-[#00E5A8]/80 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Row Scroll Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-[#00E5A8] hover:text-black text-white flex items-center justify-center backdrop-blur-md border border-white/10 opacity-0 group-hover/row:opacity-100 transition-all shadow-xl cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Horizontal Content List */}
        <div
          ref={rowRef}
          className="flex items-start gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
        >
          {items.map((item) => (
            <div key={item.id} className="w-[145px] sm:w-[175px] md:w-[200px] shrink-0">
              <ContentCard content={item} onSelect={onSelect} onPlay={onPlay} />
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-[#00E5A8] hover:text-black text-white flex items-center justify-center backdrop-blur-md border border-white/10 opacity-0 group-hover/row:opacity-100 transition-all shadow-xl cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
