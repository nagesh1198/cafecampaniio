'use client';

import React, { useState } from 'react';
import { Coffee, Volume2, VolumeX, Sparkles, Clock } from 'lucide-react';
import { baristaAudio } from './AudioBarista';

export default function Navbar({ activeOrdersCount, onOpenOrders, cafeInfo }) {
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    baristaAudio.isMuted = nextMuted;
    if (!nextMuted) {
      baristaAudio.playChime();
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(18, 12, 8, 0.85)',
        borderBottom: '1px solid var(--border-glass)'
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #e79948 0%, #b0703c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(231, 153, 72, 0.4)'
            }}
          >
            <Coffee size={24} color="#140a04" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="serif-font" style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                Google's Cafe
              </span>
              <span className="badge-tag badge-gold" style={{ fontSize: '0.65rem' }}>
                Roastery & Bar
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
              Open Now · Ethiopian Single-Origin
            </div>
          </div>
        </div>

        {/* Cafe Live Details Ticker (Desktop) */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: 16,
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '6px 14px',
            borderRadius: 30,
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}
          className="desktop-ticker"
        >
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={13} color="var(--accent-amber)" />
            <span>Daily Roast: <strong style={{ color: '#fff' }}>Ethiopian Yirgacheffe</strong></span>
          </div>
          <span style={{ color: 'var(--border-glass)' }}>|</span>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Barista on duty: <strong style={{ color: 'var(--accent-cream)' }}>Leo & Maya</strong>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Audio toggle */}
          <button
            type="button"
            className="btn-ghost"
            onClick={toggleSound}
            title={isMuted ? 'Unmute cafe sounds' : 'Mute cafe sounds'}
            style={{ border: '1px solid var(--border-glass)', borderRadius: 10, padding: '8px 12px' }}
          >
            {isMuted ? <VolumeX size={17} color="#999" /> : <Volume2 size={17} color="var(--accent-amber)" />}
            <span style={{ fontSize: '0.8rem', color: isMuted ? 'var(--text-muted)' : 'var(--text-primary)' }}>
              {isMuted ? 'Muted' : 'Audio On'}
            </span>
          </button>

          {/* Active Orders / Tracker Button */}
          <button
            type="button"
            className="btn-secondary"
            onClick={onOpenOrders}
            style={{ position: 'relative' }}
          >
            <Clock size={16} />
            <span style={{ fontSize: '0.85rem' }}>Live Orders</span>
            {activeOrdersCount > 0 && (
              <span
                style={{
                  background: 'var(--accent-amber)',
                  color: '#120803',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 2
                }}
              >
                {activeOrdersCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
