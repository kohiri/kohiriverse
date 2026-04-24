import React, { useRef } from 'react';
import { Pen, Brush, Highlighter, Trash2, Type, Image as ImageIcon, Eraser, Undo } from 'lucide-react';

const COLORS = [
  '#4a4559', // Dark grey/ink
  '#f4cddf', // Pastel pink
  '#ff99c8', // Hot pink
  '#d5ccf5', // Soft lilac
  '#9d8189', // Dusty rose
  '#cce0f5', // Baby blue
  '#a0c4ff', // Sky blue
  '#fcefc7', // Pale yellow
  '#fdffb6', // Lemon
  '#b9e6d3', // Mint green
  '#9bf6ff', // Cyan
  '#caffbf', // Lime green
  '#ffd6a5', // Orange
  '#ffffff', // White out
];

export default function StationeryToolbar({ activeTool, setActiveTool, activeColor, setActiveColor, onClear, onAddElement, onUndo }) {
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onAddElement({ type: 'image', content: url });
      e.target.value = ''; // reset
    }
  };

  const handleAddText = () => {
    onAddElement({ type: 'text', content: 'Double click to edit' });
  };

  return (
    <div className="glass-panel" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      padding: '24px',
      gap: '24px',
      width: '180px',
      alignItems: 'center'
    }}>
      {/* Tools Section */}
      <div style={{ width: '100%' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 600, textAlign: 'center', borderBottom: '1px dashed rgba(0,0,0,0.1)', paddingBottom: '8px' }}>
          Tools
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', justifyItems: 'center' }}>
          <button 
            className={activeTool === 'pen' ? 'active' : ''} 
            onClick={() => setActiveTool('pen')}
            title="Fine Pen"
            style={{ width: '100%', padding: '12px 0' }}
          >
            <Pen size={20} />
          </button>
          
          <button 
            className={activeTool === 'brush' ? 'active' : ''} 
            onClick={() => setActiveTool('brush')}
            title="Paint Brush"
            style={{ width: '100%', padding: '12px 0' }}
          >
            <Brush size={20} />
          </button>
          
          <button 
            className={activeTool === 'highlighter' ? 'active' : ''} 
            onClick={() => setActiveTool('highlighter')}
            title="Highlighter"
            style={{ width: '100%', padding: '12px 0' }}
          >
            <Highlighter size={20} />
          </button>

          <button 
            className={activeTool === 'eraser' ? 'active' : ''} 
            onClick={() => setActiveTool('eraser')}
            title="Eraser"
            style={{ width: '100%', padding: '12px 0' }}
          >
            <Eraser size={20} />
          </button>

          <button 
            onClick={handleAddText}
            title="Add Text"
            style={{ width: '100%', padding: '12px 0' }}
          >
            <Type size={20} />
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            title="Upload Image"
            style={{ width: '100%', padding: '12px 0' }}
          >
            <ImageIcon size={20} />
          </button>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            style={{ display: 'none' }} 
          />

          <button 
            onClick={onUndo}
            title="Undo"
            style={{ width: '100%', padding: '12px 0' }}
          >
            <Undo size={20} />
          </button>

          <button 
            onClick={onClear}
            style={{ 
              backgroundColor: '#ffeeee', 
              color: '#e57373', 
              width: '100%',
              padding: '12px 0'
            }}
            title="Clear Page"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Colors Section */}
      <div style={{ width: '100%' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 600, textAlign: 'center', borderBottom: '1px dashed rgba(0,0,0,0.1)', paddingBottom: '8px' }}>
          Colors
        </h3>
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '10px', 
            justifyItems: 'center' 
        }}>
          {COLORS.map(color => (
            <div 
              key={color}
              onClick={() => setActiveColor(color)}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: color,
                cursor: 'pointer',
                border: activeColor === color ? '3px solid #fff' : '1px solid rgba(0,0,0,0.1)',
                boxShadow: activeColor === color ? '0 0 0 2px var(--accent-lilac)' : 'inset 0 2px 4px rgba(0,0,0,0.1)',
                transform: activeColor === color ? 'scale(1.15)' : 'scale(1)',
                transition: 'all 0.2s ease',
              }}
              title={`Color: ${color}`}
            />
          ))}
          {/* Custom Color Picker */}
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: !COLORS.includes(activeColor) ? '3px solid #fff' : '1px solid rgba(0,0,0,0.1)',
            boxShadow: !COLORS.includes(activeColor) ? '0 0 0 2px var(--accent-lilac)' : 'inset 0 2px 4px rgba(0,0,0,0.1)',
            transform: !COLORS.includes(activeColor) ? 'scale(1.15)' : 'scale(1)',
            transition: 'all 0.2s ease',
            position: 'relative',
            background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
            cursor: 'pointer'
          }} title="Custom Color">
            <input 
              type="color" 
              value={activeColor} 
              onChange={(e) => setActiveColor(e.target.value)}
              style={{
                opacity: 0,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                cursor: 'pointer'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
