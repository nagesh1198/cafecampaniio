import React from 'react';
import { 
  Coffee, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  Award, 
  UtensilsCrossed, 
  Wand2, 
  Home,
  Users,
  Coins,
  UserCheck
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  role: UserRole;
  onRoleChange: (newRole: UserRole) => void;
  cartCount: number;
  onOpenCart: () => void;
  pointsBalance: number;
  onOpenRewards: () => void;
  onOpenAI: () => void;
  openSpaceCount?: number;
  isOpenSpaceOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  role,
  onRoleChange,
  cartCount,
  onOpenCart,
  pointsBalance,
  onOpenRewards,
  onOpenAI,
  openSpaceCount = 0,
  isOpenSpaceOpen = false
}) => {
  // Navigation tabs with adaptive label lengths per breakpoint
  const NAV_ITEMS = [
    { id: 'home', label: 'Home', fullLabel: 'Home', shortLabel: 'Home', icon: Home },
    { id: 'discover', label: 'Cafés', fullLabel: 'Discover Cafés', shortLabel: 'Cafés', icon: Compass },
    { id: 'menu', label: 'Menu', fullLabel: 'Order Menu', shortLabel: 'Menu', icon: UtensilsCrossed },
    { id: 'studio', label: 'Studio', fullLabel: 'Craft Studio', shortLabel: 'Studio', icon: Wand2 },
    { id: 'games', label: 'Earn', fullLabel: 'Play & Earn', shortLabel: 'Earn', icon: Award },
    { 
      id: 'openspace', 
      label: 'Space', 
      fullLabel: 'Open Space', 
      shortLabel: 'Space',
      icon: Users, 
      badge: openSpaceCount > 0 ? `${openSpaceCount}` : undefined
    }
  ];

  return (
    <>
      {/* Sticky Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cream-200/80 shadow-soft w-full">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 h-15 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-3">
          
          {/* 1. Left: Brand Logo & Title */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group shrink-0"
            title="Return to Home"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cafe-700 via-cafe-600 to-cafe-800 text-amber-200 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:shadow transition-all shrink-0">
              <Coffee size={18} className="stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-base sm:text-lg text-cafe-900 tracking-tight leading-none group-hover:text-cafe-700 transition-colors whitespace-nowrap">
                  Café Companion
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-cream-200 text-cafe-700 border border-cream-300 whitespace-nowrap hidden 2xl:inline-block">
                  Specialty AI
                </span>
              </div>
              <div className="text-[10px] text-cafe-500 font-medium leading-none mt-1 truncate hidden xl:block">
                Specialty Roastery & Smart Ordering
              </div>
            </div>
          </div>

          {/* 2. Center: Primary Desktop Navigation (Appears on xl: 1280px+ or lg with compact sizing) */}
          <nav className="hidden lg:flex items-center gap-0.5 bg-cream-100/90 p-1 rounded-2xl border border-cream-200/80 shadow-inner shrink-0">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = (item.id === 'openspace' && isOpenSpaceOpen) || (currentTab === item.id && !isOpenSpaceOpen);

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center gap-1 px-2 xl:px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-cafe-900 shadow-xs border border-cream-300/60 font-bold'
                      : 'text-cafe-600 hover:text-cafe-900 hover:bg-white/60 font-medium'
                  }`}
                >
                  <Icon size={14} className={`shrink-0 ${isActive ? 'text-cafe-700 stroke-[2.4]' : 'text-cafe-400 stroke-[2]'}`} />
                  <span className="whitespace-nowrap">
                    {/* Full label on extra-large screens, short clean label on medium-desktop */}
                    <span className="hidden xl:inline">{item.fullLabel}</span>
                    <span className="xl:hidden">{item.label}</span>
                  </span>

                  {item.badge && (
                    <span className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap shrink-0">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{item.badge}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* 3. Right: Action Buttons & Role Switcher */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Café AI Button */}
            <button
              onClick={onOpenAI}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all whitespace-nowrap shrink-0"
              title="Open Café AI Conversational Assistant"
            >
              <Sparkles size={13} className="text-amber-200 animate-pulse shrink-0" />
              <span className="hidden xs:inline">Café AI</span>
              <span className="xs:hidden">AI</span>
            </button>

            {/* Points Wallet Pill */}
            <button
              onClick={onOpenRewards}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-cafe-800 text-xs font-bold border border-cream-200 shadow-xs transition-colors whitespace-nowrap shrink-0"
              title="Café Points Wallet & Rewards"
            >
              <span className="w-4 h-4 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-700 flex items-center justify-center shrink-0">
                <Coins size={11} className="stroke-[2.2]" />
              </span>
              <span className="whitespace-nowrap font-mono tabular-nums">
                {pointsBalance}
                <span className="hidden sm:inline font-sans font-semibold text-cafe-600 ml-1">pts</span>
              </span>
            </button>

            {/* Cart / Tray Trigger Button */}
            <button
              onClick={onOpenCart}
              className="relative p-1.5 sm:p-2 rounded-xl bg-white hover:bg-cream-50 text-cafe-800 border border-cream-200 shadow-xs hover:shadow transition-all shrink-0"
              title="View Order Tray"
            >
              <ShoppingBag size={17} className="text-cafe-700 stroke-[2.2]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-4.5 px-1 rounded-full bg-cafe-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs animate-scale-up">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Role Switcher: Customer vs Staff (Always visible, responsive, guaranteed no horizontal clipping) */}
            <div className="flex items-center bg-cream-200/80 p-0.5 rounded-xl text-xs font-medium border border-cream-300/80 shrink-0">
              <button
                type="button"
                onClick={() => onRoleChange('CUSTOMER')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs transition-all flex items-center gap-1 whitespace-nowrap ${
                  role === 'CUSTOMER'
                    ? 'bg-white text-cafe-900 font-bold shadow-xs'
                    : 'text-cafe-600 hover:text-cafe-900'
                }`}
                title="Customer View"
              >
                <UserCheck size={12} className="shrink-0 hidden sm:inline" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => onRoleChange('CAFE_STAFF')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs transition-all flex items-center gap-1 whitespace-nowrap ${
                  role !== 'CUSTOMER'
                    ? 'bg-cafe-600 text-white font-bold shadow-xs'
                    : 'text-cafe-600 hover:text-cafe-900'
                }`}
                title="Switch to Staff POS / Kitchen Dashboard"
              >
                <ShieldCheck size={12} className="shrink-0" />
                <span>Staff</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile / Tablet Bottom Navigation Bar (Hidden on Desktop lg: 1024px+) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-cream-200 flex items-center justify-around py-2 px-1 shadow-lg">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = (item.id === 'openspace' && isOpenSpaceOpen) || (currentTab === item.id && !isOpenSpaceOpen);

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-medium transition-colors ${
                isActive ? 'text-cafe-800 font-bold' : 'text-cafe-400 hover:text-cafe-600'
              }`}
            >
              <div className="relative">
                <Icon size={18} className={isActive ? 'stroke-[2.5] text-cafe-700' : 'stroke-[1.8]'} />
                {item.id === 'openspace' && openSpaceCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </div>
              <span className="leading-none whitespace-nowrap">{item.shortLabel}</span>

              {/* Active Indicator Micro-dot */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-cafe-700 mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
