import React from 'react';
import { BarChart2, Zap } from 'lucide-react';

export const EmptyAnalyticsState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in-95 duration-700">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-[#75E2FF] blur-2xl opacity-20 animate-pulse" />
        <div className="relative w-24 h-24 bg-white border-2 border-black flex items-center justify-center shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          <BarChart2 className="w-10 h-10 text-black" />
        </div>
      </div>
      
      <h2 className="text-3xl font-black text-black uppercase tracking-tighter mb-4">
        Zero Engagement Detected
      </h2>
      <p className="text-slate-500 font-medium text-sm max-w-sm mx-auto leading-relaxed mb-8">
        No tracking events have been logged for this campaign yet. Once employees start interacting with the link, data will appear here in real-time.
      </p>

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest border border-black">
          <Zap className="w-3.5 h-3.5 text-[#75E2FF]" />
          Waiting for Transmission
        </div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Ensure the package is "Published" to begin tracking
        </p>
      </div>
    </div>
  );
};