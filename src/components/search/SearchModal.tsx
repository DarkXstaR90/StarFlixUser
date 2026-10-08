import React, { useState, useMemo } from 'react';
import { Search, X, Film, Tv, Star } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { ContentItem } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (contentId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelect }) => {
  const { allContent, categories } = useContent();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = useMemo(() => {
    let result = [...allContent];

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.genre && item.genre.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.genre.toLowerCase() === selectedCategory.toLowerCase());
    }

    return result;
  }, [allContent, query, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#08111A] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#00E5A8] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search real titles, movies, series, genres..."
            className="flex-1 bg-transparent text-white text-base placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white border border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Category Pills */}
        {categories.length > 0 && (
          <div className="p-3 border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#00E5A8] text-black font-bold'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#00E5A8] text-black font-bold'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-semibold">No titles found matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-500 mt-1">Try another search keyword or category.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelect(item.id);
                  onClose();
                }}
                className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-white/[0.02] hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer group"
              >
                <div className="w-12 h-16 rounded-xl overflow-hidden bg-[#0D1722] shrink-0 border border-white/5">
                  <img
                    src={item.poster || item.backdrop}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white group-hover:text-[#00E5A8] transition-colors truncate">
                      {item.title}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-300 border border-white/10 shrink-0">
                      {item.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                    {item.year && <span>{item.year}</span>}
                    {item.genre && <span className="capitalize">{item.genre}</span>}
                    {item.rating && (
                      <span className="flex items-center gap-0.5 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {item.rating}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
