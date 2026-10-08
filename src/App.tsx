/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ContentProvider, useContent } from './context/ContentContext';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/search/SearchModal';
import { AuthModal } from './components/auth/AuthModal';
import { SubscriptionModal } from './components/plans/SubscriptionModal';
import { AdminPanel } from './components/admin/AdminPanel';

// Pages
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { AnimeDetailsPage } from './pages/AnimeDetailsPage';
import { WatchPage } from './pages/WatchPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { HistoryPage } from './pages/HistoryPage';
import { GenresPage } from './pages/GenresPage';

function MainApp() {
  const { currentUser, isAdmin } = useAuth();
  const { allContent } = useContent();

  const [currentRoute, setCurrentRoute] = useState<{
    path: string;
    contentId?: string;
    episodeId?: string;
    categoryId?: string;
  }>({ path: '/' });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPlansOpen, setIsPlansOpen] = useState(false);

  const navigate = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (path.startsWith('/watch/')) {
      const parts = path.split('/');
      setCurrentRoute({
        path: '/watch',
        contentId: parts[2],
        episodeId: parts[3]
      });
      return;
    }

    if (path.startsWith('/content/')) {
      const parts = path.split('/');
      setCurrentRoute({
        path: '/content-details',
        contentId: parts[2]
      });
      return;
    }

    if (path.startsWith('/category/')) {
      const parts = path.split('/');
      setCurrentRoute({
        path: '/catalog',
        categoryId: parts[2]
      });
      return;
    }

    setCurrentRoute({ path });
  };

  // Keyboard shortcut "/" for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Admin route check
  if (currentRoute.path === '/admin') {
    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-[#05080D] flex flex-col items-center justify-center p-6 text-center text-white">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xl mb-4">
            !
          </div>
          <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
          <p className="text-sm text-slate-400 max-w-sm mb-6">
            Write privileges to Firebase Realtime Database are restricted to Admin UID (8Bgh1o0L0BMatKXIOPaeekE0x9F3).
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#00E5A8] text-black text-xs font-bold uppercase transition-transform hover:scale-105 cursor-pointer"
            >
              Sign In with Admin Account
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15 cursor-pointer"
            >
              Back to Browse
            </button>
          </div>
          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </div>
      );
    }

    return <AdminPanel onExitAdmin={() => navigate('/')} />;
  }

  const renderCurrentPage = () => {
    switch (currentRoute.path) {
      case '/':
        return (
          <HomePage
            onSelectContent={(id) => navigate(`/content/${id}`)}
            onPlayContent={(contentId, episodeId) => {
              navigate(episodeId ? `/watch/${contentId}/${episodeId}` : `/watch/${contentId}`);
            }}
            onNavigate={navigate}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenPlans={() => setIsPlansOpen(true)}
          />
        );

      case '/series':
        return (
          <CatalogPage
            initialType="series"
            onSelectContent={(id) => navigate(`/content/${id}`)}
            onPlayContent={(id) => navigate(`/watch/${id}`)}
          />
        );

      case '/movies':
        return (
          <CatalogPage
            initialType="movie"
            onSelectContent={(id) => navigate(`/content/${id}`)}
            onPlayContent={(id) => navigate(`/watch/${id}`)}
          />
        );

      case '/categories':
        return (
          <GenresPage
            onSelectCategory={(categoryId) => navigate(`/category/${categoryId}`)}
          />
        );

      case '/catalog':
        return (
          <CatalogPage
            initialType="all"
            initialCategory={currentRoute.categoryId || 'all'}
            onSelectContent={(id) => navigate(`/content/${id}`)}
            onPlayContent={(id) => navigate(`/watch/${id}`)}
          />
        );

      case '/content-details':
        return (
          <AnimeDetailsPage
            contentId={currentRoute.contentId || allContent[0]?.id || ''}
            onBack={() => navigate('/')}
            onSelectContent={(id) => navigate(`/content/${id}`)}
            onPlayEpisode={(contentId, episodeId) => {
              navigate(episodeId ? `/watch/${contentId}/${episodeId}` : `/watch/${contentId}`);
            }}
          />
        );

      case '/watch':
        return (
          <WatchPage
            contentId={currentRoute.contentId || allContent[0]?.id || ''}
            initialEpisodeId={currentRoute.episodeId}
            onBack={() => {
              if (currentRoute.contentId) {
                navigate(`/content/${currentRoute.contentId}`);
              } else {
                navigate('/');
              }
            }}
          />
        );

      case '/watchlist':
        return (
          <WatchlistPage
            onSelectContent={(id) => navigate(`/content/${id}`)}
            onPlayContent={(id) => navigate(`/watch/${id}`)}
            onExplore={() => navigate('/')}
          />
        );

      case '/history':
        return (
          <HistoryPage
            onPlay={(contentId, episodeId) => {
              navigate(episodeId ? `/watch/${contentId}/${episodeId}` : `/watch/${contentId}`);
            }}
            onExplore={() => navigate('/')}
          />
        );

      default:
        return (
          <HomePage
            onSelectContent={(id) => navigate(`/content/${id}`)}
            onPlayContent={(contentId, episodeId) => {
              navigate(episodeId ? `/watch/${contentId}/${episodeId}` : `/watch/${contentId}`);
            }}
            onNavigate={navigate}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenPlans={() => setIsPlansOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#05080D] text-[#F5F7FA] flex flex-col">
      {/* Top Header */}
      <Header
        activePath={currentRoute.path}
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenPlans={() => setIsPlansOpen(true)}
      />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 pt-24 sm:pt-28">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigate} />

      {/* Bottom Nav on Mobile */}
      <MobileNav
        activePath={currentRoute.path}
        onNavigate={navigate}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(id) => navigate(`/content/${id}`)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <SubscriptionModal
        isOpen={isPlansOpen}
        onClose={() => setIsPlansOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ContentProvider>
          <MainApp />
        </ContentProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
