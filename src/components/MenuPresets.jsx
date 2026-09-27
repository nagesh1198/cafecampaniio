'use client';

import React from 'react';
import { Flame, Snowflake, Sparkles } from 'lucide-react';
import { baristaAudio } from './AudioBarista';

export default function MenuPresets({ presets, currentPresetId, onSelectPreset }) {
  const handleSelect = (preset) => {
    if (preset.temperature === 'hot') {
      baristaAudio.playSteam();
    } else {
      baristaAudio.playIceClink();
    }
    onSelectPreset(preset);
  };

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Barista Signature Recipes
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Choose an artisanal recipe or craft your own from scratch
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 12
        }}
      >
        {presets.map((preset) => {
          const isSelected = currentPresetId === preset.id;
          const isIced = preset.temperature === 'iced';

          return (
            <div
              key={preset.id}
              onClick={() => handleSelect(preset)}
              className="glass-panel"
              style={{
                padding: '16px 14px',
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--accent-amber)' : 'var(--border-glass)',
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(231, 153, 72, 0.16) 0%, rgba(35, 23, 16, 0.8) 100%)'
                  : 'var(--bg-card)',
                boxShadow: isSelected ? 'var(--glow-warm)' : 'none',
                transform: isSelected ? 'translateY(-2px)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: isIced ? 'rgba(56, 189, 248, 0.15)' : 'rgba(231, 153, 72, 0.18)',
                    color: isIced ? '#38bdf8' : '#e79948',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  {isIced ? <Snowflake size={11} /> : <Flame size={11} />}
                  {preset.badge || preset.category}
                </span>

                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cream)', fontFamily: 'var(--font-mono)' }}>
                  ${preset.price.toFixed(2)}
                </span>
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4, color: isSelected ? '#fff4e6' : 'var(--text-primary)' }}>
                  {preset.name}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.35, marginBottom: 12 }}>
                  {preset.tagline}
                </p>
              </div>

              {/* Recipe attributes */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  ⚡ {preset.caffeine}mg · {preset.calories} cal
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: isSelected ? 'var(--accent-amber)' : 'var(--text-secondary)'
                  }}
                >
                  {isSelected ? '✓ In Cup' : 'Select →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
