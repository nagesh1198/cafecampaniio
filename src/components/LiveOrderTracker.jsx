'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Clock, Coffee, Sparkles, ChefHat, CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react';
import { baristaAudio } from './AudioBarista';

const DEFAULT_STEPS = [
  { step: 1, title: 'Order Received', desc: 'Ticket printed at the barista station' },
  { step: 2, title: 'Grinding Fresh Beans', desc: 'Precision burr grinding single-origin beans' },
  { step: 3, title: 'Extracting Espresso', desc: 'Pulling 9-bar golden crema espresso shot' },
  { step: 4, title: 'Steaming / Icing', desc: 'Crafting microfoam or shaking with crystal ice' },
  { step: 5, title: 'Pouring & Latte Art', desc: 'Layering flavors & drawing custom art' },
  { step: 6, title: 'Ready for Pickup', desc: 'Served warm & fresh at the pickup counter!' }
];

export default function LiveOrderTracker({ isOpen, onClose, orders = [], onReorder, onManualStepAdvance }) {
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || null);

  useEffect(() => {
    if (orders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders, selectedOrderId]);

  if (!isOpen) return null;

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];
  const stepIndex = currentOrder?.stepIndex || 1;
  const isCompleted = stepIndex >= 6 || currentOrder?.status === 'Ready for Pickup';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 680,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 26,
          background: 'linear-gradient(180deg, #1b120c 0%, #120a06 100%)',
          border: '1px solid var(--border-gold)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.85)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'rgba(231, 153, 72, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-amber)'
              }}
            >
              <ChefHat size={22} />
            </div>
            <div>
              <h3 className="serif-font" style={{ fontSize: '1.35rem' }}>Live Barista Station</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Track your coffee being freshly hand-crafted in real-time
              </p>
            </div>
          </div>
          <button type="button" className="btn-ghost" onClick={onClose} style={{ padding: 6 }}>
            <X size={20} />
          </button>
        </div>

        {/* Orders Selector Pills if multiple orders */}
        {orders.length > 1 && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 18 }}>
            {orders.map((ord) => (
              <button
                key={ord.id}
                type="button"
                className={`pill-tab ${selectedOrderId === ord.id ? 'active' : ''}`}
                onClick={() => setSelectedOrderId(ord.id)}
                style={{ padding: '8px 14px', whiteSpace: 'nowrap' }}
              >
                <span>{ord.id}</span>
                <span style={{ fontSize: '0.72rem', opacity: 0.7 }}>({ord.customerName})</span>
              </button>
            ))}
          </div>
        )}

        {currentOrder ? (
          <div>
            {/* Active Order Card */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(231, 153, 72, 0.25)',
                borderRadius: 16,
                padding: 18,
                marginBottom: 24,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className="badge-tag badge-gold">{currentOrder.id}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    For <strong>{currentOrder.customerName}</strong>
                  </span>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {currentOrder.itemSummary}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Ordered at {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: isCompleted ? '#4ade80' : 'var(--accent-amber)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    justifyContent: 'flex-end',
                    marginBottom: 4
                  }}
                >
                  {isCompleted ? <CheckCircle2 size={16} /> : <Clock size={16} className="animate-spin" />}
                  {currentOrder.status}
                </div>
                <div className="mono-font" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cream)' }}>
                  ${(currentOrder.total || 0).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Step Progression Timeline */}
            <div style={{ marginBottom: 26 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: 16 }}>
                Brewing Journey Status
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {DEFAULT_STEPS.map((s) => {
                  const isDone = stepIndex > s.step;
                  const isCurrent = stepIndex === s.step;

                  return (
                    <div
                      key={s.step}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '10px 14px',
                        borderRadius: 12,
                        background: isCurrent
                          ? 'rgba(231, 153, 72, 0.12)'
                          : isDone
                          ? 'rgba(74, 222, 128, 0.05)'
                          : 'rgba(255, 255, 255, 0.02)',
                        border: isCurrent
                          ? '1px solid var(--accent-amber)'
                          : isDone
                          ? '1px solid rgba(74, 222, 128, 0.25)'
                          : '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: isDone
                            ? '#22c55e'
                            : isCurrent
                            ? 'var(--accent-amber)'
                            : 'rgba(255, 255, 255, 0.1)',
                          color: isDone || isCurrent ? '#120803' : '#888',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}
                      >
                        {isDone ? <Check size={16} /> : s.step}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: isCurrent ? 700 : 600,
                            color: isCurrent ? '#fff4e6' : isDone ? '#4ade80' : 'var(--text-secondary)',
                            fontSize: '0.92rem'
                          }}
                        >
                          {s.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.desc}</div>
                      </div>

                      {isCurrent && (
                        <span className="badge-tag badge-gold" style={{ fontSize: '0.7rem' }}>
                          In Progress
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid var(--border-glass)', paddingTop: 16 }}>
              {isCompleted ? (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    baristaAudio.playChime();
                    onReorder(currentOrder.details);
                    onClose();
                  }}
                  style={{ fontSize: '0.9rem' }}
                >
                  <RotateCcw size={15} />
                  <span>Re-Order This Recipe</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    if (onManualStepAdvance) {
                      onManualStepAdvance(currentOrder.id, Math.min(6, stepIndex + 1));
                    }
                  }}
                  style={{ fontSize: '0.85rem' }}
                >
                  <span>Simulate Next Step</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <Coffee size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p>No orders yet today. Design your signature brew and send it to the barista!</p>
          </div>
        )}
      </div>
    </div>
  );
}
