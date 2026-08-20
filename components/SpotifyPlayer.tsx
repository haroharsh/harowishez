'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, Disc, AlertCircle } from 'lucide-react';
import { formatAudioUrl } from '@/lib/utils';

interface SpotifyPlayerProps {
  songUrl?: string;
  recipientName: string;
}

// Convert Base64 data URL to Blob for high-performance audio streaming
function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'audio/mp3';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export function SpotifyPlayer({ songUrl, recipientName }: SpotifyPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const fallbackSong = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=happy-birthday-114424.mp3';
  const formattedSong = formatAudioUrl(songUrl);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let blobUrl = '';
    setAudioError(null);
    setIsPlaying(false);

    // Determine final audio src URL (Blob URL for Base64, CDN URL for Drive/HTTP, or fallback)
    let audioSrc = formattedSong && formattedSong.trim() !== '' ? formattedSong : fallbackSong;

    if (audioSrc.startsWith('data:audio/')) {
      try {
        const blob = dataURLtoBlob(audioSrc);
        blobUrl = URL.createObjectURL(blob);
        audioSrc = blobUrl;
      } catch (err) {
        console.error('Base64 audio blob conversion error:', err);
      }
    }

    audio.src = audioSrc;
    audio.load();

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);
    const handleError = (e: any) => {
      console.warn('Audio element playback error:', e);
      setAudioError('Click Play to start music.');
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);

      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [formattedSong]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    setAudioError(null);

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error('Audio play error:', err);
          playFallbackSynthMelody();
          setIsPlaying(true);
        });
    }
  };

  // Web Audio API synth backup if audio stream fails
  const playFallbackSynthMelody = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const notes = [261.63, 261.63, 293.66, 261.63, 349.23, 329.63, 261.63, 261.63, 293.66, 261.63, 392.00, 349.23];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.4);
        
        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.4);
        gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + idx * 0.4 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.4 + 0.38);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.4);
        osc.stop(ctx.currentTime + idx * 0.4 + 0.39);
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
      setIsMuted(vol === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 0.8;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === Infinity) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-12 bg-[#121212] text-white p-5 sm:p-6 rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden group">
      
      <audio ref={audioRef} preload="auto" />

      {/* Spotify Green Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#1DB954]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
        
        {/* Album Artwork */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-[#282828] rounded-xl overflow-hidden shadow-lg border border-white/10 flex items-center justify-center">
          <Disc className={`w-12 h-12 text-[#1DB954] ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute bottom-2 left-2 text-[10px] font-sans font-bold tracking-widest text-[#1DB954] uppercase">
            SPOTIFY
          </span>
        </div>

        {/* Track Details & Controls */}
        <div className="flex-1 w-full">
          
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-[#1DB954]" />
                <h4 className="font-sans font-bold text-base sm:text-lg tracking-wide text-white">
                  {recipientName}&apos;s Birthday Soundtrack
                </h4>
              </div>
              <p className="font-sans text-xs text-white/60">
                Celebration Track • Harowishez Audio
              </p>
            </div>

            {/* Sound Wave Animation */}
            {isPlaying && (
              <div className="flex items-end gap-1 h-5">
                <div className="w-1 bg-[#1DB954] animate-bounce h-3" />
                <div className="w-1 bg-[#1DB954] animate-bounce h-5" style={{ animationDelay: '0.2s' }} />
                <div className="w-1 bg-[#1DB954] animate-bounce h-2" style={{ animationDelay: '0.4s' }} />
                <div className="w-1 bg-[#1DB954] animate-bounce h-4" style={{ animationDelay: '0.1s' }} />
              </div>
            )}
          </div>

          {/* Progress Slider */}
          <div className="flex items-center gap-3 my-2">
            <span className="text-xs font-mono text-white/60 min-w-[36px]">
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
            />

            <span className="text-xs font-mono text-white/60 min-w-[36px]">
              {formatTime(duration)}
            </span>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={togglePlay}
              className="p-3.5 bg-[#1DB954] text-black rounded-full hover:scale-105 active:scale-95 transition-transform font-bold flex items-center justify-center shadow-lg"
              title={isPlaying ? 'Pause song' : 'Play song'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
            </button>

            {audioError && (
              <span className="text-[11px] text-yellow-400 font-sans flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{audioError}</span>
              </span>
            )}

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-white/70 hover:text-white">
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
