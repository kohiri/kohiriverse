import React from 'react';
import HTMLFlipBook from 'react-pageflip';

export default function FlipBook({ pages, onAddPage, scale = 1 }) {
  return (
    <div style={{ 
      margin: 'auto', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '15px',
      width: '100%',
      overflow: 'hidden',
      paddingTop: '40px'
    }}>
      <div style={{ 
        position: 'relative', 
        width: 900 * scale, 
        height: 600 * scale,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Adding a frame effect
        boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
        borderRadius: '8px',
        padding: '10px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <HTMLFlipBook 
          key={`flipbook-${scale}`} // Force re-mount on scale change to recalculate hit areas
          width={450 * scale} 
          height={600 * scale} 
          size="fixed"
          minWidth={450 * scale}
          maxWidth={450 * scale}
          minHeight={600 * scale}
          maxHeight={600 * scale}
          maxShadowOpacity={0} // Removed shadows
          showCover={true}
          mobileScrollSupport={true}
          usePortrait={false} 
          startPage={0}
          drawShadow={false} // Removed shadows
          flippingTime={1000}
          useMouseEvents={true}
          clickEventForward={true}
        >
        {/* Front Cover */}
        <div className="page page-cover page-cover-top" data-density="hard">
          <div className="page-content" style={{ width: '100%', height: '100%' }}>
            <img src="/front.png" alt="Front Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* Inside Front Cover (Empty or patterned) */}
        <div className="page" data-density="hard">
          <div className="page-content"></div>
        </div>

        {/* Dynamic Pages */}
        {pages.map((page, index) => (
          <div className="page page-inner" key={page.id || index}>
            <div className="page-content" style={{ position: 'relative', width: '100%', height: '100%' }}>
              <img 
                src={page.image_url} 
                alt={`Page ${index + 1}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ 
                position: 'absolute', 
                bottom: '10px', 
                right: '10px', 
                fontFamily: '"Indie Flower", cursive', 
                color: '#666' 
              }}>
                Page {index + 1}
              </div>
            </div>
          </div>
        ))}

        {/* Inside Back Cover */}
        <div className="page" data-density="hard">
          <div className="page-content"></div>
        </div>

        {/* Back Cover */}
        <div className="page page-cover page-cover-bottom" data-density="hard">
          <div className="page-content" style={{ width: '100%', height: '100%' }}>
            <img src="/coverpage.jpg" alt="Back Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </HTMLFlipBook>
      </div>

      {/* Button to add a new page (opens canvas) */}
      <button 
        onClick={onAddPage}
        style={{
          padding: '6px 16px',
          backgroundColor: 'var(--text-main)',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          marginTop: '-5px',
          zIndex: 10
        }}
      >
        Create New Page
      </button>
    </div>
  );
}
