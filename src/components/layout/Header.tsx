import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bookmark,
  Crown,
  LogOut,
  User,
  Shield,
  Menu,
  X,
  Radio,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';

interface HeaderProps {
  activePath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onOpenPlans: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePath,
  onNavigate,
  onOpenSearch,
  onOpenAuth,
  onOpenPlans
}) => {
  const { currentUser, isAdmin, signOut } = useAuth();
  const { myListIds, allContent } = useContent();

  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Series', path: '/series' },
    { label: 'Movies', path: '/movies' },
    { label: 'Categories', path: '/categories' },
    { label: 'My List', path: '/watchlist' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#05080D]/95 backdrop-blur-md border-b border-white/5 py-3 shadow-xl'
          : 'bg-gradient-to-b from-[#05080D]/90 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo & Realtime indicator */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00E5A8] to-[#14B8FF] flex items-center justify-center text-black font-display font-black text-xl shadow-lg shadow-[#00E5A8]/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-white group-hover:text-[#00E5A8] transition-colors">
              Stream<span className="text-[#00E5A8]">Flix</span>
            </span>
          </button>

          {/* Realtime Live Dot Indicator */}
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00E5A8]/10 text-[#00E5A8] border border-[#00E5A8]/20 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5A8] animate-pulse" />
            LIVE RTDB
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => onNavigate(link.path)}
              className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                activePath === link.path
                  ? 'text-[#00E5A8] font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {link.label}
              {activePath === link.path && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00E5A8] rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Actions Zone */}
        <div className="flex items-center gap-3">
          {/* VIP Upgrade Button */}
          <button
            onClick={onOpenPlans}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>VIP Plans</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10"
            title="Search movies & series"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* User Profile / Auth Button */}
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/10"
              >
                <img
                  src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover bg-[#0D1722] border border-white/10"
                />
                <span className="hidden sm:block text-xs font-bold text-slate-200 max-w-[100px] truncate">
                  {currentUser.name}
                </span>
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#08111A] border border-white/10 shadow-2xl p-2 text-xs z-50 animate-fadeIn">
                  <div className="p-3 border-b border-white/5 mb-1">
                    <p className="font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    {isAdmin && (
                      <span className="mt-1.5 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#00E5A8]/20 text-[#00E5A8]">
                        Super Admin
                      </span>
                    )}
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('/admin');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-[#00E5A8]" />
                      <span>Admin Management CMS</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigate('/watchlist');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-[#14B8FF]" />
                      <span>My List</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                      {myListIds.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenPlans();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>Membership & Codes</span>
                  </button>

                  <div className="border-t border-white/5 my-1" />

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl bg-[#00E5A8] hover:bg-[#00E5A8]/90 text-black text-xs font-bold uppercase tracking-wider shadow-md shadow-[#00E5A8]/20 transition-all cursor-pointer whitespace-nowrap"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
