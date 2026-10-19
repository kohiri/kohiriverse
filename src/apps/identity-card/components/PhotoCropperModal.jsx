import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Check, X, Move, Maximize2, Square } from 'lucide-react';

export default function PhotoCropperModal({ rawImageSrc, onConfirm, onCancel, targetAspect = 1 }) {
  // Zoom level: 1.0 represents "Fill / Cover" (fills the crop frame edge-to-edge)
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgNaturalSize, setImgNaturalSize] = useState(null);

  const imgRef = useRef(null);
  const viewportRef = useRef(null);
  const touchDistRef = useRef(null);

  // Responsive window tracking
  const [windowDimensions, setWindowDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  }));

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isShortScreen = windowDimensions.height <= 560;
  const isLandscapeMobile = windowDimensions.width > windowDimensions.height && windowDimensions.height <= 560;

  // Dynamically compute viewport size to strictly fit available screen height/width
  const computeViewportSize = () => {
    let maxW, maxH;
    if (isLandscapeMobile) {
      maxH = Math.min(220, Math.max(130, windowDimensions.height - 110));
      maxW = Math.min(280, Math.max(130, Math.floor(windowDimensions.width * 0.4)));
    } else if (isShortScreen) {
      maxH = Math.min(200, Math.max(130, windowDimensions.height - 180));
      maxW = Math.min(240, Math.max(140, windowDimensions.width - 64));
    } else {
      maxW = Math.min(260, Math.max(160, windowDimensions.width - 64));
      maxH = Math.min(320, Math.max(180, Math.floor(windowDimensions.height * 0.4)));
    }

    if (maxW / targetAspect <= maxH) {
      const w = Math.round(maxW);
      const h = Math.round(maxW / targetAspect);
      return { width: w, height: h };
    } else {
      const h = Math.round(maxH);
      const w = Math.round(maxH * targetAspect);
      return { width: w, height: h };
    }
  };

  const { width: viewportWidth, height: viewportHeight } = computeViewportSize();

  // Measure natural dimensions when image loads
  const handleImageLoad = (e) => {
    const nw = e.target.naturalWidth;
    const nh = e.target.naturalHeight;
    setImgNaturalSize({ width: nw, height: nh });
    setPosition({ x: 0, y: 0 });
    setZoom(1);
  };

  // Base scale calculations:
  // coverScale: scales the image so it cleanly fills the viewport without being ridiculously over-zoomed
  // containScale: scales the image so 100% of the image fits inside the box
  const coverScale = imgNaturalSize
    ? Math.max(viewportWidth / imgNaturalSize.width, viewportHeight / imgNaturalSize.height)
    : 1;

  const containScale = imgNaturalSize
    ? Math.min(viewportWidth / imgNaturalSize.width, viewportHeight / imgNaturalSize.height)
    : 1;

  const baseWidth = imgNaturalSize ? imgNaturalSize.width * coverScale : viewportWidth;
  const baseHeight = imgNaturalSize ? imgNaturalSize.height * coverScale : viewportHeight;

  // Zoom value needed to show the entire photo without any cropping
  const fitZoom = coverScale > 0 ? parseFloat((containScale / coverScale).toFixed(2)) : 0.8;

  // Non-passive mouse wheel zoom only on the viewport
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e) => {
      e.preventDefault();
      const zoomDelta = -e.deltaY * 0.0015;
      setZoom((prevZoom) => {
        const next = Math.min(3.5, Math.max(0.25, prevZoom + zoomDelta));
        return parseFloat(next.toFixed(2));
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Keyboard shortcut for escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch drag & pinch-to-zoom handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistRef.current = dist;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDragging) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    } else if (e.touches.length === 2 && touchDistRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchDistRef.current;
      touchDistRef.current = dist;
      setZoom((z) => Math.min(3.5, Math.max(0.25, parseFloat((z * factor).toFixed(2)))));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchDistRef.current = null;
  };

  // Presets
  const handleFitEntire = () => {
    setZoom(fitZoom);
    setPosition({ x: 0, y: 0 });
  };

  const handleFillFrame = () => {
    setZoom(1.0);
    setPosition({ x: 0, y: 0 });
  };

  const handleReset = () => {
    setZoom(1.0);
    setPosition({ x: 0, y: 0 });
  };

  // Perform high-res crop onto canvas
  const handleCropAndSave = () => {
    const img = imgRef.current;
    if (!img || !imgNaturalSize) return;

    // High resolution canvas for sharp rendering on 1200x750 card prints
    const outputWidth = 600;
    const outputHeight = Math.round(outputWidth / targetAspect);

    const canvas = document.createElement('canvas');
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const scaleFactor = outputWidth / viewportWidth;
    const displayedW = baseWidth * zoom;
    const displayedH = baseHeight * zoom;

    // Viewport-relative top-left coordinate
    const viewX = (viewportWidth / 2 + position.x) - (displayedW / 2);
    const viewY = (viewportHeight / 2 + position.y) - (displayedH / 2);

    // Canvas destination coordinates
    const destX = viewX * scaleFactor;
    const destY = viewY * scaleFactor;
    const destW = displayedW * scaleFactor;
    const destH = displayedH * scaleFactor;

    ctx.drawImage(img, destX, destY, destW, destH);

    const croppedDataUrl = canvas.toDataURL('image/png');
    onConfirm(croppedDataUrl);
  };

  return (
    <div
      className="cropper-overlay"
      onMouseUp={handleMouseUp}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className={`cropper-card ${isLandscapeMobile ? 'landscape-mode' : ''}`}>
        <div className="cropper-header">
          <h3>Adjust & Position Photo</h3>
          <button className="cropper-close-btn" onClick={onCancel} title="Close">
            <X size={20} />
          </button>
        </div>

        <p className="cropper-instruction">
          <Move size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          Drag photo to reposition • Pinch or slide to zoom
        </p>

        <div className="cropper-body-grid">
          {/* CROP VIEWPORT */}
          <div className="cropper-viewport-wrap">
            <div
              ref={viewportRef}
              className="cropper-viewport-container"
              style={{
                width: `${viewportWidth}px`,
                height: `${viewportHeight}px`,
                cursor: isDragging ? 'grabbing' : 'grab',
                touchAction: 'none'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="cropper-mask">
                <img
                  ref={imgRef}
                  src={rawImageSrc}
                  alt="Crop target"
                  onLoad={handleImageLoad}
                  draggable={false}
                  style={{
                    width: `${baseWidth}px`,
                    height: `${baseHeight}px`,
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                    transformOrigin: 'center center',
                    maxWidth: 'none',
                    maxHeight: 'none',
                    display: 'block',
                    pointerEvents: 'none'
                  }}
                />
              </div>

              {/* 3x3 Rule-of-Thirds Grid Guide */}
              <div className="cropper-grid-overlay">
                <div className="grid-line horizontal h1"></div>
                <div className="grid-line horizontal h2"></div>
                <div className="grid-line vertical v1"></div>
                <div className="grid-line vertical v2"></div>
              </div>
            </div>
          </div>

          {/* CONTROLS COLUMN */}
          <div className="cropper-controls-col">
            {/* QUICK PRESET CONTROLS */}
            <div className="cropper-presets-row">
              <button
                type="button"
                className="preset-pill-btn"
                onClick={handleFitEntire}
                title="Fit entire photo into frame"
              >
                <Maximize2 size={12} /> Fit Entire
              </button>

              <button
                type="button"
                className="preset-pill-btn"
                onClick={handleFillFrame}
                title="Fill frame edge-to-edge"
              >
                <Square size={12} /> Fill Frame
              </button>

              <button
                type="button"
                className="preset-pill-btn"
                onClick={handleReset}
                title="Reset position and zoom"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {/* ZOOM SLIDER & BUTTON CONTROLS */}
            <div className="cropper-controls">
              <button
                type="button"
                className="ctrl-btn"
                onClick={() => setZoom((z) => Math.max(0.25, parseFloat((z - 0.1).toFixed(2))))}
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>

              <input
                type="range"
                min="0.25"
                max="3.5"
                step="0.01"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="zoom-slider"
                aria-label="Zoom level"
              />

              <button
                type="button"
                className="ctrl-btn"
                onClick={() => setZoom((z) => Math.min(3.5, parseFloat((z + 0.1).toFixed(2))))}
                title="Zoom In"
                aria-label="Zoom In"
              >
                <ZoomIn size={16} />
              </button>

              <span className="zoom-val-badge">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="cropper-actions">
              <button type="button" className="btn-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={handleCropAndSave}>
                <Check size={18} style={{ marginRight: 6 }} /> Apply Crop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
