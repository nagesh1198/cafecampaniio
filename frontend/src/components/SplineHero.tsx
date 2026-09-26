import React, { useState } from 'react';
import { Sparkles, Coffee, Heart, Wifi, Volume2, VolumeX } from 'lucide-react';

interface SplineHeroProps {
  onExploreClick: () => void;
  onOpenSpaceClick: () => void;
  onCraftStudioClick?: () => void;
  openSpaceCount: number;
}

export const SplineHero: React.FC<SplineHeroProps> = ({
  onExploreClick,
  onOpenSpaceClick,
  onCraftStudioClick,
  openSpaceCount = 3
}) => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-cream-50 via-cream-100 to-cream-200 border border-cream-200/80 shadow-soft p-6 sm:p-10 mb-10">
      {/* Decorative ambient background rings */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-sage-100/40 rounded-full blur-3xl pointer-events-none -mb-20" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Vision & Action */}
        <div className="lg:col-span-7 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-cream-200 shadow-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-sage-400 animate-pulse" />
            <span className="text-xs font-semibold text-cafe-700 tracking-wide">
              Google Gemini Powered Café Platform
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] text-cafe-900 leading-[1.15] mb-4">
            Your café, <span className="text-cafe-600 italic">smarter.</span>
          </h1>

          <p className="text-cafe-600 text-lg leading-relaxed max-w-xl mb-6">
            Discover nearby roasteries, order through our Gemini AI assistant, track live brewing,
            play games while you wait, and connect in our live Open Space.
          </p>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 rounded-xl bg-cafe-600 hover:bg-cafe-700 text-white font-medium shadow-card hover:shadow-lift transition-all duration-200 flex items-center gap-2 text-sm"
            >
              <Coffee size={18} />
              <span>Explore Cafés & Order</span>
            </button>

            {onCraftStudioClick && (
              <button
                onClick={onCraftStudioClick}
                className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium shadow-card hover:shadow-lift transition-all duration-200 flex items-center gap-2 text-sm"
              >
                <Sparkles size={17} />
                <span>Craft Custom Cup Graphic</span>
              </button>
            )}

            <button
              onClick={onOpenSpaceClick}
              className="px-5 py-3.5 rounded-xl bg-white hover:bg-cream-50 text-cafe-800 border border-cream-300 font-medium shadow-sm transition-all duration-200 flex items-center gap-2 text-sm"
            >
              <span className="w-2 h-2 rounded-full bg-sage-400" />
              <span>Open Space ({openSpaceCount} here)</span>
            </button>
          </div>


          {/* Quick Value Metrics */}
          <div className="grid grid-cols-3 gap-6 pt-8 mt-6 border-t border-cream-200/80 w-full max-w-lg">
            <div>
              <div className="text-xl font-bold text-cafe-900 font-serif">5–10 min</div>
              <div className="text-xs text-cafe-500 font-medium">Avg wait time</div>
            </div>
            <div>
              <div className="text-xl font-bold text-cafe-900 font-serif">100% Real</div>
              <div className="text-xs text-cafe-500 font-medium">Menu grounded</div>
            </div>
            <div>
              <div className="text-xl font-bold text-cafe-900 font-serif">Café Points</div>
              <div className="text-xs text-cafe-500 font-medium">Rewards for games</div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Visual Showcase */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-card border border-cream-200/80">
            {/* Soft Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-cream-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-crowd-lowText" />
                <span className="text-xs font-semibold text-cafe-800">Artisan Roastery & Lab</span>
              </div>
              <span className="text-[11px] font-medium text-cafe-500 px-2 py-0.5 rounded-full bg-cream-100">
                Live Status
              </span>
            </div>

            {/* Visual Hero Showcase (Photographic with interactive elements) */}
            <div className="relative h-52 rounded-xl overflow-hidden mb-3 bg-cream-200">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"
                alt="Café Interior Ambiance"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cafe-900/60 via-transparent to-transparent flex items-end p-4">
                <div className="text-white">
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                    🟢 Low crowd • 6 min wait
                  </div>
                  <div className="text-sm font-bold">Single-Origin Ethiopian Pour-Overs</div>
                </div>
              </div>
            </div>

            {/* Live Open Space Peek */}
            <div className="p-3 rounded-xl bg-cream-50 border border-cream-200/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <span className="inline-block h-6 w-6 rounded-full bg-cafe-300 ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-cafe-800">
                    ☕
                  </span>
                  <span className="inline-block h-6 w-6 rounded-full bg-sage-300 ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-cafe-800">
                    🌿
                  </span>
                  <span className="inline-block h-6 w-6 rounded-full bg-amber-300 ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-cafe-800">
                    💻
                  </span>
                </div>
                <div className="text-xs text-cafe-700">
                  <strong className="font-semibold">{openSpaceCount} guests</strong> open to connect
                </div>
              </div>
              <button
                onClick={onOpenSpaceClick}
                className="text-xs font-semibold text-cafe-600 hover:text-cafe-800 underline"
              >
                Say Hello →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
