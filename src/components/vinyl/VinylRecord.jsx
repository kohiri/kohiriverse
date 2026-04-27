import React from 'react';

export default function VinylRecord({ coverUrl, vinylColor, title, spotifyUrl }) {
  return (
    <a
      href={spotifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="vinyl-record-wrapper"
      style={{ '--vinyl-color': vinylColor }}
    >
      <div className="vinyl-record-container">
        {/* The Vinyl Disc */}
        <div className="vinyl-disc">
          <div className="vinyl-grooves"></div>
          <div className="vinyl-label" style={{ backgroundColor: vinylColor }}>
            <div className="vinyl-hole"></div>
          </div>
        </div>
        
        {/* The Album Cover */}
        <div className="vinyl-cover">
          <img src={coverUrl} alt={title} className="cover-image" />
          <div className="cover-reflection"></div>
        </div>
      </div>
      <h3 className="album-title">{title}</h3>
    </a>
  );
}
