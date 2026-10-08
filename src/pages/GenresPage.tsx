import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface GenresPageProps {
  onSelectCategory: (categoryId: string) => void;
}

export const GenresPage: React.FC<GenresPageProps> = ({ onSelectCategory }) => {
  const { categories, allContent } = useContent();

  return (
    <div className="space-y-6 pb-16">
      <div className="pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Layers className="w-6 h-6 text-[#00E5A8]" />
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Browse by Category
          </h1>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/5">
            {categories.length}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Explore movies and series grouped by real Firebase genre classifications.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((cat) => {
          const matchingCount = allContent.filter(
            (c) =>
              c.genre?.toLowerCase() === cat.id.toLowerCase() ||
              c.genre?.toLowerCase() === cat.name.toLowerCase()
          ).length;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group p-5 rounded-3xl bg-[#08111A] border border-white/5 hover:border-[#00E5A8]/50 shadow-md hover:shadow-xl hover:shadow-[#00E5A8]/10 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-36"
            >
              {/* Category Color Accent Blob */}
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full filter blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: cat.color || '#00E5A8' }}
              />

              <div className="relative z-10">
                <div
                  className="w-3 h-3 rounded-full mb-3"
                  style={{ backgroundColor: cat.color || '#00E5A8' }}
                />
                <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-[#00E5A8] transition-colors">
                  {cat.name}
                </h3>
              </div>

              <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
                <span>{matchingCount} titles</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#00E5A8] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
