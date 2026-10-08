import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  SkipForward,
  ArrowLeft,
  Settings,
  Check
} from 'lucide-react';
import { ContentItem, EpisodeItem } from '../../types';
import { useContent } from '../../context/ContentContext';

interface VideoPlayerProps {
  content: ContentItem;
  currentEpisode?: EpisodeItem;
  episodes?: EpisodeItem[];
  onBack: () => void;
  onNextEpisode?: () => void;
  onSelectEpisode?: (ep: EpisodeItem) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  content,
  currentEpisode,
  episodes = [],
  onBack,
  onNextEpisode,
  onSelectEpisode
}) => {
  const { saveWatchProgress } = useContent();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState<string>('auto');
  const [showSettings, setShowSettings] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine current active video URL
  const activeVideoUrl =
    (currentEpisode && currentEpisode.videoUrl) ||
    (content.videoSources && selectedQuality !== 'auto' && content.videoSources[selectedQuality]) ||
    content.videoUrl ||
    '';

  const title = currentEpisode
    ? `${content.title} - Ep ${currentEpisode.episode}: ${currentEpisode.title}`
    : content.title;

  // Handle controls hide timer
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  // Periodic progress tracking to Firebase
  useEffect(() => {
    if (!currentTime || !duration) return;
    const interval = setInterval(() => {
      saveWatchProgress({
        contentId: content.id,
        seriesId: currentEpisode?.seriesId,
        episodeId: currentEpisode?.id,
        episodeNumber: currentEpisode?.episode,
        title,
        poster: currentEpisode?.thumbnail || content.poster,
        positionSeconds: Math.round(currentTime),
        durationSeconds: Math.round(duration)
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [content.id, currentEpisode, currentTime, duration, saveWatchProgress, title]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skipSeconds = (sec: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + sec));
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setVolume(val);
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[70vh] sm:h-[85vh] bg-black rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center select-none group"
    >
      {/* HTML5 Video */}
      {activeVideoUrl ? (
        <video
          ref={videoRef}
          src={activeVideoUrl}
          autoPlay
          playsInline
          onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              setDuration(videoRef.current.duration);
              setIsPlaying(true);
            }
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            if (onNextEpisode) onNextEpisode();
          }}
          onClick={togglePlay}
          className="w-full h-full object-contain cursor-pointer"
        />
      ) : (
        <div className="text-center p-8 text-slate-400">
          <p className="font-bold text-sm text-white">No video stream URL configured for this item.</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
          >
            Go Back
          </button>
        </div>
      )}

      {/* Top Header Bar */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 z-30 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-display font-bold text-sm sm:text-base text-white truncate max-w-md sm:max-w-xl">
              {title}
            </h2>
            <p className="text-[11px] text-slate-400">
              {content.type === 'movie' ? 'Movie' : `Season ${currentEpisode?.season || 1}`}
            </p>
          </div>
        </div>
      </div>

      {/* Center Big Play Button (when paused) */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#00E5A8] hover:bg-[#00E5A8]/90 text-black flex items-center justify-center shadow-2xl shadow-[#00E5A8]/40 transform hover:scale-110 active:scale-95 transition-all cursor-pointer"
        >
          <Play className="w-8 h-8 fill-black ml-1" />
        </button>
      )}

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-3 transition-opacity duration-300 z-30 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Timeline Slider */}
        <div className="relative w-full flex items-center group/scrubber">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00E5A8] focus:outline-none"
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-2 text-white hover:text-[#00E5A8] transition-colors cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <button
              onClick={() => skipSeconds(-10)}
              className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Rewind 10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => skipSeconds(10)}
              className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Forward 10s"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {onNextEpisode && (
              <button
                onClick={onNextEpisode}
                className="p-2 text-slate-300 hover:text-[#00E5A8] transition-colors cursor-pointer"
                title="Next Episode"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            )}

            {/* Volume */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={toggleMute}
                className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00E5A8] hidden sm:block"
              />
            </div>

            {/* Time Stamp */}
            <span className="text-xs font-mono text-slate-300 ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quality Settings (if multiple sources) */}
            {content.videoSources && Object.keys(content.videoSources).length > 1 && (
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Quality"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {showSettings && (
                  <div className="absolute right-0 bottom-12 w-32 p-1.5 rounded-xl bg-[#08111A] border border-white/10 shadow-xl text-xs space-y-1">
                    <button
                      onClick={() => {
                        setSelectedQuality('auto');
                        setShowSettings(false);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between hover:bg-white/5"
                    >
                      <span>Auto</span>
                      {selectedQuality === 'auto' && <Check className="w-3 h-3 text-[#00E5A8]" />}
                    </button>
                    {Object.keys(content.videoSources).map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setSelectedQuality(q);
                          setShowSettings(false);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between hover:bg-white/5 uppercase"
                      >
                        <span>{q}</span>
                        {selectedQuality === q && <Check className="w-3 h-3 text-[#00E5A8]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
