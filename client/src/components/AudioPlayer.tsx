import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Download, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";

interface AudioPlayerProps {
  audioUrl: string | null | undefined;
  title?: string;
  onError?: (error: string) => void;
  className?: string;
}

export default function AudioPlayer({ audioUrl, title = "Call Recording", onError, className = "" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
    };
    const handleError = () => {
      setIsLoading(false);
      const errorMsg = 'Failed to load audio recording';
      setError(errorMsg);
      onError?.(errorMsg);
    };
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onError]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setError('Failed to play audio');
      onError?.('Failed to play audio');
    }
  };

  const handleTimeSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    
    const newTime = (value[0] / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newVolume = value[0] / 100;
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `${title.replace(/\s+/g, '_')}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (time: number) => {
    if (!time || !isFinite(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  if (!audioUrl) {
    return (
      <GlassmorphicCard className={`p-6 text-center ${className}`}>
        <Volume2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-white mb-2">No Recording Available</h3>
        <p className="text-gray-400 text-sm">This call doesn't have an audio recording or it hasn't been processed yet.</p>
      </GlassmorphicCard>
    );
  }

  return (
    <GlassmorphicCard className={`p-6 ${className}`} data-testid="audio-player">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <CosmicButton
          variant="eclipse"
          size="sm"
          onClick={downloadAudio}
          className="flex items-center space-x-2"
          data-testid="download-audio-button"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </CosmicButton>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <Slider
          value={[progressPercentage]}
          onValueChange={handleTimeSeek}
          max={100}
          step={0.1}
          className="w-full"
          disabled={!duration || isLoading}
          data-testid="audio-progress-slider"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span data-testid="current-time">{formatTime(currentTime)}</span>
          <span data-testid="total-duration">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        {/* Skip Back */}
        <CosmicButton
          variant="eclipse"
          size="sm"
          onClick={() => skipTime(-15)}
          disabled={!duration}
          className="p-2"
          data-testid="skip-back-button"
        >
          <SkipBack className="w-4 h-4" />
        </CosmicButton>

        {/* Play/Pause */}
        <CosmicButton
          variant="remax"
          size="lg"
          onClick={togglePlay}
          disabled={isLoading || !!error}
          className="p-3"
          data-testid="play-pause-button"
        >
          {isLoading ? (
            <div className="w-6 h-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </CosmicButton>

        {/* Skip Forward */}
        <CosmicButton
          variant="eclipse"
          size="sm"
          onClick={() => skipTime(15)}
          disabled={!duration}
          className="p-2"
          data-testid="skip-forward-button"
        >
          <SkipForward className="w-4 h-4" />
        </CosmicButton>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-center space-x-3 mt-4">
        <button
          onClick={toggleMute}
          className="text-gray-400 hover:text-white transition-colors"
          data-testid="mute-button"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <div className="flex-1 max-w-32">
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-full"
            data-testid="volume-slider"
          />
        </div>
      </div>
    </GlassmorphicCard>
  );
}