import React, { useRef, useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';

export default function ScrapbookCanvas({ activeTool, activeColor, elements, setElements, canvasRefInner, selectedBackground }) {
  const canvasRef = canvasRefInner || useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const canvasHistory = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Set actual rendering dimensions, not just CSS
    canvas.width = 450; 
    canvas.height = 600;
    
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.lineCap = 'round';
    context.lineJoin = 'round';
    setCtx(context);

    // Initial paper fill to ensure highlighters mix correctly if we try to export
    // But since it's just visual, let it be transparent. The CSS paper texture handles the background.
    
    const handleUndoCanvasStroke = () => {
      if (canvasHistory.current.length > 0) {
        const lastState = canvasHistory.current.pop();
        const img = new window.Image();
        img.src = lastState;
        img.onload = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0);
        };
      }
    };

    const handleClear = () => {
      canvasHistory.current = [];
      context.clearRect(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('clearCanvas', handleClear);
    window.addEventListener('undoCanvasStroke', handleUndoCanvasStroke);
    
    return () => {
      window.removeEventListener('clearCanvas', handleClear);
      window.removeEventListener('undoCanvasStroke', handleUndoCanvasStroke);
    };
  }, []);

  const getCoordinates = (e) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    // Using offsetX/offsetY for exact 1:1 pointer mapping since canvas size matches CSS size
    return {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
  };

  const startDrawing = (e) => {
    if (!ctx) return;
    
    canvasHistory.current.push(canvasRef.current.toDataURL());

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    
    if (activeTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = 20;
    } else if (activeTool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over'; // 'multiply' can wash out on dark colors, so we use alpha
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 24;
    } else if (activeTool === 'brush') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.8;
      ctx.lineWidth = 12;
    } else { // pen
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = 3;
    }
    ctx.strokeStyle = activeColor;
    
    // Draw initial dot
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const draw = (e) => {
    if (!isDrawing || !ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (ctx) {
      ctx.closePath();
    }
    if (isDrawing) {
      window.dispatchEvent(new CustomEvent('addedStroke'));
    }
    setIsDrawing(false);
  };

  return (
    <div 
      style={{
        position: 'relative',
        width: '450px',
        height: '600px',
        backgroundImage: `url('/${selectedBackground}')`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'drop-shadow(0 15px 40px rgba(133, 115, 166, 0.25))', // adds nice shadow to the transparent PNG edges
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          cursor: activeTool === 'pen' ? 'crosshair' : activeTool === 'eraser' ? 'cell' : 'default',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 10,
          touchAction: 'none'
        }}
      />

      {/* Elements Layer */}
      {elements.map((el) => {
        if (el.type === 'text') {
          return (
            <Rnd
              key={el.id}
              default={{ x: el.x, y: el.y, width: 200, height: 60 }}
              bounds="parent"
              style={{ zIndex: 20 }}
            >
              <div style={{ 
                width: '100%', height: '100%', cursor: 'grab', 
                padding: '8px', border: '2px dashed rgba(84, 5, 8, 0.3)', 
                backgroundColor: 'transparent',
                borderRadius: '8px',
                display: 'flex'
              }}>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newElements = elements.map(elem => 
                      elem.id === el.id ? { ...elem, content: e.target.innerText } : elem
                    );
                    setElements(newElements);
                  }}
                  style={{
                    width: '100%', height: '100%', background: 'transparent',
                    border: 'none', fontSize: '18px', outline: 'none',
                    fontFamily: '"Indie Flower", cursive', color: '#222',
                    cursor: 'text',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  {el.content}
                </div>
                <style>{`
                  div[contenteditable]::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
              </div>
            </Rnd>
          );
        }

        if (el.type === 'image') {
          return (
            <Rnd
              key={el.id}
              default={{ x: el.x, y: el.y, width: 150, height: 150 }}
              bounds="parent"
              style={{ zIndex: 20 }}
            >
              <div style={{ width: '100%', height: '100%', cursor: 'grab', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <img src={el.content} alt="Upload" style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
              </div>
            </Rnd>
          );
        }

        return (
          <Rnd
            key={el.id}
            default={{
              x: el.x,
              y: el.y,
              width: 60,
              height: 60,
            }}
            minWidth={30}
            minHeight={30}
            bounds="parent"
            style={{ zIndex: 20 }}
          >
            <div style={{
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 'max(30px, 50%)', 
              filter: 'drop-shadow(2px 5px 8px rgba(0,0,0,0.2)) drop-shadow(0px 1px 2px rgba(255,255,255,0.5))',
              userSelect: 'none',
              cursor: 'grab'
            }}>
              {el.content}
            </div>
          </Rnd>
        );
      })}
    </div>
  );
}
