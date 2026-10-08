import React from 'react';
import { Play, Clock } from 'lucide-react';
import { UserHistoryItem } from '../../types';

interface ContinueWatchingRowProps {
  items: UserHistoryItem[];
  onResume: (contentId: string, episodeId?: string) => void;
}

export const ContinueWatchingRow: React.FC<ContinueWatchingRowProps> = ({
  items,
  onResume
}) => {
  if (items.length === 0) return null;

  return (
    <section className="space-y-3.5">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-[#00E5A8]" />
        <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
          Continue Watching
        </h2>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
          {items.length}
        </span>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
        {items.map((item) => {
          const percentage =
            item.durationSeconds > 0
              ? Math.min(100, Math.round((item.positionSeconds / item.durationSeconds) * 100))
              : 0;

          return (
            <div
              key={item.id}
              onClick={() => onResume(item.contentId, item.episodeId)}
              className="w-[200px] sm:w-[240px] shrink-0 group relative cursor-pointer"
            >
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#0D1722] border border-white/5 group-hover:border-[#00E5A8]/50 relative transition-all">
                {item.poster ? (
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#0D1722]">
                    <Play className="w-8 h-8 text-[#00E5A8]/40" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#00E5A8] text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-black ml-0.5" />
                  </div>
                </div>

                {/* Progress bar at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/60">
                  <div
                    className="h-full bg-[#00E5A8] transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <div className="mt-2 flex flex-col">
                <span className="font-semibold text-xs text-white truncate group-hover:text-[#00E5A8] transition-colors">
                  {item.title}
                </span>
                {item.episodeNumber && (
                  <span className="text-[11px] text-slate-400">
                    Episode {item.episodeNumber}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
