'use client';

import React from 'react';
import { Flame, Snowflake, Plus, Minus, Sparkles, Coffee, Droplets, Layers, Heart } from 'lucide-react';
import { baristaAudio } from './AudioBarista';

export default function CoffeeCustomizer({ config, onChange, ingredients }) {
  const updateConfig = (key, value) => {
    baristaAudio.playClick();
    onChange({ ...config, [key]: value });
  };

  const handleShotChange = (delta) => {
    const nextShots = Math.max(1, Math.min(4, (config.shots || 2) + delta));
    baristaAudio.playPour();
    onChange({ ...config, shots: nextShots });
  };

  const handlePumpChange = (delta) => {
    const nextPumps = Math.max(0, Math.min(5, (config.syrupPumps || 0) + delta));
    baristaAudio.playClick();
    onChange({
      ...config,
      syrupPumps: nextPumps,
      syrup: nextPumps === 0 ? 'none' : (config.syrup === 'none' ? 'vanilla' : config.syrup)
    });
  };

  const isIced = config.temperature === 'iced';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. Temperature Toggle (Hot vs Iced) */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          1. Temperature Experience
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button
            type="button"
            className={`pill-tab ${!isIced ? 'active' : ''}`}
            onClick={() => {
              baristaAudio.playSteam();
              onChange({ ...config, temperature: 'hot', ice: 0 });
            }}
            style={{ padding: '12px 16px', fontSize: '0.95rem' }}
          >
            <Flame size={18} color={!isIced ? '#f97316' : '#888'} />
            <span>Hot & Steamed</span>
          </button>

          <button
            type="button"
            className={`pill-tab ${isIced ? 'active' : ''}`}
            onClick={() => {
              baristaAudio.playIceClink();
              onChange({ ...config, temperature: 'iced', ice: 50, latteArt: 'none' });
            }}
            style={{ padding: '12px 16px', fontSize: '0.95rem' }}
          >
            <Snowflake size={18} color={isIced ? '#38bdf8' : '#888'} />
            <span>Iced & Shaken</span>
          </button>
        </div>
      </div>

      {/* 2. Cup Size */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            2. Cup Size
          </label>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
            {config.size}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
            { id: '8oz', label: '8 oz', sub: 'Solo', price: '-$0.50' },
            { id: '12oz', label: '12 oz', sub: 'Standard', price: '+$0.00' },
            { id: '16oz', label: '16 oz', sub: 'Grande', price: '+$0.75' },
            { id: '20oz', label: '20 oz', sub: 'Venti', price: '+$1.40' }
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              className={`pill-tab ${config.size === s.id ? 'active' : ''}`}
              onClick={() => updateConfig('size', s.id)}
              style={{ flexDirection: 'column', padding: '10px 6px', textAlign: 'center' }}
            >
              <span style={{ fontWeight: 700 }}>{s.label}</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{s.sub}</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--accent-gold)' }}>{s.price}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Coffee Base & Espresso Shots */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          3. Roast & Espresso Shots
        </label>
        
        {/* Roast selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[
            { id: 'Espresso', name: 'Dark Roast Blend', note: 'Bold & Smokey' },
            { id: 'Blonde Espresso', name: 'Blonde Roast', note: 'Sweet & Bright' },
            { id: 'Cold Brew', name: '20h Reserve Cold Brew', note: 'Ultra Smooth' },
            { id: 'Decaf', name: 'Swiss Decaf', note: 'Full Flavor, No Buzz' }
          ].map((b) => (
            <button
              key={b.id}
              type="button"
              className={`pill-tab ${config.base === b.id ? 'active' : ''}`}
              onClick={() => updateConfig('base', b.id)}
              style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '10px 12px' }}
            >
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{b.name}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{b.note}</span>
            </button>
          ))}
        </div>

        {/* Shots Counter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Coffee size={18} color="var(--accent-amber)" />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Espresso Shots</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {config.shots * 75}mg estimated caffeine
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => handleShotChange(-1)}
              disabled={config.shots <= 1}
              style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-glass)', justifyContent: 'center' }}
            >
              <Minus size={14} />
            </button>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, minWidth: 24, textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
              {config.shots}
            </span>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => handleShotChange(1)}
              disabled={config.shots >= 4}
              style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-glass)', justifyContent: 'center' }}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Milk Choice */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          4. Milk & Dairy Alternative
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { id: 'none', label: 'None (Black)', price: '' },
            { id: 'oat', label: 'Barista Oat', price: '+$0.70' },
            { id: 'whole', label: 'Whole Milk', price: '+$0.00' },
            { id: 'almond', label: 'Almond Silk', price: '+$0.70' },
            { id: 'sweet-cream', label: 'Sweet Cream', price: '+$0.85' },
            { id: 'coconut', label: 'Coconut Milk', price: '+$0.70' }
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              className={`pill-tab ${config.milk === m.id ? 'active' : ''}`}
              onClick={() => updateConfig('milk', m.id)}
              style={{ flexDirection: 'column', padding: '9px 6px', textAlign: 'center' }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{m.label}</span>
              {m.price && <span style={{ fontSize: '0.65rem', color: 'var(--accent-amber)' }}>{m.price}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Flavor Syrups & Pumps */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            5. Flavor Syrups ({config.syrupPumps} {config.syrupPumps === 1 ? 'Pump' : 'Pumps'})
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => handlePumpChange(-1)}
              disabled={config.syrupPumps <= 0}
              style={{ padding: '3px 8px', fontSize: '0.75rem' }}
            >
              <Minus size={12} />
            </button>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {config.syrupPumps}
            </span>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => handlePumpChange(1)}
              disabled={config.syrupPumps >= 5}
              style={{ padding: '3px 8px', fontSize: '0.75rem' }}
            >
              <Plus size={12} />
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { id: 'none', label: 'No Syrup' },
            { id: 'vanilla', label: 'Vanilla Bean' },
            { id: 'caramel', label: 'Salted Caramel' },
            { id: 'brown-sugar', label: 'Brown Sugar' },
            { id: 'hazelnut', label: 'Hazelnut' },
            { id: 'mocha', label: 'Dark Mocha' }
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              className={`pill-tab ${config.syrup === s.id ? 'active' : ''}`}
              onClick={() => {
                const nextPumps = s.id === 'none' ? 0 : (config.syrupPumps === 0 ? 2 : config.syrupPumps);
                baristaAudio.playClick();
                onChange({ ...config, syrup: s.id, syrupPumps: nextPumps });
              }}
              style={{ padding: '8px 6px', fontSize: '0.78rem' }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Sweetness & Ice Percentage Sliders */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Sweetness Level
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
              {config.sweetness}%
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0, 25, 50, 75, 100].map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`pill-tab ${config.sweetness === lvl ? 'active' : ''}`}
                onClick={() => updateConfig('sweetness', lvl)}
                style={{ flex: 1, padding: '6px 0', fontSize: '0.75rem' }}
              >
                {lvl}%
              </button>
            ))}
          </div>
        </div>

        {isIced && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Ice Level
              </span>
              <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                {config.ice}%
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0, 25, 50, 75, 100].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  className={`pill-tab ${config.ice === lvl ? 'active' : ''}`}
                  onClick={() => updateConfig('ice', lvl)}
                  style={{ flex: 1, padding: '6px 0', fontSize: '0.75rem' }}
                >
                  {lvl}%
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 7. Toppings & Latte Art */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          6. Toppings & Crema Finishes
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
          {[
            { id: 'none', label: 'None' },
            { id: 'microfoam', label: 'Microfoam' },
            { id: 'whipped-cream', label: 'Whipped Cream', price: '+$0.60' },
            { id: 'caramel-drizzle', label: 'Caramel Drizzle', price: '+$0.50' },
            { id: 'chocolate-drizzle', label: 'Choc Drizzle', price: '+$0.50' },
            { id: 'cinnamon', label: 'Cinnamon Dust' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              className={`pill-tab ${config.topping === t.id ? 'active' : ''}`}
              onClick={() => updateConfig('topping', t.id)}
              style={{ flexDirection: 'column', padding: '8px 6px', fontSize: '0.78rem' }}
            >
              <span>{t.label}</span>
              {t.price && <span style={{ fontSize: '0.65rem', color: 'var(--accent-amber)' }}>{t.price}</span>}
            </button>
          ))}
        </div>

        {/* Latte Art (Hot only, when not whipped cream) */}
        {!isIced && config.topping !== 'whipped-cream' && (
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-gold)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Heart size={14} /> Barista Latte Art Pattern
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
              {[
                { id: 'none', label: 'None' },
                { id: 'heart', label: 'Heart' },
                { id: 'rosette', label: 'Rosette' },
                { id: 'tulip', label: 'Tulip' },
                { id: 'swan', label: 'Swan' }
              ].map((art) => (
                <button
                  key={art.id}
                  type="button"
                  className={`pill-tab ${config.latteArt === art.id ? 'active' : ''}`}
                  onClick={() => updateConfig('latteArt', art.id)}
                  style={{ padding: '6px 4px', fontSize: '0.75rem' }}
                >
                  {art.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
