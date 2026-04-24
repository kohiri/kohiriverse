import React from 'react';
import HTMLFlipBook from 'react-pageflip';

export default function FlipBook({ pages, onAddPage }) {
  return (
    <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
      <div style={{ position: 'relative', width: '900px', height: '600px' }}>
        <HTMLFlipBook 
          width={450} 
          height={600} 
          size="fixed"
          minWidth={450}
          maxWidth={450}
          minHeight={600}
          maxHeight={600}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
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
            <img src="/back.png" alt="Back Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </HTMLFlipBook>
      </div>

      {/* Button to add a new page (opens canvas) */}
      <button 
        onClick={onAddPage}
        style={{
          padding: '12px 24px',
          backgroundColor: 'var(--text-main)',
          color: 'white',
          border: 'none',
          borderRadius: '24px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}
      >
        Create New Page
      </button>
    </div>
  );
}
