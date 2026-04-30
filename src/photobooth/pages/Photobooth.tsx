import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Photobooth.css";
import "./styles.css"

const Photobooth: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // three slots for the strip
  const [photos, setPhotos] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam: ", err);
      }
    };

    startCamera();

    // cleanup: stop tracks on unmount
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (photos.every((p) => p !== null)) {
      navigate("/photobooth/custom", { state: { photos } });
    }
  }, [photos, navigate]);

  const startCaptureSequence = async () => {
    if (isCapturing) return;
    setIsCapturing(true);

    for (let i = 0; i < 3; i++) {
      await runCountdown();
      await takePhotoAtIndex(i);
      await delay(1000);
    }

    setIsCapturing(false);
    // Navigation happens via the useEffect above
  };

  const runCountdown = (): Promise<void> =>
    new Promise((resolve) => {
      let i = 3;
      setCountdown(i);
      const interval = setInterval(() => {
        i--;
        if (i > 0) {
          setCountdown(i);
        } else {
          clearInterval(interval);
          setCountdown(null);
          resolve();
        }
      }, 1000);
    });

  const takePhotoAtIndex = async (index: number) => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.translate(canvas.width, 0); // mirror horizontally
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    const dataUrl = canvas.toDataURL("image/png");
    setPhotos((prev) => {
      const next = [...prev];
      next[index] = dataUrl;
      return next;
    });
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));


  return (
    <div className="photobooth-wrapper">
      <div className="photo-strip">
        {photos.map((photo, idx) => (
          <div key={idx} className="photo-placeholder">
            {photo ? (
              <img
                src={photo}
                alt={`Captured ${idx}`}
                className="photo-preview"
              />
            ) : (
              <div className="photo-placeholder-empty" />
            )}
          </div>
        ))}
      </div>

      <div className="camera-area">
        <div style={{ fontFamily: "title font", fontSize: "60px", marginBottom: "1px" }}>Capturing Photos</div>
        <div className="camera-wrapper">
          {countdown !== null && (
            <div className="countdown-overlay">{countdown}</div>
          )}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera"
          />
        </div>

        <button
          className="capture-button"
          onClick={startCaptureSequence}
          disabled={isCapturing}
        >
          {isCapturing ? "Capturing…" : "Start"}
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden-canvas" />
    </div>
  );
};

export default Photobooth;



