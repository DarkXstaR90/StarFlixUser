import React from 'react';
import { History, Play, Trash2 } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { useToast } from '../context/ToastContext';

interface HistoryPageProps {
  onPlay: (contentId: string, episodeId?: string) => void;
  onExplore: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onPlay, onExplore }) => {
  const { history } = useContent();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const handleClearHistory = async () => {
    if (!currentUser) return;
    try {
      await userService.clearHistory(currentUser.uid);
      showToast('Watch history cleared', 'info');
    } catch {
      showToast('Failed to clear history', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2.5">
            <History className="w-6 h-6 text-[#00E5A8]" />
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Watch History
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/5">
              {history.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time playback progress across your devices.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/20 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-24 text-center p-8 rounded-3xl bg-[#08111A] border border-white/5 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 text-slate-400 flex items-center justify-center">
            <History className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">No watch history yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Start streaming movies or series, and your progress will automatically sync here.
            </p>
          </div>
          <button
            onClick={onExplore}
            className="px-6 py-2.5 rounded-xl bg-[#00E5A8] hover:bg-[#00E5A8]/90 text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Start Watching
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            const percentage =
              item.durationSeconds > 0
                ? Math.min(100, Math.round((item.positionSeconds / item.durationSeconds) * 100))
                : 0;

            return (
              <div
                key={item.id}
                onClick={() => onPlay(item.contentId, item.episodeId)}
                className="group p-3.5 rounded-2xl bg-[#08111A] border border-white/5 hover:border-[#00E5A8]/40 transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-24 sm:w-32 aspect-video rounded-xl overflow-hidden bg-[#0D1722] relative shrink-0">
                    {item.poster && (
                      <img
                        src={item.poster}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center">
                      <Play className="w-5 h-5 fill-white text-white group-hover:text-[#00E5A8]" />
                    </div>
                    {/* Bottom Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60">
                      <div
                        className="h-full bg-[#00E5A8]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-white group-hover:text-[#00E5A8] transition-colors truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.episodeNumber ? `Episode ${item.episodeNumber} • ` : ''}
                      {percentage}% watched
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-[#00E5A8] hover:text-black text-xs font-bold text-slate-200 transition-colors shrink-0"
                >
                  Resume
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
