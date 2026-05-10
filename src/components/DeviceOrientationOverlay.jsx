import { useState, useEffect } from 'react';

export default function DeviceOrientationOverlay() {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Check if it's a mobile/tablet sized device
      const isMobileDevice = window.innerWidth <= 1024 || /Mobi|Android|iPad|Tablet/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);

      // Check if it's in portrait orientation
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    // Initial check
    checkOrientation();

    // Listen for resize and orientation changes
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Only show the overlay if it's a mobile/tablet device AND in portrait mode
  if (!isMobile || !isPortrait) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-8 text-center"
      style={{ fontFamily: '"Outfit", sans-serif', height: '100dvh', width: '100dvw' }}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Animated Phone Icon */}
        <div className="relative w-16 h-24 border-2 border-white/60 rounded-xl animate-[spin_3s_ease-in-out_infinite]">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-white/60 rounded-full"></div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 border border-white/60 rounded-full"></div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <h1 className="text-white text-xl md:text-2xl font-extralight tracking-[0.4em] md:tracking-[0.5em] uppercase opacity-80 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
            Rotate Your Phone
          </h1>
          <p className="text-white/40 text-[10px] md:text-xs font-light tracking-[0.4em] uppercase">
            To Explore
          </p>

          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                  console.error(`Error attempting to enable full-screen mode: ${err.message}`);
                });
              }
            }}
            className="mt-4 px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-[10px] tracking-[0.2em] uppercase transition-all duration-300 backdrop-blur-xl active:scale-95"
          >
            Go Fullscreen
          </button>
        </div>
      </div>
    </div>
  );
}
