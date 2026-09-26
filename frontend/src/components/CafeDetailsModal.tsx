import React, { useState } from 'react';
import { X, Star, Clock, MapPin, Users, Sparkles, Coffee, ShieldCheck, Heart, ChevronRight } from 'lucide-react';
import { Cafe, MenuItem } from '../types';

interface CafeDetailsModalProps {
  cafe: Cafe | null;
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  onSelectMenuTab: () => void;
  onOpenOpenSpace: () => void;
  openSpaceCount: number;
}

export const CafeDetailsModal: React.FC<CafeDetailsModalProps> = ({
  cafe,
  isOpen,
  onClose,
  menuItems,
  onSelectMenuTab,
  onOpenOpenSpace,
  openSpaceCount
}) => {
  if (!isOpen || !cafe) return null;

  const popularItems = menuItems.filter(i => cafe.popularItemIds.includes(i.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cafe-900/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-cream-200 overflow-hidden my-8">
        {/* Hero Photo Header */}
        <div className="relative h-64 sm:h-72 w-full bg-cream-200">
          <img
            src={cafe.image}
            alt={cafe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cafe-950/80 via-cafe-950/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-cafe-800 backdrop-blur-md shadow-md"
          >
            <X size={18} />
          </button>

          {/* Banner text */}
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                cafe.crowdLevel === 'LOW' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
              }`}>
                {cafe.crowdBadge} • {cafe.estimatedWaitMinutes} min wait
              </span>
              <span className="text-xs text-cream-200">
                Avg prep: {cafe.averagePrepMinutes} min
              </span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white mb-1">
              {cafe.name}
            </h2>
            <p className="text-xs sm:text-sm text-cream-200 line-clamp-2">
              {cafe.tagline}
            </p>
          </div>
        </div>

        {/* Details Content */}
        <div className="p-6 space-y-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-cream-50 rounded-xl border border-cream-200">
              <div className="text-[10px] text-cafe-400 font-bold uppercase tracking-wider">Rating</div>
              <div className="text-sm font-bold text-cafe-900 flex items-center gap-1 mt-0.5">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span>{cafe.rating}</span>
                <span className="text-[10px] text-cafe-400 font-normal">({cafe.reviewCount})</span>
              </div>
            </div>

            <div className="p-3 bg-cream-50 rounded-xl border border-cream-200">
              <div className="text-[10px] text-cafe-400 font-bold uppercase tracking-wider">Hours</div>
              <div className="text-xs font-bold text-cafe-900 mt-0.5">{cafe.openingHours}</div>
            </div>

            <div className="p-3 bg-cream-50 rounded-xl border border-cream-200">
              <div className="text-[10px] text-cafe-400 font-bold uppercase tracking-wider">Seating</div>
              <div className="text-xs font-bold text-cafe-900 mt-0.5 truncate">{cafe.seatingInfo.split(',')[0]}</div>
            </div>

            <div className="p-3 bg-cream-50 rounded-xl border border-cream-200">
              <div className="text-[10px] text-cafe-400 font-bold uppercase tracking-wider">Location</div>
              <div className="text-xs font-bold text-cafe-900 mt-0.5 truncate">{cafe.city} ({cafe.distanceKm} km)</div>
            </div>
          </div>

          {/* Live Open Space Tile (§7, §14) */}
          <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sage-200 text-sage-800 flex items-center justify-center font-bold text-sm">
                🌿
              </div>
              <div>
                <div className="text-xs font-bold text-sage-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
                  <span>{openSpaceCount} guests here are open to connect</span>
                </div>
                <div className="text-[11px] text-sage-700">
                  Shared interests in Technology, Books, and Coffee. Anonymous aliases preserve privacy.
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenOpenSpace();
              }}
              className="px-3 py-1.5 bg-sage-600 hover:bg-sage-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              Open Space →
            </button>
          </div>

          {/* "Best Time to Visit" Feature (§6, §10, §11) */}
          <div className="bg-cream-50 p-5 rounded-2xl border border-cream-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-amber-600" />
                <h4 className="font-serif font-bold text-sm text-cafe-900">
                  Best Time to Visit (Today's Pattern)
                </h4>
              </div>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-cafe-500 font-medium">
                Gemini Predictive Model
              </span>
            </div>

            {/* Traffic by Hour Chart */}
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 pt-2">
              {cafe.trafficByHour.map((item, idx) => {
                const heightPct = Math.max(20, Math.min(100, item.value));
                const isPeak = item.traffic === 'Very High' || item.traffic === 'High';
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <div className="h-20 w-full bg-white rounded-lg flex items-end p-1 border border-cream-200">
                      <div
                        className={`w-full rounded transition-all ${
                          isPeak ? 'bg-amber-400' : 'bg-sage-300'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-cafe-700">{item.hour}</span>
                    <span className="text-[9px] text-cafe-400">{item.traffic}</span>
                  </div>
                );
              })}
            </div>

            {/* Gemini Pattern Explanation */}
            <div className="text-xs text-cafe-600 italic bg-white p-3 rounded-xl border border-cream-200/80 leading-relaxed">
              💬 "{cafe.bestTimeToVisitNote}"
              <span className="block not-italic text-[10px] text-cafe-400 mt-1">
                *Pattern-based estimate from historical barista queue velocity; not a guaranteed fact.
              </span>
            </div>
          </div>

          {/* Popular Menu Picks */}
          {popularItems.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-serif font-bold text-sm text-cafe-900">Popular Roastery Specialties</h4>
                <button
                  onClick={() => {
                    onClose();
                    onSelectMenuTab();
                  }}
                  className="text-xs font-bold text-cafe-600 hover:text-cafe-900 underline"
                >
                  View Full Menu ({menuItems.length} items) →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {popularItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-cream-50 rounded-xl border border-cream-200 flex items-center justify-between gap-3 shadow-soft"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <div className="text-xs font-bold text-cafe-900">{item.name}</div>
                        <div className="text-[11px] text-cafe-500">₹{item.price} • {item.preparationTimeMinutes} min</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-2 border-t border-cream-200 flex gap-3">
            <button
              onClick={() => {
                onClose();
                onSelectMenuTab();
              }}
              className="flex-1 py-3 bg-cafe-600 hover:bg-cafe-700 text-white font-bold rounded-xl text-xs shadow-card flex items-center justify-center gap-1.5 transition-colors"
            >
              <Coffee size={15} />
              <span>Browse Full Menu & Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
