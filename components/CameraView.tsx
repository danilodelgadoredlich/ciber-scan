import React, { useEffect, useRef, useState, useCallback } from 'react';

interface CameraViewProps {
  onCapture: (imageSrc: string) => void;
  onCancel: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment', // Prefer back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }, 
        audio: false 
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera Error:", err);
      setError("Unable to access camera. Please allow permissions.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      // Cleanup stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageSrc = canvas.toDataURL("image/jpeg", 0.85);
      onCapture(imageSrc);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="relative flex-1 bg-zinc-900 overflow-hidden">
        {error ? (
          <div className="flex items-center justify-center h-full text-red-500 font-mono p-4 text-center">
            {error}
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        {/* Overlay UI for Camera */}
        <div className="absolute inset-0 pointer-events-none border-[1px] border-green-500/30 m-4 rounded-lg">
           <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-lg"></div>
           <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-lg"></div>
           <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-lg"></div>
           <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-lg"></div>
           
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12">
             <div className="w-full h-[1px] bg-green-500 absolute top-1/2"></div>
             <div className="h-full w-[1px] bg-green-500 absolute left-1/2"></div>
           </div>
           
           <div className="absolute bottom-8 left-0 w-full text-center text-green-500 font-mono text-xs animate-pulse">
             TARGET LOCKED
           </div>
        </div>
      </div>

      <div className="h-24 bg-black flex items-center justify-around px-6 pb-6 pt-2">
        <button 
          onClick={onCancel}
          className="text-zinc-400 font-mono text-sm hover:text-white"
        >
          CANCEL
        </button>
        
        <button 
          onClick={handleCapture}
          className="w-16 h-16 rounded-full border-4 border-white bg-transparent flex items-center justify-center hover:bg-white/20 transition-all active:scale-95"
        >
          <div className="w-12 h-12 bg-white rounded-full"></div>
        </button>
        
        <div className="w-10"></div> {/* Spacer for balance */}
      </div>
    </div>
  );
};