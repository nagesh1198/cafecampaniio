import React, { useState, useMemo } from 'react';
import { Search, MapPin, Star, Clock, Filter, Coffee, Wifi, VolumeX, Users, Trees, ChevronRight } from 'lucide-react';
import { Cafe } from '../types';

interface CafeDiscoveryProps {
  cafes: Cafe[];
  onSelectCafe: (cafe: Cafe) => void;
  selectedCafeId?: string;
}

export const CafeDiscovery: React.FC<CafeDiscoveryProps> = ({
  cafes,
  onSelectCafe,
  selectedCafeId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'workFriendly' | 'quiet' | 'social' | 'outdoorSeating'>('all');
  const [maxWaitMinutes, setMaxWaitMinutes] = useState<number>(30);

  const filteredCafes = useMemo(() => {
    return cafes.filter((cafe) => {
      const matchSearch =
        cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cafe.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cafe.atmosphere.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchWait = cafe.estimatedWaitMinutes <= maxWaitMinutes;

      if (!matchSearch || !matchWait) return false;

      if (activeFilter === 'workFriendly') return cafe.amenities.workFriendly;
      if (activeFilter === 'quiet') return cafe.amenities.quiet;
      if (activeFilter === 'social') return cafe.amenities.social;
      if (activeFilter === 'outdoorSeating') return cafe.amenities.outdoorSeating;

      return true;
    });
  }, [cafes, searchQuery, activeFilter, maxWaitMinutes]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-cream-200 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-3.5 text-cafe-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by café name, atmosphere, or location (e.g. Indiranagar, Quiet)..."
              className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-cafe-900 focus:outline-none focus:ring-1 focus:ring-cafe-500"
            />
          </div>

          {/* Wait Time Range Selector */}
          <div className="flex items-center gap-2 bg-cream-50 px-3.5 py-2 rounded-xl border border-cream-200 text-xs font-medium text-cafe-700">
            <Clock size={15} className="text-cafe-500" />
            <span>Max Wait:</span>
            <select
              value={maxWaitMinutes}
              onChange={(e) => setMaxWaitMinutes(Number(e.target.value))}
              className="bg-transparent font-bold text-cafe-900 focus:outline-none cursor-pointer"
            >
              <option value={10}>&le; 10 min</option>
              <option value={15}>&le; 15 min</option>
              <option value={30}>Any wait time</option>
            </select>
          </div>
        </div>

        {/* Atmosphere Filter Pills (§5) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {[
            { id: 'all', label: 'All Cafés', icon: Coffee },
            { id: 'workFriendly', label: 'Work-Friendly', icon: Wifi },
            { id: 'quiet', label: 'Quiet & Calm', icon: VolumeX },
            { id: 'social', label: 'Social & Vibrant', icon: Users },
            { id: 'outdoorSeating', label: 'Outdoor Garden', icon: Trees }
          ].map((flt) => {
            const Icon = flt.icon;
            const isActive = activeFilter === flt.id;
            return (
              <button
                key={flt.id}
                onClick={() => setActiveFilter(flt.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cafe-600 text-white shadow-sm'
                    : 'bg-cream-100 hover:bg-cream-200 text-cafe-700'
                }`}
              >
                <Icon size={13} />
                <span>{flt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Discovery Map (Left) & Café Cards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Google Maps / Light Map Presentation (4 Columns on desktop) */}
        <div className="lg:col-span-5 h-[340px] lg:h-[580px] sticky top-24 rounded-3xl overflow-hidden border border-cream-200 shadow-soft bg-cream-200 relative">
          {/* Custom Styled Light Map Canvas View */}
          <div className="absolute inset-0 bg-[#f4ece3] flex flex-col justify-between p-4">
            {/* Map Roads / Geometry Graphic */}
            <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
              <path d="M-50,120 Q150,90 350,180 T600,140" fill="none" stroke="#e0d5c8" strokeWidth="18" />
              <path d="M80,-30 L160,600" fill="none" stroke="#e0d5c8" strokeWidth="14" />
              <path d="M-30,420 Q200,400 450,520" fill="none" stroke="#e0d5c8" strokeWidth="22" />
              <circle cx="160" cy="220" r="14" fill="#7FA98A" opacity="0.3" />
              <circle cx="280" cy="340" r="14" fill="#E8A94C" opacity="0.3" />
              <circle cx="90" cy="390" r="14" fill="#EF4444" opacity="0.3" />
            </svg>

            {/* Top Map Header */}
            <div className="relative z-10 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-cream-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cafe-800">
                <MapPin size={14} className="text-cafe-600" />
                <span>Bengaluru Technology Hub (Nearby)</span>
              </div>
              <span className="text-[10px] bg-sage-100 text-sage-800 px-2 py-0.5 rounded-full font-bold">
                Google Maps API
              </span>
            </div>

            {/* Map Interactive Pins */}
            <div className="relative z-10 flex flex-col gap-2 my-auto items-center">
              {cafes.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onSelectCafe(c)}
                  className={`cursor-pointer px-3 py-1.5 rounded-xl shadow-card transition-all flex items-center gap-2 ${
                    selectedCafeId === c.id
                      ? 'bg-cafe-600 text-white scale-105'
                      : 'bg-white hover:bg-cream-50 text-cafe-900 border border-cream-200'
                  }`}
                >
                  <span className="text-sm">☕</span>
                  <div className="text-left">
                    <div className="text-xs font-bold">{c.name.split(' ')[0]}</div>
                    <div className="text-[10px] opacity-80">{c.crowdBadge} • {c.distanceKm} km</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Map Footer Info */}
            <div className="relative z-10 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl text-[11px] text-cafe-600 text-center font-medium border border-cream-200 shadow-sm">
              Tap any pin to view live menu, crowd level, and Open Space.
            </div>
          </div>
        </div>

        {/* Café Cards List (7 Columns on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-cafe-500 font-medium px-1">
            <span>Showing {filteredCafes.length} nearby cafés</span>
            <span>Sorted by closest distance</span>
          </div>

          <div className="space-y-4">
            {filteredCafes.map((cafe) => {
              const isSelected = selectedCafeId === cafe.id;
              return (
                <div
                  key={cafe.id}
                  onClick={() => onSelectCafe(cafe)}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer flex flex-col sm:flex-row gap-4 shadow-soft hover:shadow-card ${
                    isSelected
                      ? 'border-cafe-500 ring-2 ring-cafe-100'
                      : 'border-cream-200'
                  }`}
                >
                  {/* Photo thumbnail */}
                  <div className="w-full sm:w-44 h-36 rounded-xl overflow-hidden shrink-0 relative bg-cream-200">
                    <img
                      src={cafe.image}
                      alt={cafe.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-sm text-cafe-800 shadow-sm">
                      {cafe.distanceKm} km away
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Status Badges */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          cafe.crowdLevel === 'LOW'
                            ? 'bg-crowd-lowBg text-crowd-lowText'
                            : cafe.crowdLevel === 'MODERATE'
                            ? 'bg-crowd-modBg text-crowd-modText'
                            : 'bg-crowd-busyBg text-crowd-busyText'
                        }`}>
                          {cafe.crowdBadge} ({cafe.estimatedWaitMinutes} min wait)
                        </span>

                        <div className="flex items-center gap-1 text-xs font-bold text-cafe-800">
                          <Star size={13} className="fill-amber-400 text-amber-400" />
                          <span>{cafe.rating}</span>
                          <span className="text-cafe-400 font-normal">({cafe.reviewCount})</span>
                        </div>
                      </div>

                      <h3 className="font-serif font-bold text-lg text-cafe-900 mb-1">{cafe.name}</h3>
                      <p className="text-xs text-cafe-600 line-clamp-2 leading-relaxed mb-3">
                        {cafe.tagline}
                      </p>

                      {/* Atmosphere Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {cafe.atmosphere.map((atm, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-cream-100 text-cafe-700 font-medium"
                          >
                            {atm}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="flex items-center justify-between pt-2 border-t border-cream-100 text-xs">
                      <span className="text-cafe-500 font-medium">{cafe.openingHours}</span>
                      <span className="font-bold text-cafe-700 hover:text-cafe-900 flex items-center gap-1">
                        <span>View Café & Menu</span>
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredCafes.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-cream-200 text-cafe-400 space-y-2">
                <Coffee size={36} className="mx-auto opacity-30" />
                <p className="text-xs font-medium">No cafés match this filter criteria.</p>
                <button
                  onClick={() => {
                    setActiveFilter('all');
                    setMaxWaitMinutes(30);
                    setSearchQuery('');
                  }}
                  className="text-xs font-bold text-cafe-700 underline"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
