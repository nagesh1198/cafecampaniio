import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  Clock, 
  MapPin, 
  Users, 
  Coffee, 
  ChevronRight, 
  Plus, 
  Minus, 
  Check, 
  ArrowRight,
  Info,
  Calendar
} from 'lucide-react';
import { Cafe, MenuItem, CartItem } from '../types';

interface CafeDetailsModalProps {
  cafe: Cafe | null;
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  onSelectMenuTab: () => void;
  onOpenOpenSpace: () => void;
  openSpaceCount: number;
  onAddToCart?: (item: MenuItem, customizations?: any) => void;
  cartItems?: CartItem[];
  onUpdateQuantity?: (menuItemId: string, delta: number) => void;
}

export const CafeDetailsModal: React.FC<CafeDetailsModalProps> = ({
  cafe,
  isOpen,
  onClose,
  menuItems,
  onSelectMenuTab,
  onOpenOpenSpace,
  openSpaceCount,
  onAddToCart,
  cartItems = [],
  onUpdateQuantity
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'overview'>('menu');

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !cafe) return null;

  const popularItems = menuItems.filter(i => cafe.popularItemIds?.includes(i.id));
  const displayedItems = activeTab === 'menu' ? (popularItems.length > 0 ? popularItems : menuItems.slice(0, 6)) : [];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-cafe-950/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-lg max-h-[85vh] rounded-3xl shadow-2xl border border-cream-200 flex flex-col overflow-hidden my-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Hero Banner Header */}
        <div className="relative h-36 sm:h-40 w-full bg-cream-200 shrink-0">
          <img
            src={cafe.image}
            alt={cafe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cafe-950/90 via-cafe-950/40 to-black/20" />

          {/* Explicit Close Button (High contrast, always visible) */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-cafe-900 flex items-center justify-center shadow-md transition-all hover:scale-105 z-10"
            title="Close popup (Esc)"
          >
            <X size={18} className="stroke-[2.5]" />
          </button>

          {/* Banner Info */}
          <div className="absolute bottom-3 left-4 right-14 text-white">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                cafe.crowdLevel === 'LOW' 
                  ? 'bg-emerald-500 text-white' 
                  : cafe.crowdLevel === 'MODERATE'
                  ? 'bg-amber-500 text-white'
                  : 'bg-red-500 text-white'
              }`}>
                {cafe.crowdBadge} • ~{cafe.estimatedWaitMinutes}m wait
              </span>
              <span className="text-[11px] text-cream-200 flex items-center gap-0.5">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                <strong className="text-white">{cafe.rating}</strong> ({cafe.reviewCount})
              </span>
              <span className="text-[11px] text-cream-300">
                • {cafe.distanceKm} km away
              </span>
            </div>
            <h2 className="font-serif font-bold text-lg sm:text-xl text-white leading-tight truncate">
              {cafe.name}
            </h2>
            <p className="text-[11px] text-cream-200 truncate mt-0.5 opacity-90">
              {cafe.tagline}
            </p>
          </div>
        </div>

        {/* Tab Selection Pill */}
        <div className="px-4 pt-3 pb-1 border-b border-cream-200/80 bg-cream-50/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'menu'
                  ? 'bg-white text-cafe-900 shadow-sm border border-cream-200'
                  : 'text-cafe-600 hover:text-cafe-900'
              }`}
            >
              <Coffee size={13} />
              <span>Menu & Order ({menuItems.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-white text-cafe-900 shadow-sm border border-cream-200'
                  : 'text-cafe-600 hover:text-cafe-900'
              }`}
            >
              <Info size={13} />
              <span>Café Details & Timing</span>
            </button>
          </div>

          <span className="text-[10px] text-cafe-500 font-medium hidden sm:inline">
            Press <kbd className="bg-white px-1 py-0.5 rounded border border-cream-300 text-[9px]">Esc</kbd> to close
          </span>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* TAB 1: MENU & SPECIALTIES */}
          {activeTab === 'menu' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-sm text-cafe-900">
                    Handcrafted Menu for {cafe.name}
                  </h3>
                  <p className="text-[11px] text-cafe-500">
                    Add directly to your tray or open the full catalog
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onSelectMenuTab();
                  }}
                  className="text-xs font-bold text-cafe-700 hover:text-cafe-900 underline flex items-center gap-0.5"
                >
                  <span>Full Catalog</span>
                  <ChevronRight size={13} />
                </button>
              </div>

              {/* Menu Items List */}
              <div className="space-y-2">
                {menuItems.slice(0, 8).map((item) => {
                  const inCartQty = cartItems.find(ci => ci.menuItem.id === item.id)?.quantity || 0;

                  return (
                    <div
                      key={item.id}
                      className="p-2.5 bg-cream-50/80 hover:bg-cream-50 rounded-2xl border border-cream-200 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-11 h-11 rounded-xl object-cover shrink-0 border border-cream-200" 
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-cafe-900 truncate">{item.name}</div>
                          <div className="text-[11px] text-cafe-500 flex items-center gap-1.5 mt-0.5">
                            <span className="font-bold text-cafe-800">₹{item.price}</span>
                            <span>•</span>
                            <span>{item.preparationTimeMinutes}m prep</span>
                            {item.caffeineMg > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-amber-700">{item.caffeineMg}mg caffeine</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls / Add Button */}
                      <div className="shrink-0">
                        {inCartQty > 0 ? (
                          <div className="flex items-center gap-1 bg-sage-50 border border-sage-300 rounded-xl p-1">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, -1)}
                              className="w-6 h-6 rounded-lg bg-white hover:bg-red-50 text-cafe-700 hover:text-red-600 border border-sage-200 flex items-center justify-center font-bold text-xs"
                              title="Decrease"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold text-sage-900 px-1">
                              {inCartQty}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (onUpdateQuantity) onUpdateQuantity(item.id, 1);
                                else if (onAddToCart) onAddToCart(item);
                              }}
                              className="w-6 h-6 rounded-lg bg-sage-600 hover:bg-sage-700 text-white flex items-center justify-center font-bold text-xs"
                              title="Increase"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onAddToCart && onAddToCart(item)}
                            className="px-3 py-1.5 bg-cafe-600 hover:bg-cafe-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 transition-colors"
                          >
                            <Plus size={13} />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: OVERVIEW & DETAILS */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 bg-cream-50 rounded-xl border border-cream-200">
                  <div className="text-[10px] text-cafe-500 font-bold uppercase tracking-wider">Hours & Schedule</div>
                  <div className="text-xs font-bold text-cafe-900 mt-0.5">{cafe.openingHours}</div>
                </div>

                <div className="p-2.5 bg-cream-50 rounded-xl border border-cream-200">
                  <div className="text-[10px] text-cafe-500 font-bold uppercase tracking-wider">Seating & Vibe</div>
                  <div className="text-xs font-bold text-cafe-900 mt-0.5 truncate">{cafe.seatingInfo}</div>
                </div>

                <div className="p-2.5 bg-cream-50 rounded-xl border border-cream-200">
                  <div className="text-[10px] text-cafe-500 font-bold uppercase tracking-wider">Address</div>
                  <div className="text-xs font-bold text-cafe-900 mt-0.5 truncate">{cafe.address}</div>
                </div>

                <div className="p-2.5 bg-cream-50 rounded-xl border border-cream-200">
                  <div className="text-[10px] text-cafe-500 font-bold uppercase tracking-wider">Atmosphere & Vibe</div>
                  <div className="text-xs font-bold text-cafe-900 mt-0.5 truncate">{cafe.atmosphere?.join(', ') || 'Specialty Roastery'}</div>
                </div>
              </div>

              {/* Live Open Space Banner */}
              <div className="p-3 rounded-2xl bg-sage-50 border border-sage-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sage-200 text-sage-800 flex items-center justify-center font-bold text-sm">
                    🌿
                  </div>
                  <div>
                    <div className="text-xs font-bold text-sage-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{openSpaceCount} guests in Open Space</span>
                    </div>
                    <div className="text-[10px] text-sage-700">
                      Co-working desk availability with shared tables
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenOpenSpace();
                  }}
                  className="px-2.5 py-1 bg-sage-600 hover:bg-sage-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Join Desk
                </button>
              </div>

              {/* Best Time to Visit (Compact) */}
              <div className="bg-cream-50 p-3.5 rounded-2xl border border-cream-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-amber-600" />
                    <span className="font-serif font-bold text-xs text-cafe-900">
                      Predicted Traffic Today
                    </span>
                  </div>
                  <span className="text-[9px] bg-white px-1.5 py-0.5 rounded border border-cream-200 text-cafe-600 font-bold">
                    Historical Queue Velocity
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-1.5 pt-1">
                  {cafe.trafficByHour.slice(0, 6).map((item, idx) => {
                    const isPeak = item.traffic === 'Very High' || item.traffic === 'High';
                    const barHeight = Math.max(20, Math.min(100, item.value));
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <div className="h-12 w-full bg-white rounded flex items-end p-0.5 border border-cream-200">
                          <div
                            className={`w-full rounded-sm ${isPeak ? 'bg-amber-400' : 'bg-sage-300'}`}
                            style={{ height: `${barHeight}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-bold text-cafe-700">{item.hour}</span>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[11px] text-cafe-600 italic bg-white p-2.5 rounded-xl border border-cream-200/80 leading-relaxed">
                  "{cafe.bestTimeToVisitNote}"
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Fixed Action Footer with Clear Cancel / Close & Primary Buttons */}
        <div className="p-3 sm:p-4 bg-white border-t border-cream-200 flex items-center gap-2.5 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-cream-300 text-cafe-700 bg-cream-100 hover:bg-cream-200 text-xs font-bold transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onSelectMenuTab();
            }}
            className="flex-1 py-2.5 bg-cafe-600 hover:bg-cafe-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <Coffee size={14} />
            <span>Open Full Menu & Checkout</span>
            <ArrowRight size={13} />
          </button>
        </div>

      </div>
    </div>
  );
};
