import React, { useEffect, useState, useRef, useCallback } from 'react';
import './SpookyGame.css';

const INITIAL_SCENE = 'intro';

// Load a scene JSON from the bundled data folder
async function loadScene(id) {
  try {
    const module = await import(`./data/scenes/${id}.json`);
    return module.default;
  } catch (err) {
    console.error(`Error loading scene: ${id}`, err);
    throw new Error(`Scene ${id} not found`);
  }
}

export default function SpookyGame({ onBack }) {
  const [sceneId, setSceneId] = useState(INITIAL_SCENE);
  const [scene, setScene] = useState(null);
  const [focusedIdx, setFocusedIdx] = useState(0);
  const [state, setState] = useState({ flags: { caution: 0 } });
  const [hasStarted, setHasStarted] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [shadowState, setShadowState] = useState({ isVisible: false, side: 'left', top: 50 });
  const audioRef = useRef(null);
  const whisperRef = useRef(null);
  const wrapperRef = useRef(null);
  const bugControllerRef = useRef(null);
  const spiderControllerRef = useRef(null);

  // Split text into sentences
  const sentences = scene?.text ? scene.text.match(/[^.!?]+[.!?]*\s*/g) || [scene.text] : [];

  const handleNextSentence = useCallback(() => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
    } else {
      setShowChoices(true);
    }
  }, [currentSentenceIndex, sentences.length]);

  // Reset on scene change
  useEffect(() => {
    setCurrentSentenceIndex(0);
    setShowChoices(false);
  }, [sceneId]);

  // Creepy Shadow Timer
  useEffect(() => {
    const interval = setInterval(() => {
      const side = Math.random() > 0.5 ? 'left' : 'right';
      const top = Math.floor(Math.random() * 50) + 15;
      setShadowState({ isVisible: true, side, top });
      if (whisperRef.current) {
        whisperRef.current.volume = 0.15;
        whisperRef.current.play().catch(e => console.log('Whisper play failed', e));
      }
      setTimeout(() => {
        setShadowState(prev => ({ ...prev, isVisible: false }));
      }, 4000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Load scene JSON
  const fetchScene = useCallback(async (id) => {
    try {
      if (id === 'ending-check') {
        const isCautious = state.flags.caution >= 3;
        id = isCautious ? 'ending-good' : 'ending-bad';
      }
      const data = await loadScene(id);
      setScene(data);
      setFocusedIdx(0);
      setFadeKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to load scene', error);
    }
  }, [state.flags.caution]);

  useEffect(() => {
    if (hasStarted) {
      fetchScene(sceneId);
    }
  }, [sceneId, fetchScene, hasStarted]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (!scene || !hasStarted) return;
      if (!showChoices) {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextSentence();
        }
        return;
      }
      if (!scene.choices) return;
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIdx((i) => (i - 1 + scene.choices.length) % scene.choices.length);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIdx((i) => (i + 1) % scene.choices.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleChoice(scene.choices[focusedIdx]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [scene, focusedIdx, hasStarted, showChoices, handleNextSentence]);

  const handleChoice = (choice) => {
    let updatedFlags = { ...state.flags };
    if (choice.effects) {
      for (const [key, val] of Object.entries(choice.effects)) {
        updatedFlags[key] = (updatedFlags[key] || 0) + val;
      }
    }
    const newState = { ...state, flags: updatedFlags };
    setState(newState);
    localStorage.setItem('spookyGameState', JSON.stringify(newState));
    localStorage.setItem('spookyGameScene', choice.next);
    setSceneId(choice.next);
  };

  const handleRestart = () => {
    localStorage.removeItem('spookyGameState');
    localStorage.removeItem('spookyGameScene');
    setState({ flags: { caution: 0 } });
    setSceneId(INITIAL_SCENE);
  };

  const handleStart = () => {
    setHasStarted(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.6;
      audioRef.current.play().catch(e => console.warn('Audio play failed:', e));
    }
    const savedState = localStorage.getItem('spookyGameState');
    const savedScene = localStorage.getItem('spookyGameScene');
    if (savedState && savedScene) {
      setState(JSON.parse(savedState));
      setSceneId(savedScene);
    } else {
      fetchScene(INITIAL_SCENE);
    }
  };

  // Load Bug library
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/bug/bug.js';
    script.async = true;
    script.onload = () => {
      if (window.BugController && window.SpiderController && wrapperRef.current) {
        bugControllerRef.current = new window.BugController({
          minBugs: 15, maxBugs: 25, mouseOver: 'fly', container: wrapperRef.current
        });
        spiderControllerRef.current = new window.SpiderController({
          minBugs: 2, maxBugs: 5, container: wrapperRef.current
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      if (bugControllerRef.current) bugControllerRef.current.end();
      if (spiderControllerRef.current) spiderControllerRef.current.end();
      if (script.parentNode) script.parentNode.removeChild(script);
      // Stop audio on unmount
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    };
  }, []);

  return (
    <div className="spooky-tv-wrapper" ref={wrapperRef}>
      <audio ref={audioRef} src="/paranomalsound.mp3" loop preload="auto" />
      <audio ref={whisperRef} src="/whisper.mp3" preload="auto" />

      {/* Back to Galaxy Button */}
      {onBack && (
        <button className="spooky-back-btn" onClick={() => {
          if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
          onBack();
        }}>
          ← Galaxy
        </button>
      )}

      {/* Creepy Shadow Figure */}
      {shadowState.isVisible && (
        <div
          className={`spooky-creepy-shadow ${shadowState.side}`}
          style={{ top: `${shadowState.top}%` }}
        >
          <svg width="100%" height="100%" viewBox="0 0 200 600" preserveAspectRatio="none">
            <path d="M120 50 C 80 50, 65 110, 65 150 C 65 190, 80 220, 100 230 C 95 235, 90 245, 95 250 C 105 255, 115 250, 120 240 C 150 240, 175 200, 175 150 C 175 100, 160 50, 120 50 Z" fill="black" />
            <circle cx="105" cy="130" r="1.5" fill="#200" />
            <circle cx="145" cy="130" r="1.5" fill="#200" />
            <g fill="black">
              <rect x="50" y="280" width="40" height="6" rx="3" transform="rotate(-15 50 280)" />
              <rect x="45" y="305" width="48" height="7" rx="3" transform="rotate(-5 45 305)" />
              <rect x="48" y="335" width="45" height="6" rx="3" transform="rotate(10 48 335)" />
            </g>
            <path d="M50 250 C 20 280, 0 400, 0 600 L 200 600 C 200 400, 180 280, 150 250 Z" fill="black" />
          </svg>
        </div>
      )}

      <div className="spooky-tv-container">
        <div className="spooky-tv-screen">
          {!hasStarted ? (
            <div className="spooky-start-screen">
              <h1 style={{ fontSize: 'clamp(1rem, 2.5vw, 2rem)', letterSpacing: '4px', textTransform: 'uppercase' }}>
                Input Source Missing
              </h1>
              <p style={{ margin: '1rem 0', color: '#555', fontFamily: 'monospace', fontSize: 'clamp(0.6rem, 1vw, 0.85rem)' }}>
                Press Power to connect to signal...
              </p>
              <button className="spooky-restart-btn" onClick={handleStart}>Power</button>
            </div>
          ) : !scene ? (
            <div className="spooky-start-screen">
              <h1 style={{ fontSize: '1rem', letterSpacing: '4px', textTransform: 'uppercase' }}>Loading Signal...</h1>
            </div>
          ) : (
            <>
              {scene.image && (
                <div
                  key={`img-${fadeKey}`}
                  className="spooky-scene-image-bg spooky-fade-in"
                  style={{ backgroundImage: `url(${scene.image})` }}
                />
              )}

              <div className="spooky-crt-effects" />
              <div className="spooky-glitch-layer" />
              <div className="spooky-glitch-bar" />

              <div
                key={`content-${fadeKey}`}
                className={`spooky-scene-content ${!showChoices ? 'spooky-clickable' : ''}`}
                onClick={!showChoices ? handleNextSentence : undefined}
              >
                {!showChoices && (
                  <div className="spooky-scene-text">
                    <span key={currentSentenceIndex} className="spooky-sentence-fade">
                      {sentences[currentSentenceIndex]}
                    </span>
                  </div>
                )}

                {showChoices && (
                  <div className="spooky-choices-container spooky-fade-in">
                    <p className={scene.ending ? 'spooky-end-title' : 'spooky-choice-prompt'}>
                      {scene.ending ? 'THE END' : 'WHAT IS YOUR NEXT MOVE?'}
                    </p>

                    {scene.choices && !scene.ending && (
                      <ul className="spooky-choices-list">
                        {scene.choices.map((c, idx) => (
                          <li
                            key={c.id}
                            className={`spooky-choice-item ${idx === focusedIdx ? 'spooky-focused' : ''}`}
                            onMouseEnter={() => setFocusedIdx(idx)}
                            onClick={() => handleChoice(c)}
                          >
                            {c.label}
                          </li>
                        ))}
                      </ul>
                    )}

                    {scene.ending && (
                      <button className="spooky-restart-btn" style={{ marginTop: '2rem' }} onClick={handleRestart}>
                        Reset Signal
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* TV rim PNG overlay */}
        <img className="spooky-tv-rim-overlay" src="/tv rim.png" alt="" draggable={false} />
      </div>
    </div>
  );
}
