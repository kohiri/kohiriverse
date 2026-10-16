import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import CardRenderer from './CardRenderer';
import rihannaImg from '../assets/Ri ID.png';
import asapImg from '../assets/asap.png';
import saulImg from '../assets/saul.png';
import jaeImg from '../assets/jae.png';
import kanyeAvatarImg from '../assets/kanye-avatar.png';

const TEMPLATES = [
  {
    id: 1,
    title: "Arcade Galaxy Y2K Cyber",
    subtitle: "Holographic Glass & Chrome UI",
    badge: "Y2K Cyber Glass",
    description: "Translucent holographic plastic with icy blue-lavender gradients, chrome borders, and futuristic cyber interface."
  },
  {
    id: 2,
    title: "Black Obsidian ID",
    subtitle: "Canva Template • 1200x750",
    badge: "Obsidian Noir",
    description: "Exclusive dark Canva design with precision coordinates, sand-cream typography, and verified credential overlay."
  },
  {
    id: 3,
    title: "Celestial Press Pass",
    subtitle: "Canva Template • 1200x750",
    badge: "Neon Celestial",
    description: "Atmospheric celestial press pass in vivid neon pink #ff66c4, Amarante typography, and verified pass credentials."
  },
  {
    id: 4,
    title: "Starry Ticket Stub",
    subtitle: "Retro Admission Notch & Film Frame",
    badge: "Cinema Ticket",
    description: "Perforated side notches, deep plum header banner, and cinema film strip portrait."
  },
  {
    id: 5,
    title: "Cipher Society Pass",
    subtitle: "Typewriter Brackets & Wax Seal",
    badge: "Mystery Club",
    description: "Aged parchment look, vintage bracketed data fields, and plum wax seal emblem."
  },
  {
    id: 6,
    title: "Arcade Galaxy Pass",
    subtitle: "Y2K Cyber Pixel & High-Score Stats",
    badge: "Arcade Pixel",
    description: "High-contrast pixel styling with neon mint grid, gamer stats, and arcade fonts."
  }
];

export default function TemplateSelector({ selectedId, onSelect, onConfirm }) {
  const [windowWidth, setWindowWidth] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getTemplateScale = (tmplId) => {
    const isCanva1200 = tmplId === 2 || tmplId === 3;
    if (isCanva1200) {
      if (windowWidth <= 360) return 0.22;
      if (windowWidth <= 420) return Math.min(0.26, (windowWidth - 76) / 1200);
      return 0.28;
    }
    const isVertical = tmplId === 1 || tmplId === 6;
    if (!isVertical && windowWidth <= 380) {
      return Math.min(1, (windowWidth - 80) / 340);
    }
    return undefined;
  };
  return (
    <div className="template-selector-stage">
      <div className="section-title-wrap">
        <span className="step-pill">STEP 1 OF 2</span>
        <h2>Choose Your ID Card Design</h2>
        <p>
          Select one of the 6 fictional collectible card templates below to customize with your personal photo, information, and signature.
        </p>
      </div>

      <div className="template-cards-grid">
        {TEMPLATES.map((tmpl) => {
          const isSelected = selectedId === tmpl.id;
          return (
            <div
              key={tmpl.id}
              className={`template-item-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect(tmpl.id)}
            >
              <div className="tmpl-item-header">
                <div>
                  <span className="tmpl-badge">{tmpl.badge}</span>
                  <h3 className="tmpl-title">{tmpl.title}</h3>
                </div>
                <div className={`radio-dot ${isSelected ? 'checked' : ''}`}>
                  {isSelected && <div className="dot-inner"></div>}
                </div>
              </div>

              {/* LIVE CARD PREVIEW MINI CONTAINER */}
              <div className="tmpl-preview-wrapper">
                <div className="tmpl-preview-scaler">
                  <CardRenderer
                    templateId={tmpl.id}
                    scale={getTemplateScale(tmpl.id)}
                    data={{
                      name: "AURA VALENTINE",
                      dob: "2004 / 08 / 14",
                      contact: "+1 800-GALAXY-99",
                      idNumber: "69 69 69 69 69",
                      photo: tmpl.id === 1 ? asapImg : (tmpl.id === 2 ? jaeImg : (tmpl.id === 3 ? kanyeAvatarImg : (tmpl.id === 5 ? saulImg : (tmpl.id === 6 ? rihannaImg : undefined)))),
                      signature: "Aura Valentine"
                    }}
                  />
                </div>
              </div>

              <p className="tmpl-desc">{tmpl.description}</p>

              <button
                type="button"
                className={`btn-select-tmpl ${isSelected ? 'selected-btn' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(tmpl.id);
                  onConfirm(tmpl.id);
                }}
              >
                {isSelected ? (
                  <>Customize This Card <ArrowRight size={16} /></>
                ) : (
                  <>Select Design</>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
