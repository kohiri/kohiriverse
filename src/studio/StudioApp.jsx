import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import './studio.css';
import Sequencer from './components/Sequencer';
import Controls from './components/Controls';
import Sidebar from './components/Sidebar';

const DEFAULT_BPM = 120;
const STEPS = 16;

const LIBRARY_INSTRUMENTS = [
  { id: 'kick',   name: 'KICK',   color: '#4deeea' },
  { id: 'snare',  name: 'SNARE',  color: '#ffe700' },
  { id: 'hihat',  name: 'HI-HAT', color: '#001eff' },
  { id: 'piano',  name: 'PIANO',  color: '#a78bfa' },
  { id: 'bass',   name: 'BASS',   color: '#34d399' },
  { id: 'conga',  name: 'CONGA',  color: '#ffe700' },
  { id: 'tabla',  name: 'TABLA',  color: '#9a009a' },
  { id: 'sitar',  name: 'SITAR',  color: '#f97316' },
  { id: 'dholak', name: 'DHOLAK', color: '#ec4899' },
];

function StudioApp() {
  const [activeTracks, setActiveTracks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const navigate = useNavigate();
  
  // Audio context & routing
  const audioCtxRef = useRef(null);
  const compressorRef = useRef(null);
  // Recording
  const mediaStreamDestRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  // Only used for uploaded audio files
  const uploadedBuffersRef = useRef({});

  // Initialize Audio Context with master compressor
  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    // Master dynamics compressor — keeps everything balanced and prevents clipping
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.setValueAtTime(-18, ctx.currentTime);
    comp.knee.setValueAtTime(10, ctx.currentTime);
    comp.ratio.setValueAtTime(6, ctx.currentTime);
    comp.attack.setValueAtTime(0.003, ctx.currentTime);
    comp.release.setValueAtTime(0.25, ctx.currentTime);
    comp.connect(ctx.destination);
    compressorRef.current = comp;

    // Set up destination for recording
    const streamDest = ctx.createMediaStreamDestination();
    mediaStreamDestRef.current = streamDest;
    comp.connect(streamDest);

    return () => {
      if (ctx.state !== 'closed') ctx.close();
    };
  }, []);

  const loadAudioFile = async (id, url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Fetch failed');
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioCtxRef.current.decodeAudioData(arrayBuffer);
      uploadedBuffersRef.current[id] = audioBuffer;
    } catch (e) {
      console.error(`Error loading audio for ${id}:`, e);
    }
  };

  // Helper to create a white-noise buffer source of given length (seconds)
  const makeNoise = (ctx, duration) => {
    const len = Math.floor(ctx.sampleRate * duration);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    return src;
  };

  // Real-time Web Audio node-graph synthesizer
  const playSound = (id) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const dest = compressorRef.current || ctx.destination;
    const now = ctx.currentTime;

    // --- Uploaded audio file ---
    if (uploadedBuffersRef.current[id]) {
      const src = ctx.createBufferSource();
      src.buffer = uploadedBuffersRef.current[id];
      src.connect(dest);
      src.start(now);
      return;
    }

    // --- Kick Drum ---
    if (id === 'kick') {
      const dur = 0.45;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      // Punch sub-bass: frequency sweeps from 150 Hz → 40 Hz
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.06);
      osc.frequency.exponentialRampToValueAtTime(30, now + dur);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(1, now + 0.005); // fast attack
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(gain); gain.connect(dest);
      osc.start(now); osc.stop(now + dur);

      // Click transient for punch
      const clickNoise = makeNoise(ctx, 0.02);
      const clickGain = ctx.createGain();
      const clickFilter = ctx.createBiquadFilter();
      clickFilter.type = 'bandpass';
      clickFilter.frequency.value = 3000;
      clickGain.gain.setValueAtTime(0.6, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      clickNoise.connect(clickFilter); clickFilter.connect(clickGain); clickGain.connect(dest);
      clickNoise.start(now); clickNoise.stop(now + 0.02);
    }

    // --- Snare ---
    else if (id === 'snare') {
      const dur = 0.22;
      // Body: tuned oscillator thump
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.06);
      oscGain.gain.setValueAtTime(0.7, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(oscGain); oscGain.connect(dest);
      osc.start(now); osc.stop(now + 0.12);

      // Snares: bandpass-filtered noise
      const noise = makeNoise(ctx, dur);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2500;
      filter.Q.value = 0.6;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.8, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      noise.connect(filter); filter.connect(noiseGain); noiseGain.connect(dest);
      noise.start(now); noise.stop(now + dur);
    }

    // --- Hi-Hat ---
    else if (id === 'hihat') {
      const dur = 0.09;
      const noise = makeNoise(ctx, dur);
      // High-pass filter to sound metallic, not hissy
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 7000;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 10000;
      bp.Q.value = 0.5;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      noise.connect(hp); hp.connect(bp); bp.connect(gain); gain.connect(dest);
      noise.start(now); noise.stop(now + dur);
    }

    // --- Piano ---
    else if (id === 'piano') {
      const dur = 1.5;
      const freq = 261.63; // middle C
      const harmonics = [
        { ratio: 1, amp: 0.6 },
        { ratio: 2, amp: 0.25 },
        { ratio: 3, amp: 0.12 },
        { ratio: 4, amp: 0.06 },
        { ratio: 5, amp: 0.03 },
      ];
      harmonics.forEach(({ ratio, amp }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq * ratio;
        // Piano-like: fast attack, medium decay, gentle release
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(amp, now + 0.005);
        gain.gain.setTargetAtTime(amp * 0.4, now + 0.05, 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
        osc.connect(gain); gain.connect(dest);
        osc.start(now); osc.stop(now + dur);
      });
    }

    // --- Bass ---
    else if (id === 'bass') {
      const dur = 0.7;
      const freq = 82.41; // E2
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      // Low-pass filter to smooth the harsh sawtooth
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(800, now);
      lp.frequency.exponentialRampToValueAtTime(200, now + dur);
      lp.Q.value = 1;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.8, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(lp); lp.connect(gain); gain.connect(dest);
      osc.start(now); osc.stop(now + dur);
    }

    // --- Conga ---
    else if (id === 'conga') {
      const dur = 0.35;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      // Pitch envelope: starts high, falls — gives the conga 'boing'
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(130, now + dur);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.9, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(gain); gain.connect(dest);
      osc.start(now); osc.stop(now + dur);
    }

    // --- Tabla ---
    else if (id === 'tabla') {
      const dur = 0.55;
      // Bayan (bass head): deep pitch drop
      const bayan = ctx.createOscillator();
      bayan.type = 'sine';
      bayan.frequency.setValueAtTime(200, now);
      bayan.frequency.exponentialRampToValueAtTime(80, now + 0.04);
      bayan.frequency.exponentialRampToValueAtTime(60, now + dur);
      const bayanGain = ctx.createGain();
      bayanGain.gain.setValueAtTime(0.001, now);
      bayanGain.gain.linearRampToValueAtTime(0.9, now + 0.005);
      bayanGain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      bayan.connect(bayanGain); bayanGain.connect(dest);
      bayan.start(now); bayan.stop(now + dur);

      // Dayan (treble): bell-like ring on top
      const dayan = ctx.createOscillator();
      dayan.type = 'sine';
      dayan.frequency.value = 750;
      const dayanGain = ctx.createGain();
      dayanGain.gain.setValueAtTime(0.001, now);
      dayanGain.gain.linearRampToValueAtTime(0.3, now + 0.005);
      dayanGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      dayan.connect(dayanGain); dayanGain.connect(dest);
      dayan.start(now); dayan.stop(now + 0.3);
    }

    // --- Sitar ---
    else if (id === 'sitar') {
      const dur = 1.2;
      const rootFreq = 196; // G3
      // Multiple detuned oscillators create the sitar's characteristic chorus/buzz
      [0, +4, -3].forEach((detuneCents, i) => {
        const osc = ctx.createOscillator();
        osc.type = i === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.value = rootFreq;
        osc.detune.value = detuneCents;
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 2000;
        const gain = ctx.createGain();
        const amp = i === 0 ? 0.5 : 0.15;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(amp, now + 0.01);
        gain.gain.setTargetAtTime(amp * 0.5, now + 0.05, 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
        osc.connect(lp); lp.connect(gain); gain.connect(dest);
        osc.start(now); osc.stop(now + dur);
      });
    }

    // --- Dholak ---
    else if (id === 'dholak') {
      const dur = 0.4;
      // Bass head
      const bass = ctx.createOscillator();
      bass.type = 'sine';
      bass.frequency.setValueAtTime(150, now);
      bass.frequency.exponentialRampToValueAtTime(80, now + 0.06);
      bass.frequency.exponentialRampToValueAtTime(60, now + dur);
      const bassGain = ctx.createGain();
      bassGain.gain.setValueAtTime(0.001, now);
      bassGain.gain.linearRampToValueAtTime(0.85, now + 0.005);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      bass.connect(bassGain); bassGain.connect(dest);
      bass.start(now); bass.stop(now + dur);

      // Treble slap
      const treble = ctx.createOscillator();
      treble.type = 'triangle';
      treble.frequency.setValueAtTime(450, now);
      treble.frequency.exponentialRampToValueAtTime(300, now + 0.04);
      const trebleGain = ctx.createGain();
      trebleGain.gain.setValueAtTime(0.001, now);
      trebleGain.gain.linearRampToValueAtTime(0.4, now + 0.005);
      trebleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      treble.connect(trebleGain); trebleGain.connect(dest);
      treble.start(now); treble.stop(now + 0.15);
    }
  };

  // Sequencer loop
  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      // Basic setInterval for MVP (Web Audio scheduling is better for production, but this works for demo)
      const interval = (60 / bpm) * 1000 / 4; // 16th notes
      intervalId = setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = (prev + 1) % STEPS;
          // Play sounds for the new step
          activeTracks.forEach(track => {
            if (track.steps[nextStep]) {
              playSound(track.id);
            }
          });
          return nextStep;
        });
      }, interval);
    } else {
      setCurrentStep(0); // reset on stop
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, bpm, activeTracks]);

  const toggleStep = (trackIndex, stepIndex) => {
    const newTracks = [...activeTracks];
    newTracks[trackIndex].steps[stepIndex] = !newTracks[trackIndex].steps[stepIndex];
    setActiveTracks(newTracks);
  };

  const handleUpload = async (file) => {
    const url = URL.createObjectURL(file);
    const customId = 'custom-' + Date.now();
    await loadAudioFile(customId, url);
    
    const newCustomTrack = {
      id: customId,
      name: file.name.substring(0, 6).toUpperCase(),
      color: '#fff',
      steps: Array(STEPS).fill(false)
    };
    setActiveTracks([...activeTracks, newCustomTrack]);
  };

  const handleAddTrack = (instrument) => {
    if (!activeTracks.find(t => t.id === instrument.id)) {
      setActiveTracks([...activeTracks, { ...instrument, steps: Array(STEPS).fill(false) }]);
    }
  };

  const handleRemoveTrack = (trackId) => {
    setActiveTracks(activeTracks.filter(t => t.id !== trackId));
  };

  const toggleRecording = () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      audioChunksRef.current = [];
      const stream = mediaStreamDestRef.current.stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'cyber-mix.webm';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const handleShare = () => {
    const trackNames = activeTracks.map(t => t.name).join(', ');
    const text = `Check out my Cyber Studio Mix: ${bpm} BPM with ${trackNames || 'no instruments yet'}!`;
    navigator.clipboard.writeText(text).then(() => {
      alert("Mix info copied to clipboard!");
    });
  };

  return (
    <div className="app-container studio-root" style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
      {/* Back Button Overlay */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 200 }}>
        <button 
          onClick={() => navigate('/')}
          className="neon-btn" 
          style={{ padding: '8px 16px', fontSize: '12px' }}
        >
          ← BACK TO GALAXY
        </button>
      </div>

      <div className="sidebar hud-panel" style={{ marginTop: '60px' }}>
        <Sidebar 
          library={LIBRARY_INSTRUMENTS} 
          activeTracks={activeTracks} 
          onAddTrack={handleAddTrack} 
          isRecording={isRecording}
          onToggleRecord={toggleRecording}
          onShare={handleShare}
        />
      </div>
      <div className="main-content" style={{ marginTop: '60px' }}>
        <div className="top-bar hud-panel">
          <div className="title-container glitch-hover" data-text="CYBER STUDIO">
            <h1>CYBER STUDIO</h1>
            <div className="subtitle">RETRO FUTURISTIC HUD</div>
          </div>
          <div className="status-indicators">
            <div className="status-box">
              <span className="label">SYS_STATUS</span>
              <span>ONLINE</span>
            </div>
            <div className="status-box">
              <span className="label">AUDIO_ENG</span>
              <span>{isPlaying ? 'ACTIVE' : 'STBY'}</span>
            </div>
            <div className="barcode"></div>
          </div>
        </div>
        
        <div className="hud-panel" style={{ padding: '0' }}>
          <Controls 
            isPlaying={isPlaying} 
            setIsPlaying={setIsPlaying} 
            bpm={bpm} 
            setBpm={setBpm} 
            onUpload={handleUpload}
          />
        </div>
        
        <div className="hud-panel" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sequencer 
            tracks={activeTracks} 
            currentStep={currentStep} 
            toggleStep={toggleStep} 
            onRemoveTrack={handleRemoveTrack}
            isPlaying={isPlaying}
          />
        </div>
      </div>
    </div>
  );

}

export default StudioApp;
