import React from 'react';
import { AnalysisResponse } from '../types';

interface ReceiptDisplayProps {
  data: AnalysisResponse | null;
  imageSrc: string | null;
  onReset: () => void;
}

export const ReceiptDisplay: React.FC<ReceiptDisplayProps> = ({ data, imageSrc, onReset }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 animate-in fade-in zoom-in duration-300">
      
      {/* Receipt Container */}
      <div className="relative bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(34,197,94,0.1)]">
        
        {/* Top Glow Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-green-900 via-green-500 to-green-900 opacity-50"></div>

        <div className="p-6 flex flex-col gap-6">
          
          {/* Header Section */}
          <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
            <div className="flex flex-col">
              <svg className="w-10 h-10 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <h2 className="text-green-500 font-bold text-lg tracking-wider">CYBER_SCAN</h2>
              <span className="text-zinc-500 text-xs">v2.5.0-FLASH</span>
            </div>
            <div className="text-right">
              <div className="text-zinc-400 text-xs mb-1">DATA_OUT</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`w-2 h-2 rounded-sm ${i > 1 ? 'bg-green-500' : 'bg-green-900'}`}></div>
                ))}
              </div>
            </div>
          </div>

          {/* Image Preview (Small thumb) */}
          {imageSrc && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-zinc-800 grayscale hover:grayscale-0 transition-all duration-500 group">
              <img src={imageSrc} alt="Scanned" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-green-500/10 mix-blend-overlay group-hover:bg-transparent transition-all"></div>
              <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 text-[10px] text-green-400 border border-green-900">
                SRC_IMG
              </div>
            </div>
          )}

          {/* The List (Bullet points) */}
          <div className="flex flex-col gap-3 font-mono text-sm">
            <div className="flex items-center justify-between text-zinc-500 text-xs uppercase tracking-widest border-b border-dashed border-zinc-800 pb-2">
              <span>Item Description</span>
              <span>Status</span>
            </div>

            <ul className="space-y-3">
              {data?.items.map((item, idx) => (
                <li key={idx} className="flex justify-between items-baseline group cursor-default">
                  <div className="flex items-start gap-2 max-w-[75%]">
                    <span className="text-green-800 group-hover:text-green-500 transition-colors mt-[2px]">{'>'}</span>
                    <span className="text-zinc-300 group-hover:text-green-400 transition-colors leading-relaxed">
                      {item.split('$')[0].split('€')[0]} {/* Try to keep text clean if price is separate, though regex does heavy lifting mostly */}
                    </span>
                  </div>
                  {/* Attempt to find price or just show OK */}
                  <span className="text-green-600 font-bold shrink-0">
                   {item.match(/[$€£]\s?\d+([.,]\d{1,2})?/) ? item.match(/[$€]\s?\d+([.,]\d{1,2})?/)?.[0] : (item.match(/\d+([.,]\d{1,2})?/) ? item.match(/\d+([.,]\d{1,2})?/)?.[0] : 'OK')}
                  </span>
                </li>
              ))}
              
              {(!data || data.items.length === 0) && (
                <li className="text-zinc-600 italic text-center py-4">No data detected via optical scan.</li>
              )}
            </ul>
          </div>

          {/* Footer / Total-ish look */}
          <div className="border-t-2 border-zinc-800 pt-4 mt-2">
             <div className="flex justify-between items-center text-green-500">
                <span className="text-xs uppercase tracking-widest animate-pulse">Scan Complete</span>
                <span className="font-bold text-xl">{data?.items.length || 0} ITEMS</span>
             </div>
             <div className="mt-4 pt-4 border-t border-dashed border-zinc-800 text-center">
               <button 
                  onClick={onReset}
                  className="w-full py-3 bg-zinc-900 hover:bg-green-900/20 text-green-500 border border-green-900 hover:border-green-500 rounded transition-all duration-300 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  New Scan
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};