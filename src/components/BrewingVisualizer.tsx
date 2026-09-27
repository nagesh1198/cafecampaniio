import React from 'react';
import { OrderStatus } from '../types';
import { Sparkles, CheckCircle2, Clock } from 'lucide-react';

interface BrewingVisualizerProps {
  status: OrderStatus;
  stepIndex: number; // 1: Received, 2: Preparing, 3: Almost ready, 4: Ready
  estimatedReadyTime?: string;
  orderNumber?: string;
}

export const BrewingVisualizer: React.FC<BrewingVisualizerProps> = ({
  status,
  stepIndex,
  estimatedReadyTime,
  orderNumber = '#8921'
}) => {
  const isReady = status === 'READY' || status === 'COMPLETED';
  const isPreparing = status === 'PREPARING';

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-cafe-100 flex flex-col items-center relative overflow-hidden">
      {/* Top Stage Indicator */}
      <div className="w-full flex items-center justify-between mb-2 z-10">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cream-200 text-cafe-700">
            Order {orderNumber}
          </span>
          {isReady ? (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-crowd-lowBg text-crowd-lowText flex items-center gap-1">
              <CheckCircle2 size={12} /> Ready for Pickup
            </span>
          ) : (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 flex items-center gap-1 border border-amber-200/50">
              <Clock size={11} className="animate-spin text-amber-600" /> Preparing Live
            </span>
          )}
        </div>
        {estimatedReadyTime && (
          <span className="text-[11px] font-medium text-cafe-500">
            ETA: <strong className="text-cafe-800">{estimatedReadyTime}</strong>
          </span>
        )}
      </div>

      {/* Interactive 3D / SVG Brewing Scene (Compact & Viewport-friendly) */}
      <div className="relative w-40 h-32 flex items-center justify-center my-1">
        {/* Soft radial backdrop glow */}
        <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-700 ${
          isReady ? 'bg-amber-200/40 scale-105' : isPreparing ? 'bg-amber-100/50 scale-95' : 'bg-cream-200/40'
        }`} />

        {/* Rising Steam Wisps when Preparing or Ready */}
        {(isPreparing || isReady) && (
          <div className="absolute -top-1 w-24 h-10 flex justify-around pointer-events-none z-20">
            <div className="w-2 h-7 rounded-full bg-gradient-to-t from-cafe-300/40 to-transparent blur-[1.5px] animate-bounce [animation-duration:2.4s]" />
            <div className="w-2.5 h-8 rounded-full bg-gradient-to-t from-cafe-300/50 to-transparent blur-[2px] animate-bounce [animation-duration:3.1s] [animation-delay:0.5s]" />
            <div className="w-2 h-6 rounded-full bg-gradient-to-t from-cafe-300/35 to-transparent blur-[1.5px] animate-bounce [animation-duration:2.8s] [animation-delay:1.1s]" />
          </div>
        )}

        {/* SVG Interactive Brewing Cup */}
        <svg viewBox="0 0 220 190" className="w-36 h-28 relative z-10 drop-shadow-sm">
          <defs>
            {/* Liquid Clipping Mask */}
            <clipPath id="cupClip">
              <path d="M 45 40 L 62 155 Q 110 168 158 155 L 175 40 Z" />
            </clipPath>

            <linearGradient id="espressoGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6F4E37" />
              <stop offset="60%" stopColor="#4A3525" />
              <stop offset="100%" stopColor="#261911" />
            </linearGradient>

            <linearGradient id="cremaGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E8A94C" />
              <stop offset="50%" stopColor="#F5B041" />
              <stop offset="100%" stopColor="#D48B28" />
            </linearGradient>

            <linearGradient id="ceramicGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#FBF8F3" />
              <stop offset="100%" stopColor="#EFE6D8" />
            </linearGradient>
          </defs>

          {/* Cup Handle */}
          <path
            d="M 165 65 C 205 65, 205 130, 160 135"
            fill="none"
            stroke="#EFE6D8"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 165 65 C 205 65, 205 130, 160 135"
            fill="none"
            stroke="#DCC7B3"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Saucer */}
          <ellipse cx="110" cy="165" rx="85" ry="12" fill="#EFE6D8" stroke="#DCC7B3" strokeWidth="1.5" />
          <ellipse cx="110" cy="165" rx="65" ry="7" fill="#F5EFE6" />

          {/* Outer Cup Body */}
          <path
            d="M 45 40 L 62 155 Q 110 168 158 155 L 175 40 Z"
            fill="url(#ceramicGrad)"
            stroke="#DCC7B3"
            strokeWidth="2"
          />

          {/* Flowing Liquid Stream (During Preparing) */}
          {isPreparing && (
            <g className="animate-pulse">
              <line x1="110" y1="0" x2="110" y2="70" stroke="#6F4E37" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
              <circle cx="110" cy="72" r="3" fill="#E8A94C" />
            </g>
          )}

          {/* Clipped Liquid Fill */}
          <g clipPath="url(#cupClip)">
            {/* Liquid Level animated based on step */}
            <rect
              x="30"
              y={isReady ? 52 : isPreparing ? 75 : 120}
              width="160"
              height="120"
              fill="url(#espressoGrad)"
              className="transition-all duration-1000 ease-out"
            />

            {/* Crema / Foam Layer */}
            {(isPreparing || isReady) && (
              <rect
                x="30"
                y={isReady ? 50 : 73}
                width="160"
                height="14"
                fill="url(#cremaGrad)"
                className="transition-all duration-1000 ease-out opacity-95"
              />
            )}

            {/* Latte Art Heart on Ready */}
            {isReady && (
              <g transform="translate(100, 52) scale(0.4)" className="animate-fade-in">
                <path
                  d="M 25 15 C 25 8, 15 2, 5 12 C -5 2, -15 8, -15 15 C -15 28, 5 45, 5 45 C 5 45, 25 28, 25 15 Z"
                  fill="#FFFBF0"
                  stroke="#E8A94C"
                  strokeWidth="1.5"
                />
              </g>
            )}
          </g>

          {/* Cup Rim Oval */}
          <ellipse cx="110" cy="40" rx="65" ry="10" fill="none" stroke="#DCC7B3" strokeWidth="2.5" />
          <ellipse cx="110" cy="40" rx="63" ry="8" fill="#FFFBF0" opacity="0.4" />
        </svg>

        {/* Ready Celebration Badge */}
        {isReady && (
          <div className="absolute bottom-1 px-2.5 py-0.5 bg-amber-500 text-white rounded-full text-[11px] font-bold shadow-md flex items-center gap-1 animate-bounce">
            <Sparkles size={11} /> Ready!
          </div>
        )}
      </div>

      {/* 4-Stage Step Progress Pipeline */}
      <div className="w-full max-w-xs mt-1 pt-2.5 border-t border-cream-200">
        <div className="flex items-center justify-between text-center relative">
          {/* Progress bar line */}
          <div className="absolute top-2.5 left-4 right-4 h-0.5 bg-cream-200 -z-0">
            <div
              className="h-full bg-sage-400 transition-all duration-700"
              style={{ width: `${Math.max(0, ((stepIndex - 1) / 3) * 100)}%` }}
            />
          </div>

          {[
            { step: 1, label: 'Received' },
            { step: 2, label: 'Grinding' },
            { step: 3, label: 'Extracting' },
            { step: 4, label: 'Ready' }
          ].map((s) => {
            const isPassed = stepIndex >= s.step;
            const isCurrent = stepIndex === s.step;

            return (
              <div key={s.step} className="flex flex-col items-center z-10">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                    isPassed
                      ? 'bg-sage-400 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-amber-500 text-white ring-2 ring-amber-200'
                      : 'bg-white text-cafe-400 border border-cream-300'
                  }`}
                >
                  {isPassed ? '✓' : s.step}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${
                  isCurrent ? 'text-cafe-900 font-bold' : 'text-cafe-400'
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
