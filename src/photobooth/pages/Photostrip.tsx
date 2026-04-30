import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Photostrip.css';

function Photostrip() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null]); // state variable and function to update state
  const clickedIndexRef = useRef<number | null>(null);
  const [showingResult, setShowingResult] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] | null = event.target.files ? Array.from(event.target.files) : null;
    if (!files || files.length === 0 || clickedIndexRef.current === null) return;

    const file = files[0];
    const imageURLs: string = URL.createObjectURL(file);

    const updated = [...photos]
    updated[clickedIndexRef.current] = imageURLs;
      
    setPhotos(updated);
  }

  const handleClick = (index: number) => {
    clickedIndexRef.current = index;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const navigate = useNavigate();

  const handlePrint = () => {
    if (photos.every((p) => p !== null)) {
      navigate("/photobooth/custom", { state: { photos } });
    }
  };

  return (
    <div className="photostrip-container">
      <div className="text-holder">Upload Your Photos</div>
  
      <div className="photos-holders">
        {photos.map((url, index) => (
          <div key={index} className='photo-box' onClick={() => handleClick(index)}>
            {url ? <img src={url} alt={`uploaded-${index}`} className="photos" /> : index + 1}
          </div>
        ))}
      </div>
  
      <input type="file" ref={fileInputRef} accept="image/*" multiple style={{ display: 'none' }} onChange={handleFileChange} />
      <button className="upload-button" onClick={handlePrint}>
        Print with {photos.filter(photo => photo !== null).length} photos
      </button>
    </div>
  );
}

export default Photostrip;



