import React, { useRef } from 'react';
import { Pen, Brush, Highlighter, Trash2, Type, Image as ImageIcon, Eraser, Undo } from 'lucide-react';

const COLORS = [
  '#4a4559', '#f4cddf', '#ff99c8', '#d5ccf5', '#9d8189', '#cce0f5', '#a0c4ff',
  '#fcefc7', '#fdffb6', '#b9e6d3', '#9bf6ff', '#caffbf', '#ffd6a5', '#ffffff'
];

export default function StationeryToolbar({ 
  activeTool, setActiveTool, activeColor, setActiveColor, 
  onClear, onAddElement, onUndo, isMobile, 
  selectedBackground, setSelectedBackground,
  showTools = true, showPanel = true
}) {
  const fileInputRef = useRef(null);
  const colorInputRef = useRef(null);
  const BACKGROUNDS = ['1.png', '2.png', '3.png', '4.png', '5.png'];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onAddElement({ type: 'image', content: url });
      e.target.value = '';
    }
  };

  return (
    <div className="glass-panel" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      padding: isMobile ? '8px' : '20px',
      gap: '16px',
      width: isMobile ? '110px' : '160px',
      alignItems: 'center',
      minHeight: '200px'
    }}>
      {/* Tools Section */}
      {showTools && (
        <div style={{ width: '100%' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '8px', 
            justifyItems: 'center'
          }}>
            <button className={activeTool === 'pen' ? 'active' : ''} onClick={() => setActiveTool('pen')} title="Pen" style={{ padding: '8px', width: '100%' }}>
              <Pen size={18} />
            </button>
            <button className={activeTool === 'brush' ? 'active' : ''} onClick={() => setActiveTool('brush')} title="Brush" style={{ padding: '8px', width: '100%' }}>
              <Brush size={18} />
            </button>
            <button className={activeTool === 'highlighter' ? 'active' : ''} onClick={() => setActiveTool('highlighter')} title="Highlighter" style={{ padding: '8px', width: '100%' }}>
              <Highlighter size={18} />
            </button>
            <button className={activeTool === 'eraser' ? 'active' : ''} onClick={() => setActiveTool('eraser')} title="Eraser" style={{ padding: '8px', width: '100%' }}>
              <Eraser size={18} />
            </button>
            <button onClick={() => onAddElement({ type: 'text', content: 'Double click to edit' })} title="Text" style={{ padding: '8px', width: '100%' }}>
              <Type size={18} />
            </button>
            <button onClick={() => fileInputRef.current?.click()} title="Image" style={{ padding: '8px', width: '100%' }}>
              <ImageIcon size={18} />
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
            <button onClick={onUndo} title="Undo" style={{ padding: '8px', width: '100%' }}>
              <Undo size={18} />
            </button>
            <button onClick={onClear} title="Clear" style={{ padding: '8px', width: '100%', backgroundColor: '#ffeeee', color: '#e57373' }}>
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Colors & Background Section */}
      {showPanel && (
        <>
          <div style={{ width: '100%' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.7rem', textTransform: 'uppercase', color: '#888', textAlign: 'center' }}>Colors</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', justifyItems: 'center' }}>
              {COLORS.map(color => (
                <div 
                  key={color} onClick={() => setActiveColor(color)}
                  style={{
                    width: '18px', height: '18px', borderRadius: '50%', backgroundColor: color, cursor: 'pointer',
                    border: activeColor === color ? '2px solid #fff' : '1px solid rgba(0,0,0,0.1)',
                    boxShadow: activeColor === color ? '0 0 0 1px #ccc' : 'none',
                    transition: 'transform 0.2s'
                  }}
                />
              ))}
              
              {/* Rainbow Color Picker Button */}
              <div 
                onClick={() => colorInputRef.current?.click()}
                style={{
                  width: '18px', height: '18px', borderRadius: '50%', 
                  background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                  cursor: 'pointer',
                  border: activeColor && !COLORS.includes(activeColor) ? '2px solid #fff' : '1px solid rgba(0,0,0,0.1)',
                  boxShadow: activeColor && !COLORS.includes(activeColor) ? '0 0 0 1px #ccc' : 'none',
                  transition: 'transform 0.2s'
                }}
                title="Custom Color"
              />
              <input 
                type="color" 
                ref={colorInputRef}
                value={activeColor}
                onChange={(e) => setActiveColor(e.target.value)}
                style={{ 
                  position: 'absolute',
                  opacity: 0,
                  pointerEvents: 'none',
                  width: 0,
                  height: 0
                }}
              />
            </div>
          </div>

          <div style={{ width: '100%', borderTop: '1px dashed #eee', paddingTop: '12px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.7rem', textTransform: 'uppercase', color: '#888', textAlign: 'center' }}>Background</h4>
            <select 
              value={selectedBackground} 
              onChange={(e) => setSelectedBackground(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '0.8rem',
                borderRadius: '8px',
                border: '1px solid #ddd',
                background: '#fff',
                cursor: 'pointer',
                outline: 'none',
                color: '#444'
              }}
            >
              {BACKGROUNDS.map(bg => (
                <option key={bg} value={bg}>
                  Option {bg[0]}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
}
