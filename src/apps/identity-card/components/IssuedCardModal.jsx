import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { Download, Bookmark, Edit3, PlusCircle, CheckCircle, Share2, Sparkles } from 'lucide-react';
import CardRenderer from './CardRenderer';

export default function IssuedCardModal({
  cardData,
  templateId,
  onEdit,
  onCreateNew,
  onSaveToGallery
}) {
  const cardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const stageRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Responsive window and stage container tracking
  const [windowWidth, setWindowWidth] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (stageRef.current) {
        setContainerWidth(stageRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getIssuedScale = () => {
    const isCanva1200 = templateId === 2 || templateId === 3;
    const effWidth = containerWidth > 0 ? containerWidth : (windowWidth <= 1024 ? windowWidth - 32 : 696);

    if (isCanva1200) {
      const maxScale = 0.58;
      return Math.min(maxScale, Math.max(0.2, (effWidth - 16) / 1200));
    }
    const isVertical = templateId === 1 || templateId === 6;
    if (!isVertical && effWidth < 360) {
      return Math.min(1, Math.max(0.5, (effWidth - 24) / 340));
    }
    if (isVertical && effWidth < 250) {
      return Math.min(1, Math.max(0.5, (effWidth - 24) / 230));
    }
    return undefined;
  };

  // Trigger celebration confetti on issuance
  useEffect(() => {
    const end = Date.now() + 1.2 * 1000;
    const colors = ['#C6F0E4', '#A7E8D7', '#64165D', '#8A176E', '#FFFFFF'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  // Download card as high-res PNG
  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const isCanva1200 = templateId === 2 || templateId === 3;
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: isCanva1200 ? 1 : 3, // At 1200x750, 1x produces crisp native 1200x750
        quality: 1,
        style: isCanva1200 ? {
          transform: 'none',
          transformOrigin: 'top left'
        } : undefined,
        width: isCanva1200 ? 1200 : undefined,
        height: isCanva1200 ? 750 : undefined
      });
      const link = document.createElement('a');
      const safeName = (cardData.name || 'identity-card')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      link.download = `${safeName}-collectible-id.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSave = () => {
    onSaveToGallery({
      ...cardData,
      templateId,
      issuedAt: new Date().toISOString()
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="issued-stage-container">
      <div className="issued-header-banner">
        <div className="sparkle-badge">
          <Sparkles size={16} /> OFFICIAL NOVELTY ISSUE
        </div>
        <h2>Your Identity Card Has Been Issued!</h2>
        <p>Congratulations! Your fictional collectible identity card is now verified and ready to download.</p>
      </div>

      {/* ANIMATED CARD REVEAL */}
      <div className="issued-card-stage" ref={stageRef}>
        <div className="card-reveal-box">
          <CardRenderer
            ref={cardRef}
            templateId={templateId}
            scale={getIssuedScale()}
            data={cardData}
          />
        </div>
      </div>

      {/* ACTION CONTROLS */}
      <div className="issued-actions-panel">
        <button
          type="button"
          className="action-btn download-btn"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          <Download size={18} />
          {isDownloading ? "Generating PNG..." : "Download as Image (PNG)"}
        </button>

        <button
          type="button"
          className={`action-btn save-btn ${isSaved ? 'saved' : ''}`}
          onClick={handleSave}
        >
          {isSaved ? (
            <>
              <CheckCircle size={18} /> Saved to Collection!
            </>
          ) : (
            <>
              <Bookmark size={18} /> Save Card
            </>
          )}
        </button>

        <button
          type="button"
          className="action-btn edit-btn"
          onClick={onEdit}
        >
          <Edit3 size={18} /> Edit Card Details
        </button>

        <button
          type="button"
          className="action-btn new-btn"
          onClick={onCreateNew}
        >
          <PlusCircle size={18} /> Create New Card
        </button>
      </div>
    </div>
  );
}
