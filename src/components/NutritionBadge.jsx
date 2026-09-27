'use client';

import React from 'react';
import { Zap, Flame, DollarSign, Award } from 'lucide-react';

export default function NutritionBadge({ calc, onOrderClick }) {
  const { price = 4.50, caffeine = 150, calories = 120 } = calc;

  // Caffeine level rating
  let caffeineLevel = 'Moderate';
  let caffeineColor = '#38bdf8';
  let caffeinePercentage = Math.min(100, Math.round((caffeine / 350) * 100));

  if (caffeine <= 40) {
    caffeineLevel = 'Decaf / Low';
    caffeineColor = '#34d399';
  } else if (caffeine <= 160) {
    caffeineLevel = 'Balanced Kick';
    caffeineColor = '#fbbf24';
  } else if (caffeine <= 250) {
    caffeineLevel = 'Strong Focus';
    caffeineColor = '#f97316';
  } else {
    caffeineLevel = 'Ultra High Voltage';
    caffeineColor = '#ef4444';
  }

  return (
    <div
      className="glass-panel"
      style={{
        padding: '20px 24px',
        border: '1px solid var(--border-gold)',
        boxShadow: 'var(--glow-warm)',
        background: 'linear-gradient(180deg, rgba(35, 23, 16, 0.9) 0%, rgba(20, 13, 9, 0.95) 100%)'
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 18 }}>
        {/* Total Price */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            Craft Total
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cream)', fontFamily: 'var(--font-mono)' }}>
            ${price.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            taxes & syrups included
          </div>
        </div>

        {/* Caffeine Meter */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            <Zap size={13} color={caffeineColor} /> Caffeine
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: caffeineColor, fontFamily: 'var(--font-mono)' }}>
            {caffeine} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>mg</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: caffeineColor, fontWeight: 600 }}>
            {caffeineLevel}
          </div>
        </div>

        {/* Calories */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            <Flame size={13} color="#f97316" /> Energy
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {calories} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>cal</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            freshly prepared
          </div>
        </div>
      </div>

      {/* Caffeine gauge bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ height: 6, width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${caffeinePercentage}%`,
              background: `linear-gradient(90deg, #38bdf8 0%, ${caffeineColor} 100%)`,
              borderRadius: 3,
              transition: 'width 0.4s ease, background 0.4s ease'
            }}
          />
        </div>
      </div>

      {/* Action CTA */}
      <button
        type="button"
        className="btn-primary"
        onClick={onOrderClick}
        style={{
          width: '100%',
          justifyContent: 'center',
          padding: '15px 24px',
          fontSize: '1.05rem',
          letterSpacing: '0.02em'
        }}
      >
        <Award size={18} />
        <span>Brew This Coffee • ${price.toFixed(2)}</span>
      </button>
    </div>
  );
}
