'use client';

import React, { useState } from 'react';
import { X, CheckCircle, Coffee, Sparkles, HeartHandshake, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { baristaAudio } from './AudioBarista';

export default function OrderModal({ isOpen, onClose, config, calc, onOrderSubmitted }) {
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [tipRate, setTipRate] = useState(0.18);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const tipAmount = Number((calc.price * tipRate).toFixed(2));
  const finalTotal = Number((calc.price + tipAmount).toFixed(2));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    baristaAudio.playClick();

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim() || 'Valued Guest',
          coffee: config,
          notes: notes.trim(),
          tipAmount
        })
      });

      const data = await response.json();

      // Trigger celebration confetti
      if (typeof window !== 'undefined') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e79948', '#d4a373', '#ffffff', '#b0703c']
        });
      }

      baristaAudio.playChime();
      setIsSubmitting(false);
      onOrderSubmitted(data.order);
      onClose();
    } catch (err) {
      console.error('Failed to submit order:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 24,
          background: 'linear-gradient(180deg, #1f140e 0%, #150d09 100%)',
          border: '1px solid var(--border-gold)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(231, 153, 72, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-amber)'
              }}
            >
              <Coffee size={20} />
            </div>
            <div>
              <h3 className="serif-font" style={{ fontSize: '1.25rem' }}>Send to Barista Bar</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ticket will appear live in the queue</p>
            </div>
          </div>
          <button type="button" className="btn-ghost" onClick={onClose} style={{ padding: 6 }}>
            <X size={20} />
          </button>
        </div>

        {/* Order Recipe Ticket Summary */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px dashed rgba(231, 153, 72, 0.3)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                {config.size} {config.temperature === 'iced' ? 'Iced' : 'Hot'} {config.base}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)' }}>
                {config.shots} Espresso Shots · {config.milk === 'none' ? 'No Milk' : `${config.milk} milk`}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cream)' }}>
                ${calc.price.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {calc.caffeine}mg · {calc.calories}cal
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {config.syrup !== 'none' && (
              <span className="glass-pill" style={{ padding: '2px 8px' }}>
                {config.syrupPumps}p {config.syrup} syrup
              </span>
            )}
            <span className="glass-pill" style={{ padding: '2px 8px' }}>
              {config.sweetness}% Sweet
            </span>
            {config.temperature === 'iced' && (
              <span className="glass-pill" style={{ padding: '2px 8px' }}>
                {config.ice}% Ice
              </span>
            )}
            {config.topping !== 'none' && (
              <span className="glass-pill" style={{ padding: '2px 8px' }}>
                Topping: {config.topping}
              </span>
            )}
            {config.latteArt !== 'none' && config.temperature === 'hot' && (
              <span className="glass-pill" style={{ padding: '2px 8px' }}>
                Art: {config.latteArt}
              </span>
            )}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Customer Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Name for the Cup
            </label>
            <input
              type="text"
              placeholder="e.g. Nagesh, Sarah, Barista Fan"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-glass)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
              required
            />
          </div>

          {/* Barista Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Special Notes / Requests (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Extra hot, double sleeve, light foam"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-glass)',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Tip Barista */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <HeartHandshake size={14} color="var(--accent-amber)" /> Tip the Barista Crew
              </label>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)' }}>
                +${tipAmount.toFixed(2)}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {[
                { label: '0%', rate: 0 },
                { label: '15%', rate: 0.15 },
                { label: '18%', rate: 0.18 },
                { label: '20%', rate: 0.20 }
              ].map((t) => (
                <button
                  key={t.label}
                  type="button"
                  className={`pill-tab ${tipRate === t.rate ? 'active' : ''}`}
                  onClick={() => setTipRate(t.rate)}
                  style={{ padding: '6px 0', fontSize: '0.78rem' }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Checkout Breakdown */}
          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span className="mono-font">${calc.price.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Barista Tip</span>
              <span className="mono-font">${tipAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              <span>Total Due</span>
              <span className="mono-font" style={{ color: 'var(--accent-amber)' }}>
                ${finalTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', marginTop: 8 }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Transmitting Order...</span>
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                <span>Confirm Order & Begin Brewing</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
