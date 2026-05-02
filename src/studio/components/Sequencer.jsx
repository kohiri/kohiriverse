import React from 'react';

const Sequencer = ({ tracks, currentStep, toggleStep, onRemoveTrack, isPlaying }) => {
  return (
    <div className="sequencer-container">
      <div className="tech-decoration" style={{ top: '5px', right: '10px' }}>[ SEQ_GRID ]</div>
      {tracks.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--color-dark-green)', marginTop: '40px', letterSpacing: '2px' }}>
          NO SIGNAL DETECTED. LOAD MODULES FROM LIB_DB.
        </div>
      )}
      {tracks.map((track, trackIndex) => (
        <div key={track.id} className="track-row">
          <div className="track-label-container">
            <div className="track-label" style={{ color: track.color, textShadow: `0 0 5px ${track.color}` }}>
              {track.name}
            </div>
            <button className="remove-btn" onClick={() => onRemoveTrack(track.id)} title="Remove Track">×</button>
          </div>
          <div className="steps-container">
            {track.steps.map((isActive, stepIndex) => (
              <div
                key={stepIndex}
                className={`step ${isActive ? 'active' : ''} ${isPlaying && currentStep === stepIndex ? 'current' : ''}`}
                style={{
                  backgroundColor: isActive ? track.color : 'rgba(32, 32, 32, 0.8)',
                  boxShadow: isActive ? `0 0 10px ${track.color}` : 'none'
                }}
                onClick={() => toggleStep(trackIndex, stepIndex)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sequencer;
