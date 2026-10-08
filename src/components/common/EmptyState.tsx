import React, { ReactNode } from 'react';
import { Film, Compass, Bookmark, History, Bell, MessageSquare, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  type?: 'anime' | 'watchlist' | 'history' | 'comments' | 'notifications' | 'search' | 'admin';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'anime',
  title,
  description,
  actionText,
  onAction,
  icon
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'watchlist':
        return {
          icon: <Bookmark className="w-8 h-8 text-[#00E5A8]" />,
          title: title || 'Your Watchlist is Empty',
          desc: description || 'Discover gripping anime and click "+ My List" to bookmark your favorite shows.'
        };
      case 'history':
        return {
          icon: <History className="w-8 h-8 text-[#14B8FF]" />,
          title: title || 'No Watch History Yet',
          desc: description || 'Start streaming episodes and we will automatically save your playback progress here.'
        };
      case 'comments':
        return {
          icon: <MessageSquare className="w-8 h-8 text-amber-400" />,
          title: title || 'No Comments Yet',
          desc: description || 'Be the first to share your thoughts, theories, and episode reactions!'
        };
      case 'notifications':
        return {
          icon: <Bell className="w-8 h-8 text-purple-400" />,
          title: title || 'All Caught Up',
          desc: description || 'You have no unread notifications or episode alerts right now.'
        };
      case 'search':
        return {
          icon: <Compass className="w-8 h-8 text-[#00E5A8]" />,
          title: title || 'No Matches Found',
          desc: description || 'Try refining your search keywords or adjusting your genre filters.'
        };
      case 'admin':
        return {
          icon: <AlertCircle className="w-8 h-8 text-slate-400" />,
          title: title || 'No Records Found',
          desc: description || 'There are currently no items matching your criteria in the database.'
        };
      default:
        return {
          icon: <Film className="w-8 h-8 text-[#00E5A8]" />,
          title: title || 'No Anime Found',
          desc: description || 'No anime entries are currently available for this category.'
        };
    }
  };

  const content = getDefaultContent();

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-[#0D1722] border border-white/10 flex items-center justify-center mb-4 shadow-xl">
        {icon || content.icon}
      </div>
      <h3 className="text-xl font-bold font-display text-white mb-2">{content.title}</h3>
      <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">{content.desc}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5A8] to-[#14B8FF] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-opacity shadow-lg shadow-[#00E5A8]/20"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
