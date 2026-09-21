import React from 'react';
import VideoPlayer from './VideoPlayer';
import { Layers, Trash2 } from 'lucide-react';

export default function MemoryItem({ memory, index, isHighlighted, onOpenMemory, onDeleteMemory }) {
  const { id, displayDate, text, media = [], positionHint = 'left' } = memory;

  // Alternating section colors: even index = pink (#ff1493), odd index = black (#000000)
  const isPinkSection = typeof index === 'number' ? index % 2 === 0 : true;
  const sectionThemeClass = isPinkSection ? 'section-pink' : 'section-black';

  // Enforce strict alternating left/right layout:
  // even index (0, 2, 4...) -> layout-left (Image on Left, Text beside it on Right)
  // odd index (1, 3, 5...)  -> layout-right (Image on Right, Text beside it on Left)
  let layoutClass = 'layout-left';
  if (typeof index === 'number') {
    layoutClass = index % 2 === 0 ? 'layout-left' : 'layout-right';
  } else if (positionHint === 'right' || positionHint === 'right-wide') {
    layoutClass = 'layout-right';
  }

  const renderSingleMedia = (m, index = 0, style = {}) => {
    const ratio = m.aspectRatio || (m.type === 'video' ? '16/9' : '4/3');
    const isVertical = ratio === '3/4' || ratio === '2/3';
    const isHorizontal = ratio === '16/9' || ratio === '4/3';
    const orientationClass = isVertical ? 'orient-vertical' : (isHorizontal ? 'orient-horizontal' : 'orient-square');

    if (m.type === 'video') {
      return (
        <div key={m.id || index} className={`pinned-media-wrap ${orientationClass} ${style.className || ''}`}>
          <VideoPlayer
            src={m.url}
            aspectRatio={ratio}
            caption={m.caption}
          />
        </div>
      );
    }
    return (
      <div
        key={m.id || index}
        className={`pinned-media-wrap ${orientationClass} ${style.className || ''}`}
        onClick={() => onOpenMemory(id, index)}
      >
        <div
          className="glass-media-frame"
          style={{ 
            aspectRatio: ratio, 
            ...(m.noBorder ? { border: 'none', boxShadow: 'none', background: 'transparent' } : {}),
            ...style 
          }}
        >
          <img 
            src={m.url} 
            alt={m.caption || 'Memory detail'} 
            style={m.fit ? { objectFit: m.fit } : {}}
          />
        </div>
      </div>
    );
  };

  return (
    <article 
      id={id} 
      className={`memory-block ${layoutClass} ${sectionThemeClass} ${isHighlighted ? 'highlight-pulse' : ''}`}
    >
      {/* Media container based on layout */}
      {layoutClass === 'layout-staggered-duo' && media.length >= 2 ? (
        <div className="duo-media-grid">
          <div className="media-one">
            {renderSingleMedia(media[0], 0)}
          </div>
          <div className="media-two">
            {renderSingleMedia(media[1], 1)}
          </div>
        </div>
      ) : (
        <div className="memory-media-wrap">
          {renderSingleMedia(media[0], 0)}
          {media.length > 1 && (
            <div className="badge-multi-media">
              <Layers size={12} />
              <span>+{media.length - 1} more</span>
            </div>
          )}
        </div>
      )}

      {/* Text reflection & date container */}
      <div className="memory-content-wrap">
        <div className="memory-header-row">
          <span className="memory-date">{displayDate}</span>
        </div>
        <p className="memory-reflection">{text}</p>
      </div>
    </article>
  );
}
