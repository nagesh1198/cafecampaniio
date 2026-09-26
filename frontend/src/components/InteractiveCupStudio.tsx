'use client';

import React, { useState, useMemo } from 'react';
import CoffeeCupGraphic from './CoffeeCupGraphic';
import { baristaAudio } from './AudioBarista';
import {
  Flame,
  Snowflake,
  Sparkles,
  Coffee,
  Plus,
  Minus,
  Zap,
  ShoppingBag,
  Award,
  Layers,
  Heart,
  Droplets,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, MenuItem } from '../types';

export interface CoffeeConfig {
  temperature: 'hot' | 'iced';
  size: '8oz' | '12oz' | '16oz' | '20oz';
  shots: number;
  base: string;
  milk: string;
  syrup: string;
  syrupPumps: number;
  sweetness: number;
  ice: number;
  topping: string;
  latteArt: string;
  name?: string;
  price?: number;
}

const SIGNATURE_PRESETS: { id: string; name: string; desc: string; config: CoffeeConfig; basePrice: number }[] = [
  {
    id: 'americano',
    name: 'Artisan Americano',
    desc: 'Double shot of Ethiopian Yirgacheffe pulled over hot mineral water.',
    basePrice: 150,
    config: {
      temperature: 'hot',
      size: '12oz',
      shots: 2,
      base: 'Espresso',
      milk: 'none',
      syrup: 'none',
      syrupPumps: 0,
      sweetness: 0,
      ice: 0,
      topping: 'none',
      latteArt: 'none',
      name: 'Artisan Americano'
    }
  },
  {
    id: 'iced-americano',
    name: 'Iced Americano',
    desc: 'Double espresso pulled fresh over crystal ice & chilled water.',
    basePrice: 150,
    config: {
      temperature: 'iced',
      size: '16oz',
      shots: 2,
      base: 'Espresso',
      milk: 'none',
      syrup: 'none',
      syrupPumps: 0,
      sweetness: 0,
      ice: 60,
      topping: 'none',
      latteArt: 'none',
      name: 'Iced Americano'
    }
  },
  {
    id: 'vanilla-oat-latte',
    name: 'Vanilla Oat Latte',
    desc: 'Blonde espresso, steamed barista oat milk, Madagascar vanilla & heart latte art.',
    basePrice: 180,
    config: {
      temperature: 'hot',
      size: '16oz',
      shots: 2,
      base: 'Blonde Espresso',
      milk: 'oat',
      syrup: 'vanilla',
      syrupPumps: 2,
      sweetness: 50,
      ice: 0,
      topping: 'microfoam',
      latteArt: 'heart',
      name: 'Vanilla Oat Latte'
    }
  },
  {
    id: 'caramel-macchiato',
    name: 'Caramel Macchiato',
    desc: 'Steamed whole milk marked with bold espresso, vanilla & caramel drizzle.',
    basePrice: 200,
    config: {
      temperature: 'hot',
      size: '16oz',
      shots: 2,
      base: 'Espresso',
      milk: 'whole',
      syrup: 'caramel',
      syrupPumps: 3,
      sweetness: 75,
      ice: 0,
      topping: 'caramel-drizzle',
      latteArt: 'rosette',
      name: 'Caramel Macchiato'
    }
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew Reserve',
    desc: '18-hour cold-steeped single-origin coffee with naturally sweet chocolate notes.',
    basePrice: 170,
    config: {
      temperature: 'iced',
      size: '16oz',
      shots: 1,
      base: 'Cold Brew',
      milk: 'none',
      syrup: 'none',
      syrupPumps: 0,
      sweetness: 0,
      ice: 50,
      topping: 'none',
      latteArt: 'none',
      name: 'Cold Brew Reserve'
    }
  },
  {
    id: 'iced-mocha',
    name: 'Belgian Iced Mocha',
    desc: 'Rich dark chocolate, double espresso, chilled milk and crystal ice.',
    basePrice: 210,
    config: {
      temperature: 'iced',
      size: '16oz',
      shots: 2,
      base: 'Espresso',
      milk: 'whole',
      syrup: 'mocha',
      syrupPumps: 3,
      sweetness: 75,
      ice: 50,
      topping: 'cocoa-dust',
      latteArt: 'none',
      name: 'Belgian Iced Mocha'
    }
  }
];

