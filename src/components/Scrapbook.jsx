import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { supabase } from '../supabaseClient';
import ScrapbookCanvas from './scrapbook/ScrapbookCanvas';
import StationeryToolbar from './scrapbook/StationeryToolbar';
import FlipBook from './scrapbook/FlipBook';

export default function Scrapbook() {
  const [isEditing, setIsEditing] = useState(false);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  const [activeTool, setActiveTool] = useState('pen');
  const [activeColor, setActiveColor] = useState('#540508');
  const [selectedBackground, setSelectedBackground] = useState('1.png');
  const [elements, setElements] = useState([]);
  const [actionHistory, setActionHistory] = useState([]);
  
  const canvasWrapperRef = useRef(null);
  const canvasRefInner = useRef(null);

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const isLandscape = window.innerWidth > window.innerHeight;
      
      // We want to leave some padding for UI elements
      // On small landscape screens, we reduce the padding to maximize space
      const paddingH = isMobile ? (isLandscape ? 40 : 100) : 120;
      const paddingW = isMobile ? 20 : 60;

      const availableHeight = window.innerHeight - paddingH;
      const availableWidth = window.innerWidth - paddingW;
      
      let requiredHeight = 650;
      let requiredWidth = 950; 

      if (isEditing) {
        requiredWidth = isMobile ? (isLandscape ? 1000 : 500) : 1000;
        requiredHeight = isMobile ? (isLandscape ? 650 : 1100) : 700;
      }
      
      const scaleH = availableHeight / requiredHeight;
      const scaleW = availableWidth / requiredWidth;
      
      // Ensure we have a minimum scale on mobile to keep things readable
      // If the scale is too small, we'll let the container scroll
      const minScale = isMobile ? 0.5 : 0.3;
      let newScale = Math.min(scaleH, scaleW, 1);
      
      if (newScale < minScale && isMobile) {
        newScale = minScale;
      }

      setScale(newScale);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [isEditing]);

  useEffect(() => {
    fetchPages();
    const onAddedStroke = () => setActionHistory(prev => [...prev, 'stroke']);
    window.addEventListener('addedStroke', onAddedStroke);

    // Failsafe for loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => {
      window.removeEventListener('addedStroke', onAddedStroke);
      clearTimeout(timer);
    };
  }, []);

  const fetchPages = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('scrapbook_pages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching pages:', error);
    } else {
      setPages(data || []);
    }
    setLoading(false);
  };

  const handleAddElement = (elementData) => {
    const newElement = {
      id: Date.now() + Math.random(),
      type: elementData.type,
      content: elementData.content,
      x: 100,
      y: 100,
    };
    setElements([...elements, newElement]);
    setActionHistory([...actionHistory, 'element']);
  };

  const clearCanvas = () => {
    const event = new CustomEvent('clearCanvas');
    window.dispatchEvent(event);
    setElements([]);
    setActionHistory([]);
  };

  const handleUndo = () => {
    if (actionHistory.length === 0) return;
    const lastAction = actionHistory[actionHistory.length - 1];
    setActionHistory(prev => prev.slice(0, -1));

    if (lastAction === 'element') {
      setElements(prev => prev.slice(0, -1));
    } else if (lastAction === 'stroke') {
      window.dispatchEvent(new CustomEvent('undoCanvasStroke'));
    }
  };

  const handleSavePage = async () => {
    if (!canvasWrapperRef.current) return;
    setIsUploading(true);
    
    try {
      // Deselect any selected image so the floating toolbar is hidden before capture
      window.dispatchEvent(new CustomEvent('deselectAll'));
      
      // Remove focus from contentEditable to prevent caret/focus-related shifting
      if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur();
      }

      // Wait two frames for React to re-render the deselected state
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      // Temporarily set scale to 1 for pristine capture
      const originalScale = scale;
      setScale(1);
      await new Promise(resolve => setTimeout(resolve, 50)); // let DOM update and layout settle

      // Capture the canvas and all its elements (stickers, text, images)
      const canvas = await html2canvas(canvasWrapperRef.current, {
        backgroundColor: '#fdfdfd',
        scale: 2, // better quality
        useCORS: true, // for external images if any
        scrollY: -window.scrollY, // Fix for browser scroll offset issues in html2canvas
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      });
      
      setScale(originalScale);
      
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
      const fileName = `page_${Date.now()}.jpg`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('scrapbook')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('scrapbook')
        .getPublicUrl(fileName);

      // Save to DB
      const { error: dbError } = await supabase
        .from('scrapbook_pages')
        .insert([{ image_url: publicUrl }]);

      if (dbError) throw dbError;
      
      // Reset editor
      clearCanvas();
      setIsEditing(false);
      
      // Force a short delay before fetching to ensure DB update is consistent
      setTimeout(() => {
        fetchPages();
      }, 500);
    } catch (err) {
      console.error('Failed to save page', err);
      alert(`Failed to save page: ${err.message || err.error_description || JSON.stringify(err)}`);
    } finally {
      setIsUploading(false);
    }
  };
  const isMobile = window.innerWidth < 768;

  if (!supabase) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-6 text-center max-w-md mx-auto">
        <div className="text-4xl">⚠️</div>
        <h3 className="text-white text-xl font-bold">Supabase Not Connected</h3>
        <p className="text-zinc-400 text-sm leading-relaxed">
          The shared scrapbook requires a backend. Please follow the instructions in the 
          <span className="text-blue-400"> walkthrough.md</span> to add your Supabase URL and Key to 
          <code className="bg-zinc-800 px-1 rounded">supabaseClient.js</code>.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-700 border-t-blue-500"></div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-zinc-500 font-medium tracking-widest uppercase text-[10px]">Synchronizing Book...</p>
          <button 
            onClick={() => { setLoading(true); fetchPages(); }}
            className="text-[10px] text-blue-400/60 hover:text-blue-400 underline underline-offset-4 tracking-widest uppercase"
          >
            Force Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="scrapbook-container" style={{ 
      padding: '10px 0', 
      width: '100%', 
      height: '100%', 
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      
      {!isEditing ? (
        <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {pages.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center gap-6 glass-panel" style={{ maxWidth: '400px', margin: '100px auto' }}>
              <div className="text-6xl">📖</div>
              <h3 className="text-zinc-800 text-2xl font-bold">The Book starts here</h3>
              <p className="text-zinc-600">Capture the first page and leave your mark on the universe.</p>
              <button 
                  onClick={() => setIsEditing(true)}
                  style={{ backgroundColor: 'var(--text-main)', color: 'white', fontWeight: 'bold' }}
              >
                  Create First Page
              </button>
            </div>
          ) : (
            <FlipBook pages={pages} onAddPage={() => setIsEditing(true)} scale={scale} />
          )}
        </div>
      ) : (
        <div style={{ 
          margin: 'auto', 
          display: 'grid', 
          gridTemplateColumns: isMobile ? 'auto 1fr auto' : 'auto 1fr auto',
          gap: isMobile ? '10px' : '30px', 
          alignItems: 'start', 
          justifyContent: 'center', 
          padding: '10px', 
          width: '100%',
          minHeight: '100%',
          maxWidth: '1200px'
        }}>
          
          {/* Left Column: Tools & Primary Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <StationeryToolbar 
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              activeColor={activeColor}
              setActiveColor={setActiveColor}
              onClear={clearCanvas}
              onAddElement={handleAddElement}
              onUndo={handleUndo}
              isMobile={isMobile}
              showTools={true}
              showPanel={false}
            />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <button 
                onClick={handleSavePage}
                disabled={isUploading}
                style={{ 
                    padding: '8px', 
                    fontSize: '0.8rem', 
                    backgroundColor: 'var(--text-main)', 
                    color: 'white', 
                    fontWeight: 'bold',
                    borderRadius: '8px'
                }}
              >
                {isUploading ? '...' : 'Save'}
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                disabled={isUploading}
                style={{ 
                  padding: '8px', 
                  fontSize: '0.8rem', 
                  backgroundColor: '#fff', 
                  color: '#666', 
                  border: '1px solid #ddd',
                  borderRadius: '8px'
                }}
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Centre Column: Drawing Area */}
          <div className="scrapbook-wrapper" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              width: 450 * scale, 
              height: 600 * scale, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                transform: `scale(${scale})`, 
                transformOrigin: 'center center',
                width: 450, 
                height: 600 
              }}>
                <div ref={canvasWrapperRef} style={{ width: 450, height: 600, position: 'relative', background: '#fff' }}>
                  <ScrapbookCanvas 
                    activeTool={activeTool} 
                    activeColor={activeColor}
                    elements={elements}
                    setElements={setElements}
                    canvasRefInner={canvasRefInner}
                    selectedBackground={selectedBackground}
                    scale={scale}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Colors & Backgrounds */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <StationeryToolbar 
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              activeColor={activeColor}
              setActiveColor={setActiveColor}
              onClear={clearCanvas}
              onAddElement={handleAddElement}
              onUndo={handleUndo}
              isMobile={isMobile}
              selectedBackground={selectedBackground}
              setSelectedBackground={setSelectedBackground}
              showTools={false}
              showPanel={true}
            />
          </div>
        </div>
      )}
      
    </div>
  );
}
