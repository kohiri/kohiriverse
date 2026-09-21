import React from 'react';

export default function SubtleTimeline({ memories, onSelectMemory, activeMemoryId }) {
  if (!memories || memories.length === 0) return null;

  return (
    <div className="subtle-timeline" title="Chronological Journey">
      <div className="timeline-line" />
      {memories.map((mem) => {
        const isActive = activeMemoryId === mem.id;
        return (
          <div
            key={mem.id}
            className={`timeline-dot ${isActive ? 'active' : ''}`}
            onClick={() => onSelectMemory(mem.id)}
            title={`${mem.displayDate || mem.date}: "${mem.text.slice(0, 35)}..."`}
          />
        );
      })}
    </div>
  );
}
