import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to?: string | -1;
  className?: string;
  style?: React.CSSProperties;
}

const BackButton: React.FC<BackButtonProps> = ({ to = -1, className = '', style }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (typeof to === 'number') {
      navigate(to);
    } else {
      navigate(to);
    }
  };

  return (
    <button 
      onClick={handleBack} 
      className={`back-button ${className}`}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 100,
        ...style
      }}
      aria-label="Go Back"
    >
      <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="var(--color-pink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
  );
};

export default BackButton;
