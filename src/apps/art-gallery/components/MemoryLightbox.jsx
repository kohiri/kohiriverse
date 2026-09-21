import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

export default function MemoryLightbox({ memory, initialMediaIndex = 0, onClose, onDeleteMedia }) {
  const [currentIndex, setCurrentIndex] = useState(initialMediaIndex);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!memory || !memory.media || memory.media.length === 0) return null;

  const totalMedia = memory.media.length;
  const safeIndex = Math.min(currentIndex, totalMedia - 1);
  const currentMedia = memory.media[safeIndex] || memory.media[0];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (confirmDelete) {
          setConfirmDelete(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' && totalMedia > 1 && !confirmDelete) {
        setCurrentIndex((prev) => (prev + 1) % totalMedia);
      } else if (e.key === 'ArrowLeft' && totalMedia > 1 && !confirmDelete) {
        setCurrentIndex((prev) => (prev - 1 + totalMedia) % totalMedia);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalMedia, onClose, confirmDelete]);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDeleteMedia) {
      onDeleteMedia(memory.id, safeIndex);
      if (totalMedia <= 1) {
        onClose();
      } else {
        setConfirmDelete(false);
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      }
    }
  };

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      {/* Top action bar: Delete button & Close button */}
      <div className="lightbox-top-actions" onClick={(e) => e.stopPropagation()}>
        <button 
          className="lightbox-action-btn lightbox-delete-btn"
          onClick={() => setConfirmDelete(true)}
          title="Delete this picture"
          aria-label="Delete picture"
        >
          <Trash2 size={18} />
        </button>
        <button 
          className="lightbox-close-btn" 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Confirmation Banner */}
      {confirmDelete && (
        <div className="lightbox-confirm-banner" onClick={(e) => e.stopPropagation()}>
          <span>Delete this picture {totalMedia > 1 ? `(${safeIndex + 1} of ${totalMedia})` : ''}?</span>
          <div className="confirm-buttons">
            <button className="confirm-btn-delete" onClick={handleDelete}>
              Delete
            </button>
            <button className="confirm-btn-cancel" onClick={() => setConfirmDelete(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {/* Previous button if multi media */}
        {totalMedia > 1 && (
          <button 
            className="lightbox-nav-btn prev"
            onClick={() => {
              setConfirmDelete(false);
              setCurrentIndex((prev) => (prev - 1 + totalMedia) % totalMedia);
            }}
            aria-label="Previous media"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="lightbox-media-wrap">
          {currentMedia.type === 'video' ? (
            <video
              src={currentMedia.url}
              controls
              autoPlay
              playsInline
              style={{ maxHeight: '72vh', width: 'auto', display: 'block' }}
            />
          ) : (
            <img 
              src={currentMedia.url} 
              alt={currentMedia.caption || "Memory detail"} 
            />
          )}
        </div>

        {/* Next button if multi media */}
        {totalMedia > 1 && (
          <button 
            className="lightbox-nav-btn next"
            onClick={() => {
              setConfirmDelete(false);
              setCurrentIndex((prev) => (prev + 1) % totalMedia);
            }}
            aria-label="Next media"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Information text & reflection */}
        <div className="lightbox-info">
          <div className="lightbox-date">
            {memory.displayDate}
            {totalMedia > 1 && ` · ${safeIndex + 1} of ${totalMedia}`}
          </div>
          <p className="lightbox-reflection">{memory.text}</p>
        </div>
      </div>
    </div>
  );
}
