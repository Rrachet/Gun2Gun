import React, { useState } from 'react';
import { Smartphone, Maximize2, Minimize2 } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab?: string;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [isFramed, setIsFramed] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-2 md:p-6 bg-slate-950 text-slate-100">
      {/* Device Frame Control Bar */}
      <div className="w-full max-w-md md:max-w-xl mb-3 flex items-center justify-between px-3 py-2 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">Titan Tactics Mobile</span>
          <span className="hidden sm:inline text-slate-500">| EA Live Service Demo</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFramed(!isFramed)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Toggle Device Frame"
          >
            {isFramed ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            <span>{isFramed ? 'Full View' : 'Frame View'}</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div
        className={`transition-all duration-300 w-full ${
          isFramed
            ? 'max-w-[420px] h-[830px] max-h-[90vh] border-[10px] border-slate-800 rounded-[40px] shadow-2xl shadow-cyan-950/40 ring-1 ring-slate-700 overflow-hidden relative flex flex-col bg-slate-950'
            : 'max-w-5xl h-[830px] max-h-[90vh] rounded-2xl border border-slate-800 shadow-xl overflow-hidden relative flex flex-col bg-slate-950'
        }`}
      >
        {/* Mobile Device Status Bar Notch */}
        {isFramed && (
          <div className="w-full bg-slate-950 pt-2 pb-1 px-6 flex items-center justify-between text-[11px] text-slate-400 font-sans border-b border-slate-900 z-50">
            <span className="font-semibold text-slate-300">09:41</span>
            <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-slate-800 rounded-full" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-cyan-900/60 text-cyan-300 px-1 rounded">5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Game Canvas Container */}
        <div className="flex-1 flex flex-col overflow-hidden relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          {children}
        </div>
      </div>
    </div>
  );
};