interface InteractiveCupStudioProps {
  onAddToCart: (item: MenuItem, customizations?: any) => void;
  onInstantOrder?: (cartItem: CartItem) => void;
  initialPreset?: string;
  onClose?: () => void;
  isModal?: boolean;
}

export const InteractiveCupStudio: React.FC<InteractiveCupStudioProps> = ({
  onAddToCart,
  onInstantOrder,
  initialPreset = 'americano',
  onClose,
  isModal = false
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(initialPreset);
  const [config, setConfig] = useState<CoffeeConfig>(() => {
    const found = SIGNATURE_PRESETS.find(p => p.id === initialPreset);
    return found ? found.config : SIGNATURE_PRESETS[0].config;
  });

  const [activeTab, setActiveTab] = useState<'build' | 'recipe'>('build');
  const [isAdded, setIsAdded] = useState(false);

  // Dynamic calculations: Calories, Caffeine, Price
  const metrics = useMemo(() => {
    let basePrice = 140;
    if (config.size === '8oz') basePrice = 120;
    if (config.size === '12oz') basePrice = 140;
    if (config.size === '16oz') basePrice = 160;
    if (config.size === '20oz') basePrice = 180;

    // Shot additions
    const shotCost = Math.max(0, config.shots - 1) * 25;

    // Milk additions
    let milkCost = 0;
    if (config.milk === 'oat' || config.milk === 'almond') milkCost = 35;
    else if (config.milk === 'sweet-cream') milkCost = 45;

    // Syrup cost
    const syrupCost = config.syrup !== 'none' ? config.syrupPumps * 15 : 0;

    const totalPrice = basePrice + shotCost + milkCost + syrupCost;

    // Caffeine
    let caffeine = config.shots * 65;
    if (config.base === 'Decaf') caffeine = 6;
    if (config.base === 'Cold Brew') caffeine = 180;

    // Calories
    let calories = 5;
    if (config.milk === 'whole') calories += 110;
    if (config.milk === 'oat') calories += 80;
    if (config.milk === 'almond') calories += 45;
    if (config.milk === 'sweet-cream') calories += 140;
    if (config.syrup !== 'none') calories += config.syrupPumps * 35;

    return { totalPrice, caffeine, calories };
  }, [config]);

  // Handlers
  const handleSelectPreset = (preset: typeof SIGNATURE_PRESETS[0]) => {
    setSelectedPresetId(preset.id);
    setConfig(preset.config);
    if (preset.config.temperature === 'hot') {
      baristaAudio.playSteam();
    } else {
      baristaAudio.playIceClink();
    }
  };

  const handleUpdate = (patch: Partial<CoffeeConfig>) => {
    setConfig(prev => ({ ...prev, ...patch }));
    baristaAudio.playClick();
  };

  const handleAddCupToCart = () => {
    baristaAudio.playPour();
    if (typeof window !== 'undefined') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6F4E37', '#E8A94C', '#7FA98A', '#FBF8F3']
      });
    }

    const menuItem: MenuItem = {
      id: `custom-cup-${Date.now()}`,
      cafeId: 'cafe-artisan-roastery',
      name: config.name || `${config.temperature === 'hot' ? 'Hot' : 'Iced'} ${config.base} (${config.size})`,
      description: `Custom craft with ${config.shots}x shots, ${config.milk !== 'none' ? config.milk + ' milk' : 'black'}, ${config.syrup !== 'none' ? config.syrupPumps + ' pumps ' + config.syrup : 'no syrup'}.`,
      price: metrics.totalPrice,
      category: 'Coffee',
      available: true,
      preparationTimeMinutes: config.temperature === 'iced' ? 3 : 5,
      tags: ['custom', config.temperature, 'handcrafted'],
      ingredients: [config.base, config.milk, config.syrup].filter(i => i !== 'none'),
      calories: metrics.calories,
      caffeineMg: metrics.caffeine,
      isPopular: true
    };

    onAddToCart(menuItem, config);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      if (onClose) onClose();
    }, 1200);
  };

  const isIced = config.temperature === 'iced';

  return (
    <div className={`bg-white rounded-3xl border border-cream-200 shadow-card overflow-hidden ${isModal ? 'max-w-4xl w-full mx-auto' : ''}`}>
      {/* Header bar */}
      <div className="px-6 py-4 bg-gradient-to-r from-cream-100 via-white to-cream-50 border-b border-cream-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cafe-600 text-white flex items-center justify-center shadow-sm">
            <Coffee size={20} />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-cafe-900 flex items-center gap-2">
              <span>Interactive Coffee Studio</span>
              <span className="text-[11px] font-sans font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">
                Live Graphic
              </span>
            </h2>
            <p className="text-xs text-cafe-500 font-medium">
              Watch your cup update in real-time as you tweak temperature, liquid layers, and art
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-cafe-700 flex items-center justify-center transition-colors text-sm font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Preset Pill Bar */}
      <div className="px-6 py-3 bg-cream-50/70 border-b border-cream-200/80 overflow-x-auto no-scrollbar flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-cafe-500 whitespace-nowrap mr-1">
          Barista Recipes:
        </span>
        {SIGNATURE_PRESETS.map(preset => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-cafe-600 text-white shadow-sm'
                  : 'bg-white hover:bg-cream-100 text-cafe-700 border border-cream-200'
              }`}
            >
              {preset.config.temperature === 'hot' ? (
                <Flame size={12} className={isSelected ? 'text-amber-300' : 'text-amber-600'} />
              ) : (
                <Snowflake size={12} className={isSelected ? 'text-sky-200' : 'text-sky-500'} />
              )}
              <span>{preset.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Studio Body: Graphic Display (Left) + Customizer Sliders (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-cream-200">
        {/* LEFT COLUMN: Animated SVG Coffee Cup & Audio Feedback */}
        <div className="lg:col-span-5 p-6 flex flex-col items-center justify-between bg-gradient-to-b from-cream-50/60 to-white relative">
          <div className="w-full flex items-center justify-between text-xs text-cafe-500 mb-2">
            <span className="flex items-center gap-1 font-semibold text-cafe-700">
              <Sparkles size={14} className="text-amber-500" />
              Live Graphic Preview
            </span>
            <span className="text-[11px] text-cafe-400">Tap cup to hear barista sound</span>
          </div>

          {/* SVG Graphic with dynamic animations */}
          <div className="my-auto py-4">
            <CoffeeCupGraphic
              config={config}
              onCupClick={() => {
                if (typeof window !== 'undefined') {
                  confetti({
                    particleCount: 20,
                    spread: 40,
                    origin: { y: 0.5 },
                    colors: ['#E8A94C', '#6F4E37']
                  });
                }
              }}
            />
          </div>

          {/* Real-time Nutrition & Caffeine Gauge */}
          <div className="w-full bg-cream-50 rounded-2xl p-4 border border-cream-200 mt-4 space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-[10px] uppercase font-bold text-cafe-500 tracking-wider">Caffeine</div>
                <div className="font-serif font-bold text-lg text-cafe-900 flex items-center justify-center gap-0.5">
                  <Zap size={14} className="text-amber-500" />
                  <span>{metrics.caffeine}</span>
                  <span className="text-xs font-normal text-cafe-500">mg</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-cafe-500 tracking-wider">Calories</div>
                <div className="font-serif font-bold text-lg text-cafe-900 flex items-center justify-center gap-0.5">
                  <Flame size={14} className="text-orange-500" />
                  <span>{metrics.calories}</span>
                  <span className="text-xs font-normal text-cafe-500">cal</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-cafe-500 tracking-wider">Price</div>
                <div className="font-serif font-bold text-lg text-cafe-900 text-amber-700">
                  ₹{metrics.totalPrice}
                </div>
              </div>
            </div>

            {/* Caffeine strength meter */}
            <div>
              <div className="h-1.5 w-full bg-cream-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sage-400 via-amber-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (metrics.caffeine / 250) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-cafe-400 mt-1">
                <span>Mild</span>
                <span>Optimal Kick</span>
                <span>Double Shot</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Customizer Dials */}
        <div className="lg:col-span-7 p-6 space-y-5 bg-white">
          {/* 1. Temperature Toggle */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-cafe-600 block mb-2">
              1. Temperature
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  baristaAudio.playSteam();
                  handleUpdate({ temperature: 'hot', ice: 0 });
                }}
                className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  !isIced
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-cream-50 hover:bg-cream-100 text-cafe-700 border-cream-200'
                }`}
              >
                <Flame size={16} />
                <span>Hot & Steamed (65°C)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  baristaAudio.playIceClink();
                  handleUpdate({ temperature: 'iced', ice: 50, latteArt: 'none' });
                }}
                className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  isIced
                    ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                    : 'bg-cream-50 hover:bg-cream-100 text-cafe-700 border-cream-200'
                }`}
              >
                <Snowflake size={16} />
                <span>Iced & Chilled (Crystal Ice)</span>
              </button>
            </div>
          </div>

          {/* 2. Cup Size */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-cafe-600 block mb-2">
              2. Cup Size
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: '8oz', label: '8oz Short' },
                { id: '12oz', label: '12oz Tall' },
                { id: '16oz', label: '16oz Grande' },
                { id: '20oz', label: '20oz Venti' }
              ].map(sz => (
                <button
                  key={sz.id}
                  type="button"
                  onClick={() => handleUpdate({ size: sz.id as any })}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                    config.size === sz.id
                      ? 'bg-cafe-600 text-white border-cafe-600 shadow-sm'
                      : 'bg-cream-50 hover:bg-cream-100 text-cafe-700 border-cream-200'
                  }`}
                >
                  {sz.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Espresso Base & Shots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-cafe-600 block mb-2">
                3. Espresso Roast
              </label>
              <select
                value={config.base}
                onChange={(e) => handleUpdate({ base: e.target.value })}
                className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-xs font-semibold text-cafe-800 focus:outline-none focus:ring-2 focus:ring-cafe-400"
              >
                <option value="Espresso">Ethiopian Single Origin</option>
                <option value="Blonde Espresso">Blonde Light Roast</option>
                <option value="Cold Brew">18hr Cold Brew Steep</option>
                <option value="Decaf">Swiss Water Decaf</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-cafe-600 block mb-2">
                Espresso Shots ({config.shots})
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (config.shots > 1) {
                      baristaAudio.playPour();
                      handleUpdate({ shots: config.shots - 1 });
                    }
                  }}
                  className="w-9 h-9 rounded-xl bg-cream-100 hover:bg-cream-200 text-cafe-800 flex items-center justify-center font-bold text-sm"
                >
                  <Minus size={14} />
                </button>
                <div className="font-serif font-bold text-base text-cafe-900 w-16 text-center">
                  {config.shots} {config.shots === 1 ? 'shot' : 'shots'}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (config.shots < 4) {
                      baristaAudio.playPour();
                      handleUpdate({ shots: config.shots + 1 });
                    }
                  }}
                  className="w-9 h-9 rounded-xl bg-cream-100 hover:bg-cream-200 text-cafe-800 flex items-center justify-center font-bold text-sm"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* 4. Milk Alternative & Sweetness */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-cafe-600 block mb-2">
                4. Milk Selection
              </label>
              <select
                value={config.milk}
                onChange={(e) => handleUpdate({ milk: e.target.value })}
                className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-xs font-semibold text-cafe-800 focus:outline-none focus:ring-2 focus:ring-cafe-400"
              >
                <option value="none">No Milk (Black)</option>
                <option value="oat">Barista Oat Milk (+₹35)</option>
                <option value="almond">Silk Almond Milk (+₹35)</option>
                <option value="whole">Organic Whole Milk</option>
                <option value="sweet-cream">Vanilla Sweet Cream (+₹45)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-cafe-600 block mb-2">
                Sweetness ({config.sweetness}%)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 25, 50, 100].map(sw => (
                  <button
                    key={sw}
                    type="button"
                    onClick={() => handleUpdate({ sweetness: sw })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      config.sweetness === sw
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-cream-50 text-cafe-700 border-cream-200'
                    }`}
                  >
                    {sw}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Artisanal Syrup & Pumps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-cafe-600 block mb-2">
                5. Syrup Flavor
              </label>
              <select
                value={config.syrup}
                onChange={(e) => handleUpdate({
                  syrup: e.target.value,
                  syrupPumps: e.target.value === 'none' ? 0 : Math.max(1, config.syrupPumps)
                })}
                className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-xs font-semibold text-cafe-800 focus:outline-none focus:ring-2 focus:ring-cafe-400"
              >
                <option value="none">None</option>
                <option value="vanilla">Madagascar Vanilla</option>
                <option value="caramel">Salted Butter Caramel</option>
                <option value="hazelnut">Roasted Hazelnut</option>
                <option value="mocha">Dark Belgian Mocha</option>
                <option value="brown-sugar">Cinnamon Brown Sugar</option>
              </select>
            </div>

            {config.syrup !== 'none' && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-cafe-600 block mb-2">
                  Syrup Pumps ({config.syrupPumps})
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (config.syrupPumps > 1) {
                        handleUpdate({ syrupPumps: config.syrupPumps - 1 });
                      } else {
                        handleUpdate({ syrupPumps: 0, syrup: 'none' });
                      }
                    }}
                    className="w-9 h-9 rounded-xl bg-cream-100 hover:bg-cream-200 text-cafe-800 flex items-center justify-center font-bold text-sm"
                  >
                    <Minus size={14} />
                  </button>
                  <div className="font-serif font-bold text-base text-cafe-900 w-16 text-center">
                    {config.syrupPumps} {config.syrupPumps === 1 ? 'pump' : 'pumps'}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (config.syrupPumps < 5) {
                        handleUpdate({ syrupPumps: config.syrupPumps + 1 });
                      }
                    }}
                    className="w-9 h-9 rounded-xl bg-cream-100 hover:bg-cream-200 text-cafe-800 flex items-center justify-center font-bold text-sm"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 6. Latte Art (for Hot drinks) */}
          {!isIced && config.milk !== 'none' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-cafe-600 block mb-2">
                6. Barista Latte Art Design
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'heart', label: '❤️ Heart' },
                  { id: 'rosette', label: '🌿 Rosette' },
                  { id: 'tulip', label: '🌷 Tulip' },
                  { id: 'swan', label: '🦢 Swan' }
                ].map(art => (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => handleUpdate({ latteArt: art.id })}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-colors ${
                      config.latteArt === art.id
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-cream-50 text-cafe-700 border-cream-200'
                    }`}
                  >
                    {art.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action CTA: Add to Tray */}
          <div className="pt-3 border-t border-cream-200">
            <button
              type="button"
              onClick={handleAddCupToCart}
              disabled={isAdded}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-card hover:shadow-lift ${
                isAdded
                  ? 'bg-sage-500 text-white'
                  : 'bg-cafe-600 hover:bg-cafe-700 text-white'
              }`}
            >
              {isAdded ? (
                <>
                  <span>✓ Added to Order Tray!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>Add Custom Cup to Tray • ₹{metrics.totalPrice}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
