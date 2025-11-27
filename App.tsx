import React, { useState, useRef } from 'react';
import { AppState, AnalysisResponse } from './types';
import { analyzeImage } from './services/geminiService';
import { CameraView } from './components/CameraView';
import { ReceiptDisplay } from './components/ReceiptDisplay';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async (img: string) => {
    setImageSrc(img);
    setAppState(AppState.ANALYZING);
    await processImage(img);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const img = event.target?.result as string;
        setImageSrc(img);
        setAppState(AppState.ANALYZING);
        await processImage(img);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (img: string) => {
    try {
      const data = await analyzeImage(img);
      setAnalysisData(data);
      setAppState(AppState.RESULT);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  };

  const resetApp = () => {
    setAppState(AppState.IDLE);
    setImageSrc(null);
    setAnalysisData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono relative overflow-hidden flex flex-col">
      {/* Background Grid Effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10" 
        style={{
          backgroundImage: 'linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      ></div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10 w-full max-w-lg mx-auto">
        
        {appState === AppState.IDLE && (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <div className="inline-block px-3 py-1 border border-green-800 rounded-full text-xs text-green-700 bg-green-900/10 mb-4">
                SYSTEM READY
              </div>
              <h1 className="text-4xl font-bold tracking-tighter text-white glitch-effect">
                CYBER<span className="text-green-500">SCAN</span>
              </h1>
              <p className="text-zinc-500 text-sm max-w-xs mx-auto leading-relaxed">
                Optical recognition module initialized. Upload image or activate sensor array.
              </p>
            </div>

            <div className="grid gap-4 w-full">
              <button
                onClick={() => setAppState(AppState.CAMERA)}
                className="group relative w-full h-16 bg-green-600 hover:bg-green-500 text-black font-bold uppercase tracking-widest transition-all clip-path-polygon flex items-center justify-center gap-3 overflow-hidden"
                style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Activate Camera</span>
              </button>

              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload"
                  className="w-full h-16 bg-zinc-900 border border-zinc-800 hover:border-green-500/50 hover:bg-zinc-800 text-zinc-400 hover:text-green-400 font-mono uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-3"
                  style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <span>Upload File</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center text-center space-y-6 animate-pulse">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-t-4 border-green-500 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-r-4 border-green-700 rounded-full animate-spin-reverse"></div>
              <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-green-500">
                AI_PROC
              </div>
            </div>
            <div className="font-mono text-green-500 text-sm tracking-widest">
              ANALYZING VISUAL DATA...
            </div>
          </div>
        )}

        {appState === AppState.ERROR && (
          <div className="border border-red-500/50 bg-red-900/10 p-8 rounded-lg text-center max-w-sm">
            <h2 className="text-red-500 font-bold text-xl mb-2">SYSTEM ERROR</h2>
            <p className="text-red-400/80 mb-6 text-sm">Failed to connect to neural network. Please check your signal and try again.</p>
            <button 
              onClick={resetApp}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-black font-bold rounded uppercase text-sm tracking-widest"
            >
              Reboot System
            </button>
          </div>
        )}

        {appState === AppState.RESULT && (
          <ReceiptDisplay 
            data={analysisData} 
            imageSrc={imageSrc} 
            onReset={resetApp} 
          />
        )}
      </main>
      
      {/* Full screen camera overlay */}
      {appState === AppState.CAMERA && (
        <CameraView onCapture={handleCapture} onCancel={resetApp} />
      )}

      {/* Footer Status Bar */}
      {appState !== AppState.CAMERA && (
        <footer className="w-full border-t border-zinc-900 bg-black/50 p-2 text-[10px] text-zinc-600 flex justify-between uppercase font-mono tracking-wider z-10">
          <span>NET: ONLINE</span>
          <span>LAT: {Math.random().toFixed(4)}</span>
          <span>SECURE_CONN</span>
        </footer>
      )}
    </div>
  );
}