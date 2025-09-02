// src/components/MainFeed.jsx
import React, { useEffect, useState } from "react";

export default function MainFeed({
  activeFeed,
  imageURL,
  imageRef,
  videoRef,
  canvasRef,
  hiddenCanvasRef,
  detections,
  drawBoxes,
  detectFrameFromVideo,
  isDetecting,
  setDetections,
  setupWebcamStream,   
  onWebcamStreamStart,
  currentModel, // Add currentModel to props
}) {
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (activeFeed === "webcam" && videoRef.current) {
      console.log("🔹 Video element is mounted, calling setupWebcamStream");
      setupWebcamStream(); // now videoRef.current is NOT null
    }
  }, [activeFeed, videoRef, setupWebcamStream]);

  return (
    <div className="col-span-2 row-span-1 relative border-4 border-green-500 shadow-2xl rounded-2xl overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-black animate-fade-in">
      {/* --- IMAGE MODE --- */}
      {activeFeed === "image" && imageURL ? (
        <>
          <img
            src={imageURL}
            alt="Uploaded"
            ref={imageRef}
            onLoad={() =>
              detections.length > 0 &&
              drawBoxes({ canvasRef, imageRef, videoRef, activeFeed, detections })
            }
            className="w-full h-auto object-contain transition-all duration-700 ease-in-out scale-100 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
          />
          <canvas ref={canvasRef} className="absolute top-0 left-0 pointer-events-none animate-overlay-fade" />
        </>
      ) : /* --- VIDEO MODE --- */ activeFeed === "video" && imageURL ? (
        <>
          <video
            ref={videoRef}
            src={imageURL}
            className="w-full h-auto object-contain transition-all duration-700 ease-in-out scale-100 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
            onLoadedMetadata={(e) => {
              e.target.play();
              e.target.addEventListener("timeupdate", () => {
                detectFrameFromVideo({
                  imageRef,
                  videoRef,
                  activeFeed,
                  canvasRef,
                  isDetecting,
                  setDetections,
                  drawBoxes,
                  detections,
                  currentModel, // Add currentModel to props
                });
              });
            }}
            onEnded={() => (isDetecting.current = false)}
            playsInline
            autoPlay
          />
          <canvas ref={canvasRef} className="absolute top-0 left-0 pointer-events-none animate-overlay-fade" />
        </>
      ) : /* --- WEBCAM MODE --- */ activeFeed === "webcam" ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-auto object-contain transition-all duration-700 ease-in-out scale-100 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
            onPlay={() => {
              console.log("▶️ Webcam started playing");
              setIsStreaming(true);
              onWebcamStreamStart();
            }}
          />
          {/* Overlay canvas for boxes */}
          <canvas ref={canvasRef} className="absolute top-0 left-0 pointer-events-none animate-overlay-fade" />
          {/* Hidden canvas for capturing frames */}
          <canvas ref={hiddenCanvasRef} className="hidden" />
        </>
      ) : (
        <div className="w-full h-64 bg-black flex flex-col items-center justify-center animate-fade-in">
          <svg className="w-12 h-12 text-green-600 animate-bounce mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A2 2 0 0122 9.618V16a2 2 0 01-2 2H4a2 2 0 01-2-2V9.618a2 2 0 012.447-1.894L9 10m6 0V6a2 2 0 00-2-2H11a2 2 0 00-2 2v4m6 0l-6 0" />
          </svg>
          <span className="text-green-400 text-lg font-semibold animate-pulse">Upload an image or video</span>
        </div>
      )}
      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes overlay-fade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-overlay-fade {
          animation: overlay-fade 0.8s cubic-bezier(0.4,0,0.2,1) forwards;
        }
      `}</style>
    </div>
  );
}