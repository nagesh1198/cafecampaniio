import React from 'react';
import { Coffee, ShoppingBag, Sparkles, User, ShieldCheck, Compass, MessageSquare, Award } from 'lucide-react';
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
  onOpenAI
}) => {
  return (
    <>
      {/* Desktop / Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 py-3">
          {/* Brand */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-cafe-600 text-white flex items-center justify-center shadow-sm group-hover:bg-cafe-700 transition-colors">
              <Coffee size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl text-cafe-900 tracking-tight">
                  Café Companion
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cream-200 text-cafe-600">
                  AI Platform
                </span>
              </div>
              <div className="text-xs text-cafe-500 font-medium">
                Your café, smarter.
              </div>
            </div>
          </div>

          {/* Primary Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-cream-100/70 p-1.5 rounded-xl border border-cream-200/60">
            {[
              { id: 'home', label: 'Home' },
              { id: 'studio', label: '☕ Craft Studio' },
              { id: 'discover', label: 'Discover Cafés' },
              { id: 'menu', label: 'Order Menu' },
              { id: 'games', label: 'Play & Earn' },
              { id: 'openspace', label: 'Open Space' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  currentTab === tab.id
                    ? 'bg-white text-cafe-900 shadow-sm font-semibold'
                    : 'text-cafe-600 hover:text-cafe-900'
                }`}
              >
                {tab.label}
              </button>
            ))}

          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Ask Café AI Floating Trigger */}
            <button
              onClick={onOpenAI}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200/60 transition-colors shadow-sm"
            >
              <Sparkles size={14} className="text-amber-600" />
              <span>Café AI</span>
            </button>

            {/* Points Wallet Pill */}
            <button
              onClick={onOpenRewards}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-cafe-800 text-xs font-semibold border border-cream-200 transition-colors"
              title="Café Points Wallet & Rewards"
            >
              <span>🪙</span>
              <span>{pointsBalance} pts</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-white hover:bg-cream-50 text-cafe-800 border border-cream-200 transition-colors shadow-sm"
              title="View Cart"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-cafe-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Role Switcher (Customer vs Staff Dashboard) */}
            <div className="flex items-center bg-cream-200/70 p-1 rounded-xl text-xs font-medium border border-cream-300/60">
              <button
                onClick={() => onRoleChange('CUSTOMER')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  role === 'CUSTOMER'
                    ? 'bg-white text-cafe-900 font-bold shadow-sm'
                    : 'text-cafe-600 hover:text-cafe-900'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => onRoleChange('CAFE_STAFF')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  role !== 'CUSTOMER'
                    ? 'bg-cafe-600 text-white font-bold shadow-sm'
                    : 'text-cafe-600 hover:text-cafe-900'
                }`}
              >
                <ShieldCheck size={13} />
                <span>Staff</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (§23) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-cream-200 flex items-center justify-around py-2 px-1 shadow-lg">
        {[
          { id: 'home', label: 'Home', icon: Coffee },
          { id: 'studio', label: 'Studio', icon: Sparkles },
          { id: 'discover', label: 'Discover', icon: Compass },
          { id: 'menu', label: 'Menu', icon: ShoppingBag },
          { id: 'games', label: 'Play', icon: Award },
          { id: 'openspace', label: 'Open Space', icon: MessageSquare }
        ].map((item) => {

          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-cafe-700 font-bold' : 'text-cafe-400'
              }`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
