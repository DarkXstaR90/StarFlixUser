import React, { useState, useMemo } from 'react';
import { Filter, Star, Sparkles, Film, Tv } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { ContentCard } from '../components/content/ContentCard';
import { ContentType, CategoryItem } from '../types';

interface CatalogPageProps {
  initialType?: ContentType | 'all';
  initialCategory?: string;
  onSelectContent: (id: string) => void;
  onPlayContent: (id: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  initialType = 'all',
  initialCategory = 'all',
  onSelectContent,
  onPlayContent
}) => {
  const { allContent, categories, loading } = useContent();

  const [selectedType, setSelectedType] = useState<ContentType | 'all'>(initialType);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'title'>('recent');

  const filtered = useMemo(() => {
    let result = [...allContent];

    if (selectedType !== 'all') {
      result = result.filter((item) => item.type === selectedType);
    }

    if (selectedCategory !== 'all') {
      const matchCat = categories.find(
        (c) => c.id === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase()
      );
      result = result.filter(
        (item) =>
          item.genre?.toLowerCase() === selectedCategory.toLowerCase() ||
          (matchCat && item.genre?.toLowerCase() === matchCat.name.toLowerCase()) ||
          (matchCat && item.genre?.toLowerCase() === matchCat.id.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'recent':
      default:
        result.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        break;
    }

    return result;
  }, [allContent, selectedType, selectedCategory, sortBy]);

  return (
    <div className="space-y-6 pb-16">
      {/* Page Title & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            {selectedType === 'series'
              ? 'Series & Seasons'
              : selectedType === 'movie'
              ? 'Movies & Specials'
              : 'Complete Library'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time streaming catalogue synced with Firebase. Showing {filtered.length} titles.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="flex items-center p-1 rounded-xl bg-[#08111A] border border-white/5 text-xs">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                selectedType === 'all' ? 'bg-[#00E5A8] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('series')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                selectedType === 'series' ? 'bg-[#14B8FF] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Series
            </button>
            <button
              onClick={() => setSelectedType('movie')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                selectedType === 'movie' ? 'bg-[#00E5A8] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Movies
            </button>
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-[#08111A] border border-white/5 text-xs text-slate-300 focus:outline-none focus:border-[#00E5A8] cursor-pointer"
          >
            <option value="recent">Recently Added</option>
            <option value="rating">Top Rated</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#00E5A8] text-black font-bold'
                : 'bg-[#08111A] text-slate-300 border border-white/5 hover:bg-white/5'
            }`}
          >
            All Genres
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#00E5A8] text-black font-bold'
                  : 'bg-[#08111A] text-slate-300 border border-white/5 hover:bg-white/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Grid of Content */}
      {loading && allContent.length === 0 ? (
        <div className="py-24 text-center text-slate-400">
          <span className="w-6 h-6 border-2 border-[#00E5A8] border-t-transparent rounded-full animate-spin inline-block mr-2" />
          <p className="text-xs mt-2">Loading library...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-400 p-8 rounded-3xl bg-[#08111A] border border-white/5">
          <p className="text-sm font-semibold text-white">No titles found in this category.</p>
          <p className="text-xs text-slate-500 mt-1">Try selecting another filter or genre.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {filtered.map((item) => (
            <ContentCard
              key={item.id}
              content={item}
              onSelect={onSelectContent}
              onPlay={onPlayContent}
            />
          ))}
        </div>
      )}
    </div>
  );
};
