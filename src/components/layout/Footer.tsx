import React from 'react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-white/5 bg-[#05080D] pt-12 pb-24 lg:pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00E5A8] to-[#14B8FF] flex items-center justify-center font-display font-extrabold text-black text-xs">
                S
              </div>
              <span className="font-display font-bold text-lg text-white">
                Stream<span className="text-[#00E5A8]">Flix</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Real-time premium streaming platform directly connected to Firebase. High definition video streaming with real-time watchlist and watch history.
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Navigation</h5>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('/')} className="hover:text-white transition-colors cursor-pointer">Home</button></li>
              <li><button onClick={() => onNavigate('/series')} className="hover:text-white transition-colors cursor-pointer">Series</button></li>
              <li><button onClick={() => onNavigate('/movies')} className="hover:text-white transition-colors cursor-pointer">Movies</button></li>
              <li><button onClick={() => onNavigate('/categories')} className="hover:text-white transition-colors cursor-pointer">Categories</button></li>
              <li><button onClick={() => onNavigate('/watchlist')} className="hover:text-white transition-colors cursor-pointer">My List</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Features</h5>
            <ul className="space-y-2">
              <li className="text-slate-400">Realtime Firebase RTDB</li>
              <li className="text-slate-400">1080p MP4 Playback</li>
              <li className="text-slate-400">Cross-Device Watch History</li>
              <li className="text-slate-400">VIP Membership Access</li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Information</h5>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('/privacy')} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('/terms')} className="hover:text-white transition-colors cursor-pointer">Terms of Service</button></li>
              <li><button onClick={() => onNavigate('/dmca')} className="hover:text-white transition-colors cursor-pointer">DMCA</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© {new Date().getFullYear()} StreamFlix. All rights reserved.</p>
          <p className="text-[11px] text-slate-500">
            Powered by Firebase Realtime Database.
          </p>
        </div>
      </div>
    </footer>
  );
};
