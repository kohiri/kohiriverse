import React, { useRef } from 'react';

const Controls = ({ isPlaying, setIsPlaying, bpm, setBpm, onUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="controls-container">
      <div className="tech-decoration" style={{ bottom: '5px', left: '10px' }}>[ CTRL_PNL ]</div>
      <div className="playback-controls">
        <button 
          className="neon-btn"
          onClick={() => setIsPlaying(!isPlaying)}
          style={{ borderColor: isPlaying ? 'var(--color-neon-green)' : '', color: isPlaying ? 'var(--color-text)' : '', background: isPlaying ? 'rgba(93, 214, 44, 0.2)' : '' }}
        >
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>
        <button 
          className="neon-btn"
          onClick={() => setIsPlaying(false)}
        >
          STOP
        </button>
      </div>

      <div className="bpm-control">
        <label className="bpm-label">BPM: {bpm}</label>
        <input 
          type="range" 
          min="60" 
          max="200" 
          value={bpm} 
          onChange={(e) => setBpm(Number(e.target.value))}
          className="neon-slider"
        />
      </div>

      <div className="upload-control">
        <input 
          type="file" 
          accept="audio/*" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />
        <button 
          className="neon-btn glitch-hover" 
          data-text="UPLOAD SYS"
          onClick={() => fileInputRef.current?.click()}
        >
          UPLOAD SYS
        </button>
      </div>
    </div>
  );
};

export default Controls;
