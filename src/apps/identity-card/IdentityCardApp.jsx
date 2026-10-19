import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Upload, 
  Crop, 
  RefreshCw, 
  Dices, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Camera,
  Layers
} from 'lucide-react';

import TemplateSelector from './components/TemplateSelector';
import CardRenderer from './components/CardRenderer';
import PhotoCropperModal from './components/PhotoCropperModal';
import SignaturePad from './components/SignaturePad';
import IssuedCardModal from './components/IssuedCardModal';
import './styles/identity-card.css';

// Random fictional ID number generator
function generateFictionalId(templateId) {
  const patterns = [
    () => "69 69 69 69 69",
    () => {
      const p = () => Math.floor(10 + Math.random() * 90);
      return `${p()} ${p()} ${p()} ${p()} ${p()}`;
    },
    () => {
      const num = Math.floor(100000 + Math.random() * 900000);
      return `BND-${num}`;
    },
    () => {
      const p1 = Math.floor(100 + Math.random() * 900);
      const p2 = Math.floor(1000 + Math.random() * 9000);
      return `GLX-${p1}-${p2}`;
    }
  ];
  const chosenPattern = patterns[Math.floor(Math.random() * patterns.length)];
  return chosenPattern();
}

export default function IdentityCardApp({ onBack }) {
  const navigate = useNavigate();

  // Navigation: 'SELECT_TEMPLATE' | 'CUSTOMIZE' | 'ISSUED'
  const [currentStep, setCurrentStep] = useState('SELECT_TEMPLATE');
  const [selectedTemplateId, setSelectedTemplateId] = useState(2);

  // Form State
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [contact, setContact] = useState('');
  const [idNumber, setIdNumber] = useState('69 69 69 69 69');
  const [photo, setPhoto] = useState(null); // cropped base64 or url
  const [signature, setSignature] = useState(null); // image object or text

  // Cropper Modal state
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImageForCrop, setRawImageForCrop] = useState(null);


  // File input ref
  const fileInputRef = useRef(null);

  const liveStageRef = useRef(null);
  const [liveStageWidth, setLiveStageWidth] = useState(0);

  // Responsive window tracking
  const [windowWidth, setWindowWidth] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (liveStageRef.current) {
        setLiveStageWidth(liveStageRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getLivePreviewScale = (tmplId) => {
    const isCanva1200 = tmplId === 2 || tmplId === 3;
    const effWidth = liveStageWidth > 0 ? liveStageWidth : (windowWidth <= 1024 ? windowWidth - 48 : 380);

    if (isCanva1200) {
      const maxScale = 0.31;
      return Math.min(maxScale, Math.max(0.18, (effWidth - 16) / 1200));
    }

    const isVertical = tmplId === 1 || tmplId === 6;
    if (!isVertical && effWidth < 360) {
      return Math.min(1, Math.max(0.5, (effWidth - 24) / 340));
    }
    if (isVertical && effWidth < 250) {
      return Math.min(1, Math.max(0.5, (effWidth - 24) / 230));
    }
    return undefined;
  };

  // Auto-generate fresh ID when template is chosen
  const handleSelectTemplate = (id) => {
    setSelectedTemplateId(id);
    if (!idNumber || idNumber === '69 69 69 69 69') {
      setIdNumber(generateFictionalId(id));
    }
  };

  const handleConfirmTemplate = (id) => {
    setSelectedTemplateId(id);
    setCurrentStep('CUSTOMIZE');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Image upload handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setRawImageForCrop(reader.result);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
    // Reset file input value so re-selecting same file triggers change
    e.target.value = null;
  };

  const handleCropConfirm = (croppedBase64) => {
    setPhoto(croppedBase64);
    setCropperOpen(false);
  };

  const handleRandomizeId = () => {
    setIdNumber(generateFictionalId(selectedTemplateId));
  };

  const handleIssueCard = (e) => {
    e.preventDefault();
    setCurrentStep('ISSUED');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleResetForNewCard = () => {
    setName('');
    setDob('');
    setContact('');
    setIdNumber(generateFictionalId(selectedTemplateId));
    setPhoto(null);
    setSignature(null);
    setCurrentStep('SELECT_TEMPLATE');
  };

  const handleBackToGalaxy = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  // Determine target aspect ratio for cropper based on vertical vs horizontal templates
  const isVerticalTemplate = selectedTemplateId === 1 || selectedTemplateId === 6;
  const cropperAspect = selectedTemplateId === 2 
    ? (244 / 367) 
    : selectedTemplateId === 3
      ? (257 / 312)
      : (isVerticalTemplate ? 0.9 : 0.82);

  const currentCardData = {
    name,
    dob,
    contact,
    idNumber,
    photo,
    signature
  };

  return (
    <div className="studio-app-root">
      {/* TOP STUDIO NAVIGATION */}
      <header className="studio-navbar">
        <div className="navbar-brand">
          <button
            type="button"
            className="btn-back-galaxy"
            onClick={handleBackToGalaxy}
            title="Return to 3D Galaxy"
          >
            <ArrowLeft size={16} />
            <span>Galaxy</span>
          </button>
          <span className="brand-dot"></span>
          <h1>Identity Card Studio</h1>
          <span className="brand-sub">Album 13 • Collectible Cards</span>
        </div>


      </header>

      {/* WORKFLOW STEPPER INDICATOR */}
      <div className="stepper-bar-container">
        <div className="stepper-track">
          <div
            className={`step-bubble ${currentStep === 'SELECT_TEMPLATE' ? 'active' : 'completed'}`}
            onClick={() => setCurrentStep('SELECT_TEMPLATE')}
          >
            1. Select Template
          </div>
          <div className="stepper-line"></div>
          <div
            className={`step-bubble ${currentStep === 'CUSTOMIZE' ? 'active' : currentStep === 'ISSUED' ? 'completed' : ''}`}
            onClick={() => {
              if (selectedTemplateId) setCurrentStep('CUSTOMIZE');
            }}
          >
            2. Personalize & Sign
          </div>
          <div className="stepper-line"></div>
          <div className={`step-bubble ${currentStep === 'ISSUED' ? 'active' : ''}`}>
            3. Issued ID Card
          </div>
        </div>
      </div>

      {/* MAIN VIEWPORT SWITCHER */}
      <main className="studio-main-body">
        {currentStep === 'SELECT_TEMPLATE' && (
          <TemplateSelector
            selectedId={selectedTemplateId}
            onSelect={handleSelectTemplate}
            onConfirm={handleConfirmTemplate}
          />
        )}

        {currentStep === 'CUSTOMIZE' && (
          <div className="customize-stage-layout">
            {/* LEFT COLUMN: CUSTOMIZATION FORM */}
            <div className="form-column">
              <div className="form-column-header">
                <button
                  type="button"
                  className="btn-back-link"
                  onClick={() => setCurrentStep('SELECT_TEMPLATE')}
                >
                  <ArrowLeft size={16} /> Change Design
                </button>
                <h2>Personalize Your Card</h2>
                <p>Fill out your details below. The card preview updates live on the right.</p>
              </div>

              <form onSubmit={handleIssueCard} className="customizer-form">
                {/* 1. PHOTO SECTION */}
                <div className="form-section-card">
                  <div className="sec-title">
                    <Camera size={18} />
                    <h3>1. Portrait Photograph</h3>
                  </div>

                  <div className="photo-upload-row">
                    <div className="current-photo-preview">
                      {photo ? (
                        <img src={photo} alt="Uploaded portrait" />
                      ) : (
                        <div className="no-photo-placeholder">No photo uploaded</div>
                      )}
                    </div>

                    <div className="photo-actions-wrap">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handlePhotoUpload}
                      />
                      <button
                        type="button"
                        className="btn-upload"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={16} /> Upload Photo
                      </button>

                      {photo && (
                        <button
                          type="button"
                          className="btn-re-crop"
                          onClick={() => {
                            setRawImageForCrop(photo);
                            setCropperOpen(true);
                          }}
                        >
                          <Crop size={14} /> Adjust Crop
                        </button>
                      )}
                      <span className="photo-tip-text">
                        Supports JPG, PNG, WEBP. Drag & zoom to fit.
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. IDENTITY DETAILS */}
                <div className="form-section-card">
                  <div className="sec-title">
                    <Layers size={18} />
                    <h3>2. Identity Details</h3>
                  </div>

                  <div className="form-field-group">
                    <label>FULL NAME</label>
                    <input
                      type="text"
                      placeholder="e.g. Aura Valentine"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={32}
                      className="form-input"
                    />
                  </div>

                  <div className="form-row-2col">
                    <div className="form-field-group">
                      <label>DATE OF BIRTH</label>
                      <input
                        type="text"
                        placeholder="e.g. 2004 / 08 / 14"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-field-group">
                      <label>CONTACT NUMBER</label>
                      <input
                        type="text"
                        placeholder="e.g. +1 800-GALAXY-99"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-field-group">
                    <div className="label-with-action">
                      <label>ID NUMBER (AUTO-GENERATED & EDITABLE)</label>
                      <button
                        type="button"
                        className="btn-random-dice"
                        onClick={handleRandomizeId}
                        title="Generate random fictional ID"
                      >
                        <Dices size={14} /> Randomize
                      </button>
                    </div>
                    <input
                      type="text"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      className="form-input mono"
                    />
                  </div>
                </div>

                {/* 3. SIGNATURE SECTION */}
                <div className="form-section-card">
                  <div className="sec-title">
                    <Sparkles size={18} />
                    <h3>3. Authorized Signature</h3>
                  </div>
                  <SignaturePad
                    initialSignature={signature}
                    onSaveSignature={(sig) => setSignature(sig)}
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <button type="submit" className="btn-issue-card">
                  <Sparkles size={20} /> ISSUE MY ID CARD
                </button>
              </form>
            </div>

            {/* RIGHT COLUMN: STICKY LIVE PREVIEW */}
            <div className="preview-column">
              <div className="preview-sticky-box">
                <div className="preview-header">
                  <span className="live-badge">● LIVE PREVIEW</span>
                  <span className="template-name-label">
                    Design #{selectedTemplateId}
                  </span>
                </div>

                <div className="card-live-stage" ref={liveStageRef}>
                  <CardRenderer
                    templateId={selectedTemplateId}
                    scale={getLivePreviewScale(selectedTemplateId)}
                    data={currentCardData}
                  />
                </div>

                <p className="preview-footer-note">
                  This card updates immediately as you type and customize.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'ISSUED' && (
          <IssuedCardModal
            cardData={currentCardData}
            templateId={selectedTemplateId}
            onEdit={() => setCurrentStep('CUSTOMIZE')}
            onCreateNew={handleResetForNewCard}
          />
        )}
      </main>

      {/* PHOTO CROPPER MODAL */}
      {cropperOpen && (
        <PhotoCropperModal
          rawImageSrc={rawImageForCrop || photo}
          targetAspect={cropperAspect}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropperOpen(false)}
        />
      )}
    </div>
  );
}
