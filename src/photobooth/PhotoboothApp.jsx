import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Photobooth from './pages/Photobooth';
import Photostrip from './pages/Photostrip';
import Result from './pages/Result';
import Custom from './pages/Custom';
import Gallery from './pages/Gallery';

const PhotoboothApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" replace />} />
      <Route path="home" element={<Home />} />
      <Route path="photobooth" element={<Photobooth />} />
      <Route path="photostrip" element={<Photostrip />} />
      <Route path="result" element={<Result />} />
      <Route path="custom" element={<Custom />} />
      <Route path="gallery" element={<Gallery />} />
    </Routes>
  );
};

export default PhotoboothApp;
