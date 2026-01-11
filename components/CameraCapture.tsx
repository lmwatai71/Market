import React, { useRef, useState, useEffect } from 'react';
import { X, RefreshCw, Grid3X3 } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [showGrid, setShowGrid] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        const constraints = {
          video: { 
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
            aspectRatio: { ideal: 1 } // Square-ish is often good for listings, but flexible is better
          },
          audio: false
        };

        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(currentStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
        setError('');
      } catch (err) {
        console.error("Camera init error:", err);
        setError('Could not access camera. Please check your browser permissions.');
      }
    };

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const handleCapture = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Mirror if using front camera so it looks natural
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      
      ctx.drawImage(videoRef.current, 0, 0);
      // High quality jpeg
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      onCapture(dataUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <button 
          onClick={onClose}
          className="p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition"
        >
          <X size={24} />
        </button>
        <span className="text-white font-medium drop-shadow-md">Take Photo</span>
        
        {/* Settings: Grid Toggle */}
        <button 
          onClick={() => setShowGrid(!showGrid)}
          className={`p-2 rounded-full transition ${showGrid ? 'bg-kai text-white' : 'bg-black/30 text-white/80 backdrop-blur-md'}`}
          title="Toggle Grid"
        >
          <Grid3X3 size={20} />
        </button>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-white text-center p-6 max-w-xs">
            <p className="mb-4 text-alaea font-medium">{error}</p>
            <button onClick={onClose} className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
              Close Camera
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />
            
            {/* Grid Overlay */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-50">
                <div className="border-r border-b border-white/50"></div>
                <div className="border-r border-b border-white/50"></div>
                <div className="border-b border-white/50"></div>
                <div className="border-r border-b border-white/50"></div>
                <div className="border-r border-b border-white/50"></div>
                <div className="border-b border-white/50"></div>
                <div className="border-r border-white/50"></div>
                <div className="border-r border-white/50"></div>
                <div></div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="h-32 bg-black flex items-center justify-around px-8 pb-4 pt-2">
        {/* Settings: Switch Camera */}
        <button 
          onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
          className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition active:scale-95"
          title="Switch Camera"
        >
          <RefreshCw size={24} />
        </button>

        {/* Capture Button */}
        <button 
          onClick={handleCapture}
          className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 shadow-lg active:scale-90 transition flex items-center justify-center"
        >
          <div className="w-14 h-14 rounded-full border-2 border-black/10" />
        </button>

        {/* Spacer for layout balance */}
        <div className="w-12"></div> 
      </div>
    </div>
  );
};

export default CameraCapture;