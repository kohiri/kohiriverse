import React from 'react';
import HumanExperienceGallery from './components/HumanExperienceGallery';
import './styles/human-experience.css';
import { useNavigate } from 'react-router-dom';

export default function ArtGalleryApp() {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black">
      <HumanExperienceGallery onBack={() => navigate('/')} />
    </div>
  );
}
