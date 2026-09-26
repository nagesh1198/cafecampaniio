import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SplineHero } from './components/SplineHero';
import { CafeDiscovery } from './components/CafeDiscovery';
import { MenuSection } from './components/MenuSection';
import { PlayWaitCenter } from './components/PlayWaitCenter';
import { CafeAIModal } from './components/CafeAIModal';
import { OpenSpaceDrawer } from './components/OpenSpaceDrawer';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { FeedbackModal } from './components/FeedbackModal';
import { CafeDetailsModal } from './components/CafeDetailsModal';
import { StaffDashboard } from './components/StaffDashboard';
import { InteractiveCupStudio } from './components/InteractiveCupStudio';

import { Cafe, MenuItem, CartItem, Order, PointsWallet, UserRole } from './types';
import { api } from './services/api';
import { Sparkles, Coffee, Clock, Heart, Award, ShieldCheck, Star, ArrowRight } from 'lucide-react';

export default function App() {
  // Navigation & Role State
  const [currentTab, setCurrentTab] = useState<'home' | 'studio' | 'discover' | 'menu' | 'games' | 'openspace'>('home');
  const [role, setRole] = useState<UserRole>('CUSTOMER');


  // Core Domain State
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [pointsWallet, setPointsWallet] = useState<PointsWallet>({
    balance: 480,
    todayEarned: 60,
    history: [],
    redemptions: []
  });
  const [openSpaceCount, setOpenSpaceCount] = useState<number>(3);

  // Personalized Recommendation State
  const [personalizedRec, setPersonalizedRec] = useState<any>(null);

  // Modals Open State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isOpenSpaceOpen, setIsOpenSpaceOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isCafeDetailsOpen, setIsCafeDetailsOpen] = useState(false);

  // Initial Load from Backend API
  useEffect(() => {
    // 1. Fetch Cafes
    api.getCafes().then(data => {
      setCafes(data);
      if (data.length > 0) {
        setSelectedCafe(data[0]);
      }
    });

    // 2. Fetch Orders
    api.getOrders().then(ords => {
      setOrders(ords);
      if (ords.length > 0 && ords[0].status !== 'COMPLETED') {
        setActiveTrackingOrder(ords[0]);
      }
    });

    // 3. Fetch Points Wallet
    api.getUserPoints().then(setPointsWallet);
  }, []);

  // Fetch Menu whenever selected café changes
  useEffect(() => {
    if (selectedCafe) {
      api.getMenu(selectedCafe.id).then(setMenuItems);
      api.getWhosHere(selectedCafe.id).then(d => setOpenSpaceCount(d.count));
      api.getAIRecommendation(selectedCafe.id).then(setPersonalizedRec);
    }
  }, [selectedCafe]);

  // Real-time Poll for Orders every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      api.getOrders().then(ords => {
        setOrders(ords);
        if (activeTrackingOrder) {
          const fresh = ords.find(o => o.id === activeTrackingOrder.id);
          if (fresh) setActiveTrackingOrder(fresh);
        }
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [activeTrackingOrder]);

  // Refresh Points
  const refreshPoints = () => {
    api.getUserPoints().then(setPointsWallet);
  };

  // Cart operations
  const handleAddToCart = (item: MenuItem, customizations?: any) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(ci => ci.menuItem.id === item.id);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += 1;
        return next;
      }
      return [...prev, { menuItem: item, quantity: 1, customizations }];
    });
  };

  const handleUpdateCartQuantity = (index: number, delta: number) => {
    setCartItems(prev => {
      const next = [...prev];
      next[index].quantity += delta;
      if (next[index].quantity <= 0) {
        return next.filter((_, i) => i !== index);
      }
      return next;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handlePlaceOrder = async (items: CartItem[], tip: number) => {
    const orderPayload = {
      cafeId: selectedCafe?.id || 'cafe-artisan-roastery',
      customerName: 'Alex Rivera',
      customerId: 'cust-demo-1',
      items: items.map(ci => ({
        menuItemId: ci.menuItem.id,
        name: ci.menuItem.name,
        quantity: ci.quantity,
        price: ci.menuItem.price,
        customizations: ci.customizations
      })),
      tip
    };

    const res = await api.createOrder(orderPayload);
    setCartItems([]);
    setOrders(prev => [res.order, ...prev]);
    setActiveTrackingOrder(res.order);
    setIsTrackingOpen(true);
    refreshPoints();
    return res.order;
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    const updated = await api.updateOrderStatus(orderId, status);
    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    if (activeTrackingOrder?.id === orderId) {
      setActiveTrackingOrder(updated);
    }
  };

  const cartCount = cartItems.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col antialiased selection:bg-cafe-200">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'openspace') {
            setIsOpenSpaceOpen(true);
          } else {
            setCurrentTab(tab as any);
          }
        }}
        role={role}
        onRoleChange={(newRole) => {
          setRole(newRole);
          if (newRole !== 'CUSTOMER') {
            setCurrentTab('home');
          }
        }}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        pointsBalance={pointsWallet.balance}
        onOpenRewards={() => setCurrentTab('games')}
        onOpenAI={() => setIsAIModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12">
        {/* ======================================= */}
        {/* EXPERIENCE 1: CAFE STAFF / ADMIN VIEW  */}
        {/* ======================================= */}
        {role !== 'CUSTOMER' ? (
          <StaffDashboard
            cafeId={selectedCafe?.id || 'cafe-artisan-roastery'}
            cafeName={selectedCafe?.name || 'Artisan Roastery & Lab'}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onRefreshOrders={() => api.getOrders().then(setOrders)}
          />
        ) : (
          /* ======================================= */
          /* EXPERIENCE 2: CUSTOMER VIEW             */
          /* ======================================= */
          <div className="space-y-10">
            {/* TAB: HOME */}
            {currentTab === 'home' && (
              <div className="space-y-10 animate-fade-in">
                {/* Hero Section (§4) */}
                <SplineHero
                  onExploreClick={() => setCurrentTab('discover')}
                  onOpenSpaceClick={() => setIsOpenSpaceOpen(true)}
                  onCraftStudioClick={() => setCurrentTab('studio')}
                  openSpaceCount={openSpaceCount}
                />


                {/* Active Live Order Pill if customer has a live order (§11) */}
                {activeTrackingOrder && activeTrackingOrder.status !== 'COMPLETED' && (
                  <div
                    onClick={() => setIsTrackingOpen(true)}
                    className="p-4 bg-white rounded-2xl border border-amber-300 shadow-card flex items-center justify-between cursor-pointer hover:shadow-lift transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                        ☕
                      </div>
                      <div>
                        <div className="text-xs font-bold text-cafe-900 flex items-center gap-2">
                          <span>Order {activeTrackingOrder.orderNumber} in Progress</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            {activeTrackingOrder.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-cafe-500">
                          Estimated Ready: <strong>{activeTrackingOrder.estimatedReadyTime}</strong> • Tap to watch brewing live
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-cafe-700 underline flex items-center gap-1">
                      <span>View Live Stage</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                )}

                {/* Personalized AI Recommendations Shelf (§8, §9) */}
                {personalizedRec && (
                  <div className="bg-gradient-to-r from-cream-50 to-cream-100 p-5 sm:p-6 rounded-3xl border border-cream-200/80 shadow-soft">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-amber-500" />
                        <h3 className="font-serif font-bold text-base text-cafe-900">
                          {personalizedRec.greeting} Handcrafted Just for You
                        </h3>
                      </div>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                        Gemini Pick
                      </span>
                    </div>

                    <p className="text-xs text-cafe-600 mb-4 max-w-xl">
                      {personalizedRec.reason}
                    </p>

                    {menuItems.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {menuItems.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="bg-white p-3 rounded-2xl border border-cream-200 shadow-soft flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2.5">
                              <img src={item.image} alt={item.name} className="w-11 h-11 rounded-xl object-cover" />
                              <div>
                                <div className="font-bold text-xs text-cafe-900">{item.name}</div>
                                <div className="text-[11px] text-cafe-500">₹{item.price} • {item.preparationTimeMinutes} min</div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="px-3 py-1.5 bg-cafe-600 hover:bg-cafe-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Interactive Cup Studio Hero Card */}
                <div className="bg-gradient-to-r from-amber-500/10 via-cafe-500/10 to-sage-500/10 p-6 rounded-3xl border border-amber-200/60 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-amber-200 text-amber-800 text-xs font-bold shadow-sm">
                      <Sparkles size={13} className="text-amber-500" />
                      <span>Interactive Coffee Studio</span>
                    </div>
                    <h3 className="font-serif font-bold text-2xl text-cafe-900">
                      Craft & Visualize Your Coffee in Real-Time
                    </h3>
                    <p className="text-xs text-cafe-600 max-w-xl leading-relaxed">
                      Experience our dynamic SVG coffee cup graphic with real-time steam wisps, ice physics, liquid layers, and barista audio synthesizer. Tweak your recipe to perfection!
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('studio')}
                    className="px-6 py-3.5 bg-cafe-600 hover:bg-cafe-700 text-white font-bold text-xs rounded-xl shadow-card hover:shadow-lift transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    <span>Launch Interactive Studio</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                {/* Popular Cafés Preview Grid */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-serif font-bold text-xl text-cafe-900">Popular Roasteries Around You</h3>
                      <p className="text-xs text-cafe-500">Live wait times, single-origin roasts & open space presence</p>
                    </div>
                    <button
                      onClick={() => setCurrentTab('discover')}
                      className="text-xs font-bold text-cafe-600 hover:text-cafe-900 flex items-center gap-1"
                    >
                      <span>View All on Map</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {cafes.map((cafe) => (
                      <div
                        key={cafe.id}
                        onClick={() => {
                          setSelectedCafe(cafe);
                          setIsCafeDetailsOpen(true);
                        }}
                        className="bg-white rounded-2xl overflow-hidden border border-cream-200 shadow-soft hover:shadow-card transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <div className="relative h-44 bg-cream-200">
                          <img src={cafe.image} alt={cafe.name} className="w-full h-full object-cover" />
                          <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-sm text-cafe-900 shadow-sm">
                            {cafe.distanceKm} km away
                          </div>
                        </div>

                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              cafe.crowdLevel === 'LOW'
                                ? 'bg-crowd-lowBg text-crowd-lowText'
                                : cafe.crowdLevel === 'MODERATE'
                                ? 'bg-crowd-modBg text-crowd-modText'
                                : 'bg-crowd-busyBg text-crowd-busyText'
                            }`}>
                              {cafe.crowdBadge} ({cafe.estimatedWaitMinutes} min)
                            </span>
                            <div className="flex items-center gap-1 text-xs font-bold text-cafe-800">
                              <Star size={13} className="fill-amber-400 text-amber-400" />
                              <span>{cafe.rating}</span>
                            </div>
                          </div>

                          <h4 className="font-serif font-bold text-base text-cafe-900">{cafe.name}</h4>
                          <p className="text-xs text-cafe-600 line-clamp-2 leading-relaxed">
                            {cafe.tagline}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CRAFT STUDIO */}
            {currentTab === 'studio' && (
              <div className="animate-fade-in space-y-6">
                <InteractiveCupStudio
                  onAddToCart={handleAddToCart}
                  onInstantOrder={(cartItem) => {
                    handleAddToCart(cartItem.menuItem, cartItem.customizations);
                    setIsCartOpen(true);
                  }}
                />
              </div>
            )}

            {/* TAB: DISCOVER */}

            {currentTab === 'discover' && (
              <div className="animate-fade-in space-y-4">
                <div className="mb-2">
                  <h2 className="font-serif font-bold text-2xl text-cafe-900">Café Discovery</h2>
                  <p className="text-xs text-cafe-500">Find nearby roasteries with live crowd status and quiet workspaces.</p>
                </div>
                <CafeDiscovery
                  cafes={cafes}
                  selectedCafeId={selectedCafe?.id}
                  onSelectCafe={(c) => {
                    setSelectedCafe(c);
                    setIsCafeDetailsOpen(true);
                  }}
                />
              </div>
            )}

            {/* TAB: ORDER MENU */}
            {currentTab === 'menu' && (
              <div className="animate-fade-in space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="font-serif font-bold text-2xl text-cafe-900">
                      {selectedCafe?.name || 'Artisan Roastery'} Menu
                    </h2>
                    <p className="text-xs text-cafe-500">Handcrafted espresso, cold brew tonics, and fresh bakery goods.</p>
                  </div>
                  <button
                    onClick={() => setIsAIModalOpen(true)}
                    className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles size={14} className="text-amber-600" />
                    <span>Ask Café AI to Pick</span>
                  </button>
                </div>
                <MenuSection
                  menuItems={menuItems}
                  onAddToCart={handleAddToCart}
                  cafeName={selectedCafe?.name || 'Artisan Roastery'}
                />
              </div>
            )}

            {/* TAB: PLAY & EARN (GAMES & REWARDS) */}
            {currentTab === 'games' && (
              <div className="animate-fade-in space-y-4">
                <div className="mb-2">
                  <h2 className="font-serif font-bold text-2xl text-cafe-900">Play While You Wait</h2>
                  <p className="text-xs text-cafe-500">Play coffee trivia, predict live matches, earn Café Points, and redeem vouchers.</p>
                </div>
                <PlayWaitCenter
                  pointsWallet={pointsWallet}
                  onRefreshPoints={refreshPoints}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Café AI Assistant Trigger (Bottom-Right) */}
      {role === 'CUSTOMER' && (
        <button
          onClick={() => setIsAIModalOpen(true)}
          className="fixed bottom-18 md:bottom-8 right-5 z-40 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-lift flex items-center gap-2 font-bold text-xs transition-all hover:scale-105"
        >
          <Sparkles size={16} />
          <span>Ask Café AI</span>
        </button>
      )}

      {/* MODALS */}
      <CafeAIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        cafeId={selectedCafe?.id || 'cafe-artisan-roastery'}
        cafeName={selectedCafe?.name || 'Artisan Roastery & Lab'}
        onAddToCart={handleAddToCart}
      />

      <OpenSpaceDrawer
        isOpen={isOpenSpaceOpen}
        onClose={() => setIsOpenSpaceOpen(false)}
        cafeId={selectedCafe?.id || 'cafe-artisan-roastery'}
        cafeName={selectedCafe?.name || 'Artisan Roastery & Lab'}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onPlaceOrder={handlePlaceOrder}
      />

      {activeTrackingOrder && (
        <OrderTrackingModal
          isOpen={isTrackingOpen}
          onClose={() => setIsTrackingOpen(false)}
          order={activeTrackingOrder}
          pointsWallet={pointsWallet}
          onRefreshPoints={refreshPoints}
          onOpenFeedback={() => {
            setIsTrackingOpen(false);
            setIsFeedbackOpen(true);
          }}
          onOpenOpenSpace={() => setIsOpenSpaceOpen(true)}
        />
      )}

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        orderId={activeTrackingOrder?.id}
        cafeId={selectedCafe?.id || 'cafe-artisan-roastery'}
        onFeedbackSubmitted={() => {
          refreshPoints();
        }}
      />

      <CafeDetailsModal
        cafe={selectedCafe}
        isOpen={isCafeDetailsOpen}
        onClose={() => setIsCafeDetailsOpen(false)}
        menuItems={menuItems}
        onSelectMenuTab={() => setCurrentTab('menu')}
        onOpenOpenSpace={() => setIsOpenSpaceOpen(true)}
        openSpaceCount={openSpaceCount}
      />
    </div>
  );
}
