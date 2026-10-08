import React, { useState } from 'react';
import {
  Film,
  Tv,
  Layers,
  Crown,
  Settings,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Sliders,
  Check,
  X,
  Play
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { contentService } from '../../services/contentService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ContentItem, EpisodeItem, SliderItem, SubscriptionPlan, CategoryItem, PlatformSettings } from '../../types';

interface AdminPanelProps {
  onExitAdmin: () => void;
}

type AdminTab = 'overview' | 'content' | 'episodes' | 'sliders' | 'categories' | 'plans' | 'settings';

export const AdminPanel: React.FC<AdminPanelProps> = ({ onExitAdmin }) => {
  const { allContent, movies, series, episodes, sliders, categories, subscriptionPlans, settings } = useContent();
  const { currentUser, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');

  // Add Movie / Series Modal state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ContentItem>>({
    type: 'series',
    title: '',
    description: '',
    poster: '',
    backdrop: '',
    genre: 'action',
    rating: '8.0',
    year: '2026',
    status: 'ongoing',
    videoUrl: ''
  });

  // Add Episode Modal state
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>(series[0]?.id || '');
  const [editingEpisode, setEditingEpisode] = useState<Partial<EpisodeItem>>({
    episode: 1,
    title: '',
    videoUrl: '',
    thumbnail: '',
    duration: '24'
  });

  // Add Slider Modal state
  const [isSliderModalOpen, setIsSliderModalOpen] = useState(false);
  const [sliderContentId, setSliderContentId] = useState<string>(allContent[0]?.id || '');
  const [sliderImage, setSliderImage] = useState<string>('');

  // Add Category Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [catSlug, setCatSlug] = useState('');
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('#00E5A8');

  // Edit Settings state
  const [editableSettings, setEditableSettings] = useState<PlatformSettings>(settings);

  // Handlers
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('Admin permission required to write to Firebase', 'error');
      return;
    }
    try {
      if (editingItem.type === 'movie') {
        await contentService.saveMovie(editingItem as ContentItem);
      } else {
        await contentService.saveSeries(editingItem as ContentItem);
      }
      showToast(`Saved ${editingItem.title} to Firebase!`, 'success');
      setIsItemModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save to Firebase', 'error');
    }
  };

  const handleDeleteItem = async (item: ContentItem) => {
    if (!isAdmin) {
      showToast('Admin permission required', 'error');
      return;
    }
    if (!window.confirm(`Delete "${item.title}" from Firebase?`)) return;
    try {
      if (item.type === 'movie') {
        await contentService.deleteMovie(item.id);
      } else {
        await contentService.deleteSeries(item.id);
      }
      showToast(`Deleted ${item.title}`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  const handleSaveEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeriesId) return;
    try {
      await contentService.saveEpisode({
        id: editingEpisode.id || 'ep-' + Math.random().toString(36).substring(2, 9),
        seriesId: selectedSeriesId,
        season: 1,
        episode: Number(editingEpisode.episode) || 1,
        title: editingEpisode.title || `Episode ${editingEpisode.episode}`,
        description: editingEpisode.description || '',
        videoUrl: editingEpisode.videoUrl || '',
        thumbnail: editingEpisode.thumbnail || '',
        duration: editingEpisode.duration || '24'
      });
      showToast('Episode saved to Firebase!', 'success');
      setIsEpisodeModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save episode', 'error');
    }
  };

  const handleDeleteEpisode = async (epId: string) => {
    if (!window.confirm('Delete this episode?')) return;
    try {
      await contentService.deleteEpisode(epId);
      showToast('Episode removed', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  const handleSaveSlider = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contentService.saveSlider({
        id: 'sl-' + Math.random().toString(36).substring(2, 9),
        contentId: sliderContentId,
        image: sliderImage,
        order: Date.now()
      });
      showToast('Slider created!', 'success');
      setIsSliderModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save slider', 'error');
    }
  };

  const handleDeleteSlider = async (id: string) => {
    try {
      await contentService.deleteSlider(id);
      showToast('Slider deleted', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete slider', 'error');
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = catSlug.trim().toLowerCase().replace(/\s+/g, '-');
    if (!slug) return;
    try {
      await contentService.saveCategory(slug, { name: catName || slug, color: catColor });
      showToast('Category created!', 'success');
      setIsCategoryModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save category', 'error');
    }
  };

  const handleDeleteCategory = async (slug: string) => {
    try {
      await contentService.deleteCategory(slug);
      showToast('Category deleted', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete category', 'error');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contentService.updateSettings(editableSettings);
      showToast('Platform settings updated in Firebase!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#05080D] text-white">
      {/* Top Navbar */}
      <header className="h-16 border-b border-white/5 bg-[#08111A] px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#00E5A8] text-black font-black flex items-center justify-center font-display text-sm">
            A
          </div>
          <div>
            <h1 className="font-display font-bold text-sm text-white">Firebase Admin CMS</h1>
            <p className="text-[11px] text-slate-400">UID: 8Bgh1o0L0BMatKXIOPaeekE0x9F3</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#00E5A8]/10 text-[#00E5A8] border border-[#00E5A8]/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5A8] animate-pulse" />
            LIVE RTDB SYNC
          </span>

          <button
            onClick={onExitAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 border border-white/5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#00E5A8]" />
            <span>Return to Live Site</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-white/5 pb-3">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'content', label: 'Series & Movies' },
            { id: 'episodes', label: 'Episodes' },
            { id: 'sliders', label: 'Hero Sliders' },
            { id: 'categories', label: 'Categories' },
            { id: 'plans', label: 'Subscription Plans' },
            { id: 'settings', label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as AdminTab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                currentTab === tab.id
                  ? 'bg-[#00E5A8] text-black shadow-md shadow-[#00E5A8]/20'
                  : 'bg-[#08111A] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {currentTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 rounded-2xl bg-[#08111A] border border-white/5 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Total Series</span>
                <p className="font-mono font-black text-2xl text-[#14B8FF]">{series.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#08111A] border border-white/5 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Total Movies</span>
                <p className="font-mono font-black text-2xl text-[#00E5A8]">{movies.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#08111A] border border-white/5 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Total Episodes</span>
                <p className="font-mono font-black text-2xl text-purple-400">{episodes.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#08111A] border border-white/5 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Hero Sliders</span>
                <p className="font-mono font-black text-2xl text-amber-400">{sliders.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#08111A] border border-white/5 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Categories</span>
                <p className="font-mono font-black text-2xl text-rose-400">{categories.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#08111A] border border-white/5 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">VIP Plans</span>
                <p className="font-mono font-black text-2xl text-emerald-400">{subscriptionPlans.length}</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#08111A] border border-white/5 space-y-3">
              <h3 className="font-display font-bold text-base text-white">Firebase Direct Real-Time Architecture</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                The application is directly connected to your Firebase Realtime Database. Any changes made in this admin panel or in the Firebase console sync in real-time to all connected viewers with zero delay.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Series & Movies */}
        {currentTab === 'content' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-white">Series & Movies ({allContent.length})</h2>
              <button
                onClick={() => {
                  setEditingItem({
                    type: 'series',
                    title: '',
                    description: '',
                    poster: '',
                    backdrop: '',
                    genre: 'action',
                    rating: '8.0',
                    year: '2026',
                    status: 'ongoing',
                    videoUrl: ''
                  });
                  setIsItemModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E5A8] hover:bg-[#00E5A8]/90 text-black text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Title</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allContent.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#08111A] border border-white/5 flex gap-4 items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.poster || item.backdrop}
                      alt={item.title}
                      className="w-14 h-20 rounded-xl object-cover bg-[#0D1722] shrink-0 border border-white/10"
                    />
                    <div className="min-w-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-slate-300">
                        {item.type}
                      </span>
                      <h4 className="font-bold text-sm text-white truncate mt-1">{item.title}</h4>
                      <p className="text-xs text-slate-400 capitalize">{item.genre} • {item.year}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Episodes */}
        {currentTab === 'episodes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-semibold">Select Series:</span>
                <select
                  value={selectedSeriesId}
                  onChange={(e) => setSelectedSeriesId(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#08111A] border border-white/10 text-xs text-white focus:outline-none"
                >
                  {series.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingEpisode({
                    episode: episodes.filter((e) => e.seriesId === selectedSeriesId).length + 1,
                    title: '',
                    videoUrl: '',
                    thumbnail: '',
                    duration: '24'
                  });
                  setIsEpisodeModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#14B8FF] hover:bg-[#14B8FF]/90 text-black text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Episode</span>
              </button>
            </div>

            <div className="space-y-3">
              {episodes
                .filter((e) => e.seriesId === selectedSeriesId)
                .map((ep) => (
                  <div
                    key={ep.id}
                    className="p-3.5 rounded-2xl bg-[#08111A] border border-white/5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#14B8FF]/10 text-[#14B8FF] flex items-center justify-center font-bold text-xs shrink-0">
                        {ep.episode}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">{ep.title}</h4>
                        <p className="text-xs text-slate-400 truncate max-w-lg">{ep.videoUrl}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteEpisode(ep.id)}
                      className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Tab 4: Sliders */}
        {currentTab === 'sliders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-white">Hero Spotlight Sliders ({sliders.length})</h2>
              <button
                onClick={() => {
                  setSliderContentId(allContent[0]?.id || '');
                  setSliderImage('');
                  setIsSliderModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E5A8] hover:bg-[#00E5A8]/90 text-black text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Slider</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sliders.map((sl) => (
                <div key={sl.id} className="rounded-2xl overflow-hidden bg-[#08111A] border border-white/5 relative group">
                  <div className="aspect-video w-full bg-[#0D1722] relative">
                    <img src={sl.image} alt={sl.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col justify-end">
                      <h4 className="font-bold text-sm text-white">{sl.title}</h4>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Order: {sl.order}</span>
                    <button
                      onClick={() => handleDeleteSlider(sl.id)}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Categories */}
        {currentTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-white">Categories & Genres ({categories.length})</h2>
              <button
                onClick={() => {
                  setCatSlug('');
                  setCatName('');
                  setCatColor('#00E5A8');
                  setIsCategoryModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E5A8] hover:bg-[#00E5A8]/90 text-black text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 rounded-2xl bg-[#08111A] border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color || '#00E5A8' }} />
                    <span className="font-bold text-sm text-white">{cat.name}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Settings */}
        {currentTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-[#08111A] border border-white/5 space-y-4 max-w-2xl">
            <h3 className="font-display font-bold text-lg text-white">Platform Settings</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Global Announcement Message</label>
              <input
                type="text"
                value={editableSettings.announcementMessage || ''}
                onChange={(e) => setEditableSettings({ ...editableSettings, announcementMessage: e.target.value })}
                placeholder="Banner announcement to all viewers"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00E5A8]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">App Version</label>
                <input
                  type="text"
                  value={editableSettings.appVersion || '1.0.0'}
                  onChange={(e) => setEditableSettings({ ...editableSettings, appVersion: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00E5A8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Default Quality</label>
                <input
                  type="text"
                  value={editableSettings.defaultQuality || 'auto'}
                  onChange={(e) => setEditableSettings({ ...editableSettings, defaultQuality: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00E5A8]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#00E5A8] hover:bg-[#00E5A8]/90 text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Save Platform Settings
            </button>
          </form>
        )}
      </div>

      {/* Item Modal (Movie/Series) */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleSaveItem} className="w-full max-w-lg p-6 rounded-3xl bg-[#08111A] border border-white/10 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="font-bold text-base text-white">Add Movie or Series</h3>
              <button type="button" onClick={() => setIsItemModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Type</label>
                <select
                  value={editingItem.type}
                  onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                >
                  <option value="series">Series</option>
                  <option value="movie">Movie</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Category / Genre</label>
                <input
                  type="text"
                  required
                  value={editingItem.genre || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, genre: e.target.value })}
                  placeholder="e.g. action, adult, drama"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Title</label>
              <input
                type="text"
                required
                value={editingItem.title || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Poster Image URL</label>
              <input
                type="url"
                required
                value={editingItem.poster || ''}
                onChange={(e) => setEditingItem({ ...editingItem, poster: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Backdrop Image URL</label>
              <input
                type="url"
                value={editingItem.backdrop || ''}
                onChange={(e) => setEditingItem({ ...editingItem, backdrop: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>

            {editingItem.type === 'movie' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Stream Video URL (.mp4)</label>
                <input
                  type="url"
                  value={editingItem.videoUrl || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, videoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
              <textarea
                rows={3}
                value={editingItem.description || ''}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#00E5A8] text-black font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Save to Firebase
            </button>
          </form>
        </div>
      )}

      {/* Episode Modal */}
      {isEpisodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleSaveEpisode} className="w-full max-w-md p-6 rounded-3xl bg-[#08111A] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="font-bold text-base text-white">Add Streaming Episode</h3>
              <button type="button" onClick={() => setIsEpisodeModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Episode #</label>
                <input
                  type="number"
                  required
                  value={editingEpisode.episode}
                  onChange={(e) => setEditingEpisode({ ...editingEpisode, episode: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Duration (mins)</label>
                <input
                  type="text"
                  value={editingEpisode.duration}
                  onChange={(e) => setEditingEpisode({ ...editingEpisode, duration: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Episode Title</label>
              <input
                type="text"
                required
                value={editingEpisode.title || ''}
                onChange={(e) => setEditingEpisode({ ...editingEpisode, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Video Stream URL (.mp4)</label>
              <input
                type="url"
                required
                value={editingEpisode.videoUrl || ''}
                onChange={(e) => setEditingEpisode({ ...editingEpisode, videoUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Thumbnail URL</label>
              <input
                type="url"
                value={editingEpisode.thumbnail || ''}
                onChange={(e) => setEditingEpisode({ ...editingEpisode, thumbnail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#14B8FF] text-black font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Add Episode
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
