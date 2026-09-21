import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function VideoPlayer({ 
  src, 
  aspectRatio = "16/9", 
  caption = "", 
  className = ""
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((err) => console.log('Playback error:', err));
      }
    }
  };

  const toggleMute = (e) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      setProgress((current / dur) * 100);
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    if (videoRef.current && videoRef.current.duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const seekTime = (clickX / width) * videoRef.current.duration;
      videoRef.current.currentTime = seekTime;
      setProgress((clickX / width) * 100);
    }
  };

  return (
    <div 
      className={`glass-media-frame inline-video-frame ${className}`} 
      style={{ aspectRatio }}
      onClick={togglePlay}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        loop
        playsInline
        muted={isMuted}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Large Center Play Button when paused */}
      {!isPlaying && (
        <div className="minimal-play-btn" title="Play memory video" onClick={togglePlay}>
          <Play size={22} fill="#ffffff" stroke="none" style={{ marginLeft: '3px' }} />
        </div>
      )}

      {/* Inline Floating Controls */}
      <div 
        className={`inline-video-controls ${showControls || isPlaying ? 'visible' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          type="button" 
          className="video-ctrl-btn" 
          onClick={togglePlay} 
          title={isPlaying ? "Pause" : "Play"}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={14} fill="#ffffff" stroke="none" /> : <Play size={14} fill="#ffffff" stroke="none" />}
        </button>

        <div className="video-progress-track" onClick={handleSeek} title="Seek">
          <div className="video-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <button 
          type="button" 
          className="video-ctrl-btn" 
          onClick={toggleMute} 
          title={isMuted ? "Unmute" : "Mute"}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>
    </div>
  );
}
