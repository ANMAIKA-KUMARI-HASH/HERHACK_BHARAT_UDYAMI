import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (onFinish) onFinish();
          }, 300);
          return 100;
        }
        return prev + 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-white px-6 py-12 select-none overflow-hidden animate-in fade-in duration-300">
      {/* Subtle Top Tricolor bar */}
      <div className="w-full flex h-1.5 absolute top-0 left-0">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* Top Tagline Pill */}
      <div className="mt-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF9933] text-xs font-bold tracking-wide">
        <Sparkles className="w-3.5 h-3.5" />
        <span>डिजिटल भारत • सशक्त उद्यमी</span>
      </div>

      {/* Center Logo & Branding */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-sm">
        {/* Emblem with subtle glow */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 text-slate-900 flex items-center justify-center shadow-md relative overflow-hidden ring-4 ring-orange-50">
            {/* Tricolor corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 bg-[#FF9933]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#16A34A]" />
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#EA580C] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            BHARAT <span className="text-[#EA580C]">UDYAMI</span>
          </h1>
          <p className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
            Direct Producer Marketplace
          </p>
        </div>

        {/* Primary Hindi Tagline */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 w-full shadow-2xs">
          <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            "हर उद्यमी को बाज़ार, हर उत्पाद को पहचान।"
          </p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Connecting India's Producers Directly to Markets
          </p>
        </div>

        {/* Progress Bar with Saffron/Green accents */}
        <div className="w-48 space-y-2">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#FF9933] via-amber-400 to-[#138808] transition-all duration-200 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            उत्पादक नेटवर्क से जुड़ रहे हैं... {Math.min(100, progress)}%
          </span>
        </div>
      </div>

      {/* Bottom Skip / Enter Button */}
      <button
        onClick={() => onFinish && onFinish()}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#EA580C] hover:bg-slate-100 transition"
      >
        <span>आगे बढ़ें (Enter Marketplace)</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
