import React, { useState, useRef, useEffect } from 'react';
import { PenTool, Type, Eraser, Check } from 'lucide-react';

export default function SignaturePad({ initialSignature, onSaveSignature }) {
  const [mode, setMode] = useState('draw'); // 'draw' | 'type'
  const [typedName, setTypedName] = useState('');
  const [typedFont, setTypedFont] = useState('Caveat');
  const [penColor, setPenColor] = useState('#64165D');
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = penColor;
  }, [penColor]);

  // Handle drawing coordinates
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  // Convert typed or drawn signature into transparent PNG data URL
  const handleSave = () => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png');
      onSaveSignature({ type: 'image', value: dataUrl });
    } else {
      if (!typedName.trim()) return;
      // Render typed text onto canvas to make it a transparent PNG
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = penColor;
      ctx.font = `italic 42px '${typedFont}', cursive`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(typedName, 150, 50);
      const dataUrl = canvas.toDataURL('image/png');
      onSaveSignature({ type: 'image', value: dataUrl, text: typedName, font: typedFont });
    }
  };

  return (
    <div className="sig-pad-container">
      {/* MODE TABS */}
      <div className="sig-tabs">
        <button
          type="button"
          className={`sig-tab ${mode === 'draw' ? 'active' : ''}`}
          onClick={() => setMode('draw')}
        >
          <PenTool size={16} /> Draw Signature
        </button>
        <button
          type="button"
          className={`sig-tab ${mode === 'type' ? 'active' : ''}`}
          onClick={() => setMode('type')}
        >
          <Type size={16} /> Type in Cursive
        </button>
      </div>

      {/* COLOR PICKER */}
      <div className="sig-color-row">
        <span className="sig-label">Ink Color:</span>
        <button
          type="button"
          className={`color-dot ${penColor === '#ff66c4' ? 'selected' : ''}`}
          style={{ background: '#ff66c4' }}
          onClick={() => setPenColor('#ff66c4')}
          title="Celestial Pink (#ff66c4)"
        />
        <button
          type="button"
          className={`color-dot ${penColor === '#ede4da' ? 'selected' : ''}`}
          style={{ background: '#ede4da', border: '1px solid #999' }}
          onClick={() => setPenColor('#ede4da')}
          title="Sand Cream Ink (#ede4da)"
        />
        <button
          type="button"
          className={`color-dot ${penColor === '#ffffff' ? 'selected' : ''}`}
          style={{ background: '#ffffff', border: '1px solid #999' }}
          onClick={() => setPenColor('#ffffff')}
          title="Pure White Ink"
        />
        <button
          type="button"
          className={`color-dot ${penColor === '#64165D' ? 'selected' : ''}`}
          style={{ background: '#64165D' }}
          onClick={() => setPenColor('#64165D')}
          title="Plum Ink"
        />
        <button
          type="button"
          className={`color-dot ${penColor === '#8A176E' ? 'selected' : ''}`}
          style={{ background: '#8A176E' }}
          onClick={() => setPenColor('#8A176E')}
          title="Magenta Ink"
        />
        <button
          type="button"
          className={`color-dot ${penColor === '#171317' ? 'selected' : ''}`}
          style={{ background: '#171317' }}
          onClick={() => setPenColor('#171317')}
          title="Black Charcoal Ink"
        />
      </div>

      {mode === 'draw' ? (
        <div className="draw-area-wrapper">
          <canvas
            ref={canvasRef}
            width={320}
            height={110}
            className="signature-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          <div className="canvas-watermark">Sign inside this box</div>
          <button
            type="button"
            className="sig-clear-btn"
            onClick={clearCanvas}
            title="Clear drawing"
          >
            <Eraser size={14} /> Clear
          </button>
        </div>
      ) : (
        <div className="type-area-wrapper">
          <input
            type="text"
            placeholder="Type your signature here..."
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            className="type-sig-input"
          />
          <div className="font-selector-row">
            {['Amarante', 'Caveat', 'Alex Brush', 'Reenie Beanie'].map(font => (
              <button
                key={font}
                type="button"
                className={`font-chip ${typedFont === font ? 'active' : ''}`}
                style={{ fontFamily: font }}
                onClick={() => setTypedFont(font)}
              >
                {font}
              </button>
            ))}
          </div>
          {typedName && (
            <div
              className="sig-preview-line"
              style={{ fontFamily: `'${typedFont}', cursive`, color: penColor }}
            >
              {typedName}
            </div>
          )}
        </div>
      )}

      {/* CONFIRM BUTTON */}
      <button
        type="button"
        className="btn-apply-sig"
        onClick={handleSave}
      >
        <Check size={16} /> Confirm Signature
      </button>
    </div>
  );
}
