import React, { useState, useRef } from 'react';
import { X, Upload, Plus, Film, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function AddMemoryModal({ onAddMemory, onClose }) {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [text, setText] = useState('');
  const [mediaList, setMediaList] = useState([]);
  const [customUrl, setCustomUrl] = useState('');
  const [customType, setCustomType] = useState('image');
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const isVideo = file.type.startsWith('video');
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const url = loadEvent.target.result;
        if (isVideo) {
          const tempVideo = document.createElement('video');
          tempVideo.onloadedmetadata = () => {
            const ratio = tempVideo.videoWidth / (tempVideo.videoHeight || 1);
            let computedRatio = '16/9';
            if (ratio < 0.85) computedRatio = '3/4';
            else if (ratio >= 0.85 && ratio <= 1.15) computedRatio = '1/1';
            else if (ratio < 1.4) computedRatio = '4/3';
            setMediaList((prev) => [
              ...prev,
              {
                id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                type: 'video',
                url,
                aspectRatio: computedRatio,
                caption: file.name
              }
            ]);
          };
          tempVideo.src = url;
        } else {
          const tempImg = new Image();
          tempImg.onload = () => {
            const ratio = tempImg.naturalWidth / (tempImg.naturalHeight || 1);
            let computedRatio = '4/3';
            if (ratio < 0.75) computedRatio = '2/3';
            else if (ratio < 0.9) computedRatio = '3/4';
            else if (ratio >= 0.9 && ratio <= 1.15) computedRatio = '1/1';
            else if (ratio > 1.4) computedRatio = '16/9';
            setMediaList((prev) => [
              ...prev,
              {
                id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                type: 'image',
                url,
                aspectRatio: computedRatio,
                caption: file.name
              }
            ]);
          };
          tempImg.src = url;
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    setMediaList((prev) => [
      ...prev,
      {
        id: `media-${Date.now()}`,
        type: customType,
        url: customUrl.trim(),
        aspectRatio: customType === 'video' ? '16/9' : '4/3',
        caption: 'Online memory fragment'
      }
    ]);
    setCustomUrl('');
  };

  const removeMedia = (index) => {
    setMediaList((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleMediaAspect = (index) => {
    setMediaList((prev) => prev.map((item, i) => {
      if (i !== index) return item;
      const sequence = item.type === 'video' ? ['16/9', '4/3', '1/1', '3/4'] : ['4/3', '3/4', '1/1', '2/3', '16/9'];
      const nextIdx = (sequence.indexOf(item.aspectRatio) + 1) % sequence.length;
      return { ...item, aspectRatio: sequence[nextIdx] };
    }));
  };

  const handleAddSample = (type) => {
    if (type === 'image') {
      const sampleImages = [
        { url: '/media/rainy_street.jpg', caption: 'Rain on glass', aspectRatio: '16/9' },
        { url: '/media/cafe_night.jpg', caption: 'Night cafe corner', aspectRatio: '3/4' },
        { url: '/media/tall_cafe_window.jpg', caption: 'Evening chime', aspectRatio: '2/3' }
      ];
      const random = sampleImages[Math.floor(Math.random() * sampleImages.length)];
      setMediaList((prev) => [
        ...prev,
        {
          id: `sample-${Date.now()}`,
          type: 'image',
          url: random.url,
          aspectRatio: random.aspectRatio,
          caption: random.caption
        }
      ]);
    } else {
      setMediaList((prev) => [
        ...prev,
        {
          id: `sample-vid-${Date.now()}`,
          type: 'video',
          url: '/media/night_ambience.mp4',
          aspectRatio: '16/9',
          caption: 'Night ambiance clip'
        }
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) {
      alert('Please select a date.');
      return;
    }
    if (mediaList.length === 0) {
      alert('Please add at least one image or video.');
      return;
    }
    if (!text.trim()) {
      alert('Please write a short reflection.');
      return;
    }

    onAddMemory({
      date,
      text: text.trim(),
      media: mediaList
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Record a Human Memory</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Date Selector */}
          <div className="form-group">
            <label className="form-label">Date of Memory</label>
            <input 
              type="date" 
              className="form-input" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required
            />
          </div>

          {/* Media Upload */}
          <div className="form-group">
            <label className="form-label">Photos or Videos (Horizontal, Vertical, or Square)</label>
            <div 
              className="media-upload-zone"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={24} style={{ color: 'rgba(255, 255, 255, 0.5)', marginBottom: '8px' }} />
              <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#fff' }}>Click to upload media files</p>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>
                Supports JPG, PNG, WEBP, MP4, WebM (auto-detects orientation)
              </span>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                multiple 
                accept="image/*,video/*"
                style={{ display: 'none' }}
              />
            </div>

            {/* Custom URL Option */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <select 
                value={customType} 
                onChange={(e) => setCustomType(e.target.value)}
                className="form-input"
                style={{ width: '90px', fontSize: '12px', padding: '6px' }}
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
              <input 
                type="url" 
                className="form-input" 
                placeholder="Or paste media URL..." 
                value={customUrl} 
                onChange={(e) => setCustomUrl(e.target.value)}
                style={{ fontSize: '12px', padding: '6px 10px' }}
              />
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handleAddUrl}
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >
                Add
              </button>
            </div>

            {/* Quick Sample Presets */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Quick presets:</span>
              <button 
                type="button" 
                className="btn-secondary"
                style={{ padding: '3px 8px', fontSize: '11px' }}
                onClick={() => handleAddSample('image')}
              >
                + Preset Photo
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                style={{ padding: '3px 8px', fontSize: '11px' }}
                onClick={() => handleAddSample('video')}
              >
                + Preset Video
              </button>
            </div>

            {/* Thumbnails preview with orientation badges */}
            {mediaList.length > 0 && (
              <div className="media-preview-list">
                {mediaList.map((item, index) => (
                  <div key={item.id || index} className="media-thumb-wrap">
                    {item.type === 'video' ? (
                      <video src={item.url} muted />
                    ) : (
                      <img src={item.url} alt="thumbnail" />
                    )}
                    <button 
                      type="button" 
                      className="thumb-ratio-tag"
                      onClick={() => toggleMediaAspect(index)}
                      title="Click to cycle orientation"
                    >
                      {item.aspectRatio}
                    </button>
                    <button 
                      type="button" 
                      className="remove-thumb-btn"
                      onClick={() => removeMedia(index)}
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Written Reflection */}
          <div className="form-group">
            <label className="form-label">Written Reflection</label>
            <textarea 
              className="form-textarea" 
              placeholder="e.g. somewhere, love is growing quietly..."
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              required
            />
            {text && (
              <div className="handwritten-preview">
                {text}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Memory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
