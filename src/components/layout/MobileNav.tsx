import React from 'react';
import { Home, Tv, Film, Layers, Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileNavProps {
  activePath: string;
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activePath,
  onNavigate,
  onOpenAuth
}) => {
  const { currentUser } = useAuth();

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Series', icon: Tv, path: '/series' },
    { label: 'Movies', icon: Film, path: '/movies' },
    { label: 'Categories', icon: Layers, path: '/categories' },
    { label: 'My List', icon: Bookmark, path: '/watchlist' }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#08111A]/95 backdrop-blur-lg border-t border-white/10 px-2 py-2 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePath === item.path;

        return (
          <button
            key={item.label}
            onClick={() => onNavigate(item.path)}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors cursor-pointer ${
              isActive ? 'text-[#00E5A8]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
