import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Custom.css";
import html2canvas from "html2canvas";
import { PhotoData } from "./Photostrip";

export const bgOptions = [
  { name: "Black", style: { background: "#000" } },
  { name: "Pink", style: { background: "#f5cac3" } },
  { name: "Green", style: { background: "#717744" } },
  { name: "Beige", style: { background: "#d5bdaf" } },
  { name: "Red", style: { background: "#90323d" } },
];

const filterOptions = [
  { name: "None", style: "none", backgroundColor: "#e0e0e0" },
  { name: "B&W", style: "grayscale(100%)", backgroundColor: "linear-gradient(to right, black 50%, white 50%)"   },
    { name: "Vivid", style: "contrast(120%) saturate(150%)", backgroundColor: "#dbb42c" },
];

const Custom: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<PhotoData[]>(state?.photos ?? []);
  const comboRef = useRef<HTMLDivElement>(null);

  const [bgStyle, setBgStyle] = useState(bgOptions[0].style);
  const [filterStyle, setFilterStyle] = useState("none");
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const updatePhotoAdjustment = (key: 'scale' | 'offset', value: any, idx?: number) => {
    const targetIdx = idx !== undefined ? idx : selectedIndex;
    if (targetIdx === null) return;
    const newPhotos = [...photos];
    if (key === 'offset') {
      newPhotos[targetIdx] = { 
        ...newPhotos[targetIdx], 
        offset: { ...newPhotos[targetIdx].offset, ...value } 
      };
    } else {
      newPhotos[targetIdx] = { ...newPhotos[targetIdx], [key]: value };
    }
    setPhotos(newPhotos);
  };

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, idx: number) => {
    setSelectedIndex(idx);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || selectedIndex === null) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    const currentOffset = photos[selectedIndex]?.offset || { x: 0, y: 0 };
    updatePhotoAdjustment('offset', { 
      x: currentOffset.x + dx, 
      y: currentOffset.y + dy 
    }, selectedIndex);
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent, idx: number) => {
    const currentScale = photos[idx]?.scale || 1;
    const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1; 
    let newScale = currentScale + zoomDelta;
    if (newScale < 0.5) newScale = 0.5;
    if (newScale > 5) newScale = 5;
    
    setSelectedIndex(idx);
    updatePhotoAdjustment('scale', newScale, idx);
  };


  const getFormattedDate = (): string => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const year = now.getFullYear();
    return `${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  const timestamp = getFormattedDate();

  const handlePrint = async () => {
    if (!comboRef.current) return;
    const el = comboRef.current;

    await Promise.all(
    Array.from(el.querySelectorAll("img")).map((img: HTMLImageElement) =>
      img.complete
        ? Promise.resolve()
        : new Promise((res) => { img.onload = img.onerror = () => res(null); })
    )
  );


    const {width, height} = el.getBoundingClientRect();
    try {
      const canvas = await html2canvas(el, {
        backgroundColor: null,
        scale: (window.devicePixelRatio || 1) * 3,
        width,
        height,
      });
      const dataUrl = canvas.toDataURL("image/png");

      canvas.toBlob((blob) => {
    if (!blob) return console.error("No blob produced");
    const file = new File([blob], `photostrip-${Date.now()}.png`, {
      type: "image/png",
    });

    // navigate, passing the File
    navigate("/photobooth/result", {
      state: { photostripFile: file, timestamp },
    });
  }, "image/png");
    } catch (err) {
      console.error("Failed to generate photostrip image", err);
    }
  };

  return (
    <div className="customize-wrapper">
      {/* Left side */}
      <div className="customize-left">
        <div className="text">Decorate ♥</div>

        <div className="bg-section">
          <label className="bg-label">Background</label>
          <div className="bg-picker-thumbnails">
            {bgOptions.map((opt) => {
              const isActive = bgStyle === opt.style;
              return (
                <div
                  key={opt.name}
                  className={`bg-thumb ${isActive ? "active" : ""}`}
                  style={opt.style}
                  onClick={() => setBgStyle(opt.style)}
                >
                  {isActive && <span className="checkmark">✓</span>}
                </div>
              );
            })}
          </div>
        </div>


        <div className="filter-section">
          <label className="bg-label">Filter</label>
          <div className="bg-picker-thumbnails">
            {filterOptions.map((opt) => {
              const isActive = filterStyle === opt.style;
              const isBW = opt.name === "Black & White";
              return (
                <div
                  key={opt.name}
                  className={`bg-thumb ${isActive ? "active" : ""} ${isBW ? "bw-thumb" : ""}`}
                  style={{
                    background: opt.backgroundColor,
                  }}
                  onClick={() => setFilterStyle(opt.style)}
                >
                    {isActive && <span className="checkmark">✓</span>}
                </div>
              );
            })}
          </div>



        </div>
            
        <div className="toggle-section">
          <label className="bg-label">Timestamp</label>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showTimestamp}
              onChange={() => setShowTimestamp(!showTimestamp)}
          />
          <span className="toggle-slider" />
          </label>
        </div>

        <div className="caption-section">
          <label className="bg-label">Caption</label>
          <input
            type="text"
            value={caption}
            onChange={e => setCaption(e.target.value)}
            maxLength={22}
            placeholder="Write something here..."
            className="caption-input"
          />
        </div>

        <button className="reset-btn" style={{marginTop: "20px"}} onClick={() => {
          if (selectedIndex !== null) {
            const newPhotos = [...photos];
            newPhotos[selectedIndex] = { ...newPhotos[selectedIndex], scale: 1, offset: { x: 0, y: 0 } };
            setPhotos(newPhotos);
          }
        }}>Reset Selected Photo</button>

          <button className="print-button" onClick={() => navigate("/photobooth/result", { state: { photos, bgStyle, timestamp, showTimestamp, caption } })}> Print </button>

      </div>


      {/* Right Side */}
      <div className="customize-right">
        <div ref={comboRef} className="photostrip" style={bgStyle}>
          {photos.map((photo, idx) =>
            photo ? (
              <div 
                key={idx} 
                className={`result-photo-container ${selectedIndex === idx ? 'selected' : ''}`}
                onMouseDown={(e) => handleMouseDown(e, idx)}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                onWheel={(e) => handleWheel(e, idx)}
              >
                <img
                  src={photo.url}
                  className="result-photo"
                  alt={`Captured ${idx}`}
                  style={{ 
                    filter: filterStyle,
                    transform: `scale(${photo.scale}) translate(${photo.offset.x}px, ${photo.offset.y}px)`,
                    pointerEvents: 'none' /* ensure drag events go to container */
                  }}
                />
              </div>
            ) : (
              <div key={idx} className="result-photo placeholder">
                Empty
              </div>
            )
          )}
        {(caption || showTimestamp) && (
          <div className="footer-section">
            {caption && <div className="caption-display">{caption}</div>}
            {showTimestamp && <div className="timestamp">{timestamp}</div>}
          </div>
        )}

        </div>
      </div>
    </div>
  );
};

export default Custom;



