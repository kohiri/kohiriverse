import React from 'react';

const Sidebar = ({ library, activeTracks, onAddTrack, isRecording, onToggleRecord, onShare }) => {
  return (
    <>
      <div className="tech-decoration" style={{ top: '10px', left: '10px' }}>[ LIB_DB ]</div>
      <h2 className="glitch-hover" data-text="LIBRARY">LIBRARY</h2>
      <div className="track-list">
        {library.map((instrument) => {
          const isActive = activeTracks.find(t => t.id === instrument.id);
          return (
            <div key={instrument.id} className="track-item" style={{ borderLeftColor: instrument.color }}>
              <span className="track-name">{instrument.name}</span>
              {isActive ? (
                <span className="status ready">ADDED</span>
              ) : (
                <button 
                  className="add-btn" 
                  onClick={() => onAddTrack(instrument)}
                  style={{ borderColor: instrument.color, color: instrument.color }}
                >
                  + ADD
                </button>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="sidebar-actions">
        <button 
          className="neon-btn export-btn" 
          onClick={onToggleRecord}
          style={isRecording ? { backgroundColor: 'red', color: 'white', borderColor: 'red' } : {}}
        >
          {isRecording ? 'STOP RECORDING' : 'EXPORT MIX'}
        </button>
        <button className="neon-btn export-btn" onClick={onShare}>SHARE</button>
      </div>
    </>
  );
};


export default Sidebar;
