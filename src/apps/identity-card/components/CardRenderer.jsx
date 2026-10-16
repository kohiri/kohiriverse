import React, { forwardRef } from 'react';
import rihannaImg from '../assets/Ri ID.png';
import asapImg from '../assets/asap.png';
import saulImg from '../assets/saul.png';
import jaeImg from '../assets/jae.png';
import idBlackImg from '../assets/id-black.png';
import kanyeImg from '../assets/kanye.png';
import kanyeAvatarImg from '../assets/kanye-avatar.png';

// Default stylish fallback avatar
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

const CardRenderer = forwardRef(({
  templateId = 2,
  data = {},
  isExport = false,
  scale = null
}, ref) => {
  const defaultPhotoForTemplate = templateId === 1 
    ? asapImg 
    : (templateId === 2
        ? jaeImg
        : (templateId === 3
            ? kanyeAvatarImg
            : (templateId === 5 
                ? saulImg 
                : (templateId === 6 ? rihannaImg : DEFAULT_AVATAR))));
  const {
    name = "YOUR NAME",
    dob = "YYYY / MM / DD",
    contact = "+1 555-0199",
    idNumber = "69 69 69 69 69",
    photo,
    signature = null // can be { type: 'image', value: dataUrl } or string
  } = data;

  const currentPhoto = photo || defaultPhotoForTemplate;

  const renderSignature = () => {
    const is1200x750 = templateId === 2 || templateId === 3;
    const isCelestial = templateId === 3;

    if (!signature) {
      return (
        <span 
          style={{ 
            opacity: 0.35, 
            fontStyle: 'italic', 
            fontSize: is1200x750 ? '24px' : '0.9rem',
            color: isCelestial ? '#ff66c4' : (templateId === 2 ? '#ede4da' : undefined),
            fontFamily: isCelestial ? "'Amarante', serif" : undefined
          }}
        >
          {is1200x750 ? 'SIGNATURE' : 'Sign here...'}
        </span>
      );
    }
    if (typeof signature === 'object' && signature.value) {
      return (
        <img
          src={signature.value}
          alt="Signature"
          style={{ 
            maxHeight: is1200x750 ? '70px' : '34px', 
            maxWidth: is1200x750 ? '260px' : '140px', 
            width: '100%',
            height: '100%',
            objectFit: 'contain' 
          }}
        />
      );
    }
    return (
      <span 
        style={{ 
          fontSize: is1200x750 ? '34px' : undefined,
          color: isCelestial ? '#ff66c4' : (templateId === 2 ? '#ede4da' : undefined),
          fontFamily: isCelestial ? "'Amarante', cursive, serif" : "'Caveat', 'Alex Brush', cursive" 
        }}
      >
        {signature}
      </span>
    );
  };

  const renderScaled = (cardElement, nativeW, nativeH) => {
    if (scale && scale !== 1) {
      return (
        <div 
          className="id-card-viewport"
          style={{
            width: `${nativeW * scale}px`,
            height: `${nativeH * scale}px`,
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', flexShrink: 0 }}>
            {cardElement}
          </div>
        </div>
      );
    }
    return cardElement;
  };

  // ----------------------------------------------------
  // TEMPLATE 1: ARCADE GALAXY Y2K CYBER (Holographic Glass ID)
  // ----------------------------------------------------
  if (templateId === 1) {
    const cardContent = (
      <div ref={ref} className="id-card-base vertical card-y2k-cyber">
        {/* Holographic Iridescent Sheen & Grid Overlay */}
        <div className="y2k-holo-mesh"></div>
        <div className="y2k-grid-overlay"></div>
        <div className="y2k-gloss-glare"></div>

        {/* Top Header Section */}
        <div className="y2k-header">
          <div className="y2k-top-meta">
            <span className="y2k-sys-tag">SYS.ID // Y2K-GALAXY</span>
            <span className="y2k-cyber-dot">✦ ✦</span>
          </div>
          <div className="y2k-title-box">
            <h2 className="y2k-main-title">ARCADE GALAXY</h2>
            <div className="y2k-sub-title">IDENTITY CARD</div>
          </div>
        </div>

        {/* Main Body */}
        <div className="y2k-body">
          {/* Portrait Photo with Thin Holographic/Chrome Frame */}
          <div className="y2k-photo-frame">
            <div className="y2k-frame-glare"></div>
            <img src={currentPhoto} alt="Member Portrait" />
            <div className="y2k-corner-mark top-left"></div>
            <div className="y2k-corner-mark bottom-right"></div>
          </div>

          {/* Exact Information Structure */}
          <div className="y2k-fields-container">
            <div className="y2k-field-item">
              <span className="y2k-field-label">PLAYER:</span>
              <span className="y2k-field-val">{name || "YOUR NAME"}</span>
            </div>
            <div className="y2k-field-item">
              <span className="y2k-field-label">DOB:</span>
              <span className="y2k-field-val">{dob || "YYYY / MM / DD"}</span>
            </div>
            <div className="y2k-field-item">
              <span className="y2k-field-label">COMM:</span>
              <span className="y2k-field-val">{contact || "+1 555-0199"}</span>
            </div>
            <div className="y2k-field-item">
              <span className="y2k-field-label">CARD ID:</span>
              <span className="y2k-field-val mono">{idNumber || "35 85 81 53 81"}</span>
            </div>
          </div>

          {/* Signature Area */}
          <div className="y2k-sig-section">
            <div className="y2k-sig-label-row">
              <span className="y2k-sig-label">PLAYER SIGNATURE</span>
              <span className="y2k-auth-tag">VERIFIED</span>
            </div>
            <div className="y2k-sig-box">
              {renderSignature()}
            </div>
          </div>
        </div>

        {/* Small Decorative Tech Footer */}
        <div className="y2k-footer-bar">
          <span>SEC.01</span>
          <span>:: ACCESS GRANTED ::</span>
          <span>VER.2000</span>
        </div>
      </div>
    );
    return renderScaled(cardContent, 230, 350);
  }

  // ----------------------------------------------------
  // TEMPLATE 2: CANVA BLACK OBSIDIAN ID (1200 x 750 px Canvas)
  // ----------------------------------------------------
  if (templateId === 2) {
    const cardContent = (
      <div 
        ref={ref} 
        className="id-card card-black-edition"
        style={{
          width: '1200px',
          height: '750px',
          minWidth: '1200px',
          minHeight: '750px',
          maxWidth: '1200px',
          maxHeight: '750px',
          flexShrink: 0,
          transform: scale ? `scale(${scale})` : undefined,
          transformOrigin: 'top left'
        }}
      >
        {/* Canva Background Template Image */}
        <img
          src={idBlackImg}
          alt="ID Card Template"
          className="id-card-bg-template"
        />

        {/* Profile Photo */}
        <img
          src={currentPhoto}
          alt="Profile Portrait"
          className="id-field-photo"
        />

        {/* Name */}
        <div className="id-field-name">
          {name || "YOUR NAME"}
        </div>

        {/* Contact */}
        <div className="id-field-contact">
          {contact || "+1 555-0199"}
        </div>

        {/* Date of Birth (DOB) */}
        <div className="id-field-dob">
          {dob || "YYYY / MM / DD"}
        </div>

        {/* Code */}
        <div className="id-field-code">
          {idNumber || "69 69 69 69 69"}
        </div>

        {/* Signature */}
        <div className="id-field-signature">
          {renderSignature()}
        </div>
      </div>
    );

    if (scale) {
      return (
        <div 
          className="id-card-viewport"
          style={{
            width: `${1200 * scale}px`,
            height: `${750 * scale}px`,
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          {cardContent}
        </div>
      );
    }

    return cardContent;
  }

  // ----------------------------------------------------
  // TEMPLATE 3: CELESTIAL PRESS PASS (Canva Kanye Template • 1200 x 750 px Canvas)
  // ----------------------------------------------------
  if (templateId === 3) {
    const cardContent = (
      <div 
        ref={ref} 
        className="id-card card-celestial-edition"
        style={{
          width: '1200px',
          height: '750px',
          minWidth: '1200px',
          minHeight: '750px',
          maxWidth: '1200px',
          maxHeight: '750px',
          flexShrink: 0,
          transform: scale ? `scale(${scale})` : undefined,
          transformOrigin: 'top left'
        }}
      >
        {/* Background Template Image */}
        <img
          src={kanyeImg}
          alt="Celestial Press Pass Template"
          className="id-card-bg-template"
        />

        {/* Profile Photo - placed in the exact box where Kanye/triak image is */}
        <img
          src={currentPhoto}
          alt="Profile Portrait"
          className="id-field-photo"
          id="celestial-photo"
        />

        {/* Name */}
        <div className="id-field-name" id="celestial-name">
          {name || "AURA VALENTINE"}
        </div>

        {/* Contact */}
        <div className="id-field-contact" id="celestial-contact">
          {contact || "+1 555-0199"}
        </div>

        {/* Date of Birth (DOB) */}
        <div className="id-field-dob" id="celestial-dob">
          {dob || "YYYY / MM / DD"}
        </div>

        {/* Code / ID Number */}
        <div className="id-field-code" id="celestial-code">
          {idNumber || "69 69 69 69 69"}
        </div>

        {/* Signature */}
        <div className="id-field-signature" id="celestial-signature">
          {renderSignature()}
        </div>
      </div>
    );

    if (scale) {
      return (
        <div 
          className="id-card-viewport"
          style={{
            width: `${1200 * scale}px`,
            height: `${750 * scale}px`,
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          {cardContent}
        </div>
      );
    }

    return cardContent;
  }

  // ----------------------------------------------------
  // TEMPLATE 4: STARRY TICKET STUB (Notched Admission)
  // ----------------------------------------------------
  if (templateId === 4) {
    const cardContent = (
      <div ref={ref} className="id-card-base card-ticket-stub">
        <div className="notch-left"></div>
        <div className="notch-right"></div>
        <div className="ticket-top-bar">
          <span>STARRY TICKET IDENTITY CARD</span>
          <span>ADMIT ONE</span>
        </div>
        <div className="ticket-body">
          <div className="film-photo">
            <img src={currentPhoto} alt="Member Portrait" />
          </div>
          <div className="ticket-data">
            <div className="stub-line">
              <span>HOLDER:</span>
              <strong>{name || "YOUR NAME"}</strong>
            </div>
            <div className="stub-line">
              <span>DATE:</span>
              <strong>{dob || "YYYY / MM / DD"}</strong>
            </div>
            <div className="stub-line">
              <span>CONTACT:</span>
              <strong>{contact || "+1 555-0199"}</strong>
            </div>
            <div className="stub-line">
              <span>PASS ID:</span>
              <strong style={{ color: '#8A176E' }}>{idNumber || "69 69 69 69 69"}</strong>
            </div>
            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontSize: '0.55rem', color: '#64165D' }}>SIGNATURE</div>
              <div className="stub-sig">{renderSignature()}</div>
            </div>
          </div>
        </div>
      </div>
    );
    return renderScaled(cardContent, 340, 215);
  }

  // ----------------------------------------------------
  // TEMPLATE 5: CIPHER SOCIETY (Mystery Typewriter & Seal)
  // ----------------------------------------------------
  if (templateId === 5) {
    const cardContent = (
      <div ref={ref} className="id-card-base card-cipher">
        <div className="cipher-header">CIPHER SOCIETY IDENTITY CARD</div>
        <div className="cipher-grid">
          <div className="cipher-photo">
            <img src={currentPhoto} alt="Member Portrait" />
          </div>
          <div className="cipher-fields">
            <div>[MEMBER] : {name || "YOUR NAME"}</div>
            <div>[BORN]   : {dob || "YYYY / MM / DD"}</div>
            <div>[LINE]   : {contact || "+1 555-0199"}</div>
            <div>[CODE]   : {idNumber || "69 69 69 69 69"}</div>
            <div style={{ marginTop: '4px' }}>
              <div style={{ fontSize: '0.55rem' }}>[SIGNATURE]</div>
              <div>{renderSignature()}</div>
            </div>
          </div>
        </div>
        <div className="wax-seal">★</div>
      </div>
    );
    return renderScaled(cardContent, 340, 215);
  }

  // ----------------------------------------------------
  // TEMPLATE 6: ARCADE GALAXY PASS (Cyber Pixel Card)
  // ----------------------------------------------------
  if (templateId === 6) {
    const cardContent = (
      <div ref={ref} className="id-card-base vertical card-arcade">
        <div className="arcade-head">ARCADE GALAXY IDENTITY CARD</div>
        <div className="arcade-body">
          <div className="arcade-photo">
            <img src={currentPhoto} alt="Member Portrait" />
          </div>
          <div className="arcade-stats">
            <div className="stat-line">
              <span>PLAYER:</span>
              <span className="stat-val">{name || "YOUR NAME"}</span>
            </div>
            <div className="stat-line">
              <span>DOB:</span>
              <span className="stat-val">{dob || "YYYY / MM / DD"}</span>
            </div>
            <div className="stat-line">
              <span>COMM:</span>
              <span className="stat-val">{contact || "+1 555-0199"}</span>
            </div>
            <div className="stat-line">
              <span>CARD ID:</span>
              <span className="stat-val">{idNumber || "69 69 69 69 69"}</span>
            </div>
          </div>
          <div style={{ width: '100%', marginTop: '4px' }}>
            <span style={{ fontSize: '0.65rem', fontFamily: 'VT323', color: '#A7E8D7' }}>PLAYER SIGNATURE</span>
            <div className="arcade-sig">{renderSignature()}</div>
          </div>
        </div>
      </div>
    );
    return renderScaled(cardContent, 230, 350);
  }

  return null;
});

export default CardRenderer;
