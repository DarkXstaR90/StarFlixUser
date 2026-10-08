import React from 'react';
import { Bookmark, Play, Plus } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { ContentCard } from '../components/content/ContentCard';

interface WatchlistPageProps {
  onSelectContent: (id: string) => void;
  onPlayContent: (id: string) => void;
  onExplore: () => void;
}

export const WatchlistPage: React.FC<WatchlistPageProps> = ({
  onSelectContent,
  onPlayContent,
  onExplore
}) => {
  const { myList } = useContent();

  return (
    <div className="space-y-6 pb-16">
      <div className="pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Bookmark className="w-6 h-6 text-[#00E5A8]" />
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            My Saved List
          </h1>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/5">
            {myList.length}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Your personal watchlist saved in real-time to your Firebase account.
        </p>
      </div>

      {myList.length === 0 ? (
        <div className="py-24 text-center p-8 rounded-3xl bg-[#08111A] border border-white/5 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 text-slate-400 flex items-center justify-center">
            <Bookmark className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Your list is empty</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Click the &quot;Add to List&quot; button on any movie or series to save it for quick access.
            </p>
          </div>
          <button
            onClick={onExplore}
            className="px-6 py-2.5 rounded-xl bg-[#00E5A8] hover:bg-[#00E5A8]/90 text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Explore Titles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {myList.map((item) => (
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
