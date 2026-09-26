import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Send,
  Users,
  ShieldCheck,
  ChevronRight,
  Flame
} from 'lucide-react';
import { Order, MenuItem, OperationalInsight } from '../types';
import { api } from '../services/api';

interface StaffDashboardProps {
  cafeId: string;
  cafeName: string;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: string) => void;
  onRefreshOrders: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  cafeId,
  cafeName,
  orders,
  onUpdateOrderStatus,
  onRefreshOrders
}) => {
  const [activeTab, setActiveTab] = useState<'kanban' | 'menu' | 'insights' | 'adminAi'>('kanban');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [stats, setStats] = useState<any>({
    ordersToday: 126,
    revenueToday: 28450,
    averageWaitMinutes: 11,
    customerSatisfaction: 4.8,
    currentQueueCount: 3,
    popularItemName: 'Iced Americano',
    popularItemUnits: 38
  });
  const [insights, setInsights] = useState<OperationalInsight[]>([]);

  // Admin AI Chat State
  const [adminQuery, setAdminQuery] = useState('');
  const [adminAiMessages, setAdminAiMessages] = useState<{ query: string; answer: string }[]>([
    {
      query: "What were our busiest hours today?",
      answer: "Busiest window was **12:00 PM – 1:30 PM** (reaching 24 orders/hour). Average kitchen prep wait was 14.2 minutes."
    }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // New Menu Item Form
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(180);
  const [newItemCategory, setNewItemCategory] = useState<'Coffee' | 'Cold Brew' | 'Food & Snacks'>('Coffee');

  useEffect(() => {
    api.getMenu(cafeId).then(setMenuItems);
    api.getAdminStats(cafeId).then(setStats);
    api.getAdminInsights(cafeId).then(data => setInsights(data.insights));
  }, [cafeId]);

  const handleStatusMove = (orderId: string, nextStatus: string) => {
    onUpdateOrderStatus(orderId, nextStatus);
  };

  const handleToggleAvailability = (item: MenuItem) => {
    const updated = !item.available;
    setMenuItems(prev =>
      prev.map(i => i.id === item.id ? { ...i, available: updated } : i)
    );
  };

  const handleAskAdminAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminQuery.trim() || isAiLoading) return;

    const q = adminQuery;
    setAdminQuery('');
    setIsAiLoading(true);

    try {
      const res = await api.askAdminAI(q, cafeId);
      setAdminAiMessages(prev => [...prev, { query: q, answer: res.answer }]);
    } catch {
      setAdminAiMessages(prev => [
        ...prev,
        {
          query: q,
          answer: "Today you have 126 orders with ₹28,450 revenue. The barista queue is running smoothly with an average wait time of 11 minutes."
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Group orders for Kanban
  const newOrders = orders.filter(o => o.status === 'NEW');
  const preparingOrders = orders.filter(o => o.status === 'PREPARING');
  const readyOrders = orders.filter(o => o.status === 'READY');
  const completedOrders = orders.filter(o => o.status === 'COMPLETED');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-cream-200 shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sage-500 animate-pulse" />
            <h2 className="font-serif font-bold text-xl text-cafe-900">{cafeName}</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-cafe-100 text-cafe-700 px-2 py-0.5 rounded">
              Staff Portal
            </span>
          </div>
          <p className="text-xs text-cafe-500 mt-0.5">
            Real-time kitchen order queue, menu availability, and Gemini operational analytics.
          </p>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-cream-100 p-1.5 rounded-xl border border-cream-200">
          {[
            { id: 'kanban', label: 'Live Orders' },
            { id: 'menu', label: 'Menu Catalog' },
            { id: 'insights', label: 'AI Room Insights' },
            { id: 'adminAi', label: 'Admin Assistant' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-cafe-900 shadow-sm'
                  : 'text-cafe-600 hover:text-cafe-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards (§16) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Today's Orders", val: stats.ordersToday, icon: Coffee, color: 'text-cafe-900' },
          { label: 'Gross Revenue', val: `₹${stats.revenueToday.toLocaleString()}`, icon: TrendingUp, color: 'text-sage-600' },
          { label: 'Avg Wait Time', val: `${stats.averageWaitMinutes} min`, icon: Clock, color: 'text-amber-600' },
          { label: 'Satisfaction', val: `${stats.customerSatisfaction} / 5`, icon: Sparkles, color: 'text-amber-500' },
          { label: 'Live Queue', val: `${newOrders.length + preparingOrders.length} orders`, icon: Flame, color: 'text-rose-600' },
          { label: 'Popular Item', val: stats.popularItemName.split(' ')[0], icon: Award, color: 'text-cafe-700' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft">
            <div className="text-[11px] font-semibold text-cafe-400 mb-1">{kpi.label}</div>
            <div className={`text-xl font-bold font-serif ${kpi.color}`}>{kpi.val}</div>
          </div>
        ))}
      </div>

      {/* View 1: Live Order Management Kanban (§14, §17) */}
      {activeTab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {/* Column 1: NEW */}
          <div className="bg-cream-100/60 rounded-2xl p-4 border border-cream-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                NEW ({newOrders.length})
              </span>
            </div>
            <div className="space-y-3">
              {newOrders.map((ord) => (
                <div key={ord.id} className="bg-white p-3.5 rounded-xl border border-cream-200 shadow-soft space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cafe-900">{ord.orderNumber}</span>
                    <span className="text-[10px] text-cafe-400 font-medium">₹{ord.total}</span>
                  </div>
                  <div className="text-xs font-semibold text-cafe-700">{ord.customerName}</div>
                  <div className="text-xs text-cafe-500 space-y-0.5">
                    {ord.items.map((it, idx) => (
                      <div key={idx}>• {it.quantity}x {it.name}</div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleStatusMove(ord.id, 'PREPARING')}
                    className="w-full mt-2 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                  >
                    Start Brewing →
                  </button>
                </div>
              ))}
              {newOrders.length === 0 && (
                <div className="text-center py-8 text-xs text-cafe-400">No new orders</div>
              )}
            </div>
          </div>

          {/* Column 2: PREPARING */}
          <div className="bg-cream-100/60 rounded-2xl p-4 border border-cream-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                PREPARING ({preparingOrders.length})
              </span>
            </div>
            <div className="space-y-3">
              {preparingOrders.map((ord) => (
                <div key={ord.id} className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-soft space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cafe-900">{ord.orderNumber}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                      In Cup
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-cafe-700">{ord.customerName}</div>
                  <div className="text-xs text-cafe-500 space-y-0.5">
                    {ord.items.map((it, idx) => (
                      <div key={idx}>• {it.quantity}x {it.name}</div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleStatusMove(ord.id, 'READY')}
                    className="w-full mt-2 py-1.5 bg-sage-500 hover:bg-sage-600 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                  >
                    Mark as Ready ✓
                  </button>
                </div>
              ))}
              {preparingOrders.length === 0 && (
                <div className="text-center py-8 text-xs text-cafe-400">No drinks in prep</div>
              )}
            </div>
          </div>

          {/* Column 3: READY */}
          <div className="bg-cream-100/60 rounded-2xl p-4 border border-cream-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-sage-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sage-500" />
                READY FOR PICKUP ({readyOrders.length})
              </span>
            </div>
            <div className="space-y-3">
              {readyOrders.map((ord) => (
                <div key={ord.id} className="bg-white p-3.5 rounded-xl border border-sage-200 shadow-soft space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cafe-900">{ord.orderNumber}</span>
                    <span className="text-[10px] text-sage-700 font-bold">At Counter</span>
                  </div>
                  <div className="text-xs font-semibold text-cafe-700">{ord.customerName}</div>
                  <button
                    onClick={() => handleStatusMove(ord.id, 'COMPLETED')}
                    className="w-full mt-2 py-1.5 bg-cafe-600 hover:bg-cafe-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                  >
                    Handed to Guest
                  </button>
                </div>
              ))}
              {readyOrders.length === 0 && (
                <div className="text-center py-8 text-xs text-cafe-400">Counter is clear</div>
              )}
            </div>
          </div>

          {/* Column 4: COMPLETED */}
          <div className="bg-cream-100/60 rounded-2xl p-4 border border-cream-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cafe-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cafe-400" />
                COMPLETED ({completedOrders.length})
              </span>
            </div>
            <div className="space-y-2 opacity-80">
              {completedOrders.slice(0, 5).map((ord) => (
                <div key={ord.id} className="bg-white/70 p-3 rounded-xl border border-cream-200 text-xs">
                  <div className="flex justify-between font-bold text-cafe-800">
                    <span>{ord.orderNumber}</span>
                    <span>₹{ord.total}</span>
                  </div>
                  <div className="text-cafe-500 mt-1">{ord.customerName}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View 2: Menu Catalog Management (§15) */}
      {activeTab === 'menu' && (
        <div className="bg-white rounded-2xl p-6 border border-cream-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200">
            <div>
              <h3 className="font-serif font-bold text-lg text-cafe-900">Live Roastery Menu Catalog</h3>
              <p className="text-xs text-cafe-500">Gemini recommendations strictly pull from these active items.</p>
            </div>
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="px-3.5 py-2 bg-cafe-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={14} />
              <span>Add New Item</span>
            </button>
          </div>

          {/* Add Item Drawer */}
          {showAddMenu && (
            <div className="p-4 bg-cream-50 rounded-xl border border-cream-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Item Name (e.g. Vanilla Cold Foam Cold Brew)"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="bg-white border border-cream-200 rounded-lg p-2 text-xs text-cafe-900 font-medium"
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(Number(e.target.value))}
                  className="bg-white border border-cream-200 rounded-lg p-2 text-xs text-cafe-900 font-medium"
                />
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as any)}
                  className="bg-white border border-cream-200 rounded-lg p-2 text-xs text-cafe-900 font-medium"
                >
                  <option value="Coffee">Coffee</option>
                  <option value="Cold Brew">Cold Brew</option>
                  <option value="Food & Snacks">Food & Snacks</option>
                </select>
              </div>
              <button
                onClick={() => {
                  if (!newItemName) return;
                  const item: MenuItem = {
                    id: `item-${Date.now()}`,
                    cafeId,
                    name: newItemName,
                    description: 'Freshly prepared specialty.',
                    price: newItemPrice,
                    category: newItemCategory,
                    available: true,
                    preparationTimeMinutes: 5,
                    tags: ['specialty'],
                    ingredients: ['Single-origin beans'],
                    calories: 120,
                    caffeineMg: 100,
                    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80'
                  };
                  setMenuItems([item, ...menuItems]);
                  setShowAddMenu(false);
                  setNewItemName('');
                }}
                className="px-4 py-2 bg-sage-500 hover:bg-sage-600 text-white rounded-lg text-xs font-bold"
              >
                Save Item to Live Menu
              </button>
            </div>
          )}

          {/* Menu Table */}
          <div className="divide-y divide-cream-100">
            {menuItems.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <div className="font-bold text-xs text-cafe-900">{item.name}</div>
                    <div className="text-[11px] text-cafe-500">₹{item.price} • {item.category} • Prep: {item.preparationTimeMinutes} min</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleAvailability(item)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      item.available
                        ? 'bg-sage-100 text-sage-800 border border-sage-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {item.available ? 'In Stock' : 'Sold Out'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: "Understand the Room" AI Operational Insights (§16, §19) */}
      {activeTab === 'insights' && (
        <div className="bg-white rounded-2xl p-6 border border-cream-200 shadow-soft space-y-4">
          <div className="pb-3 border-b border-cream-200">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              <h3 className="font-serif font-bold text-lg text-cafe-900">
                AI Café Insights — "Understand the Room"
              </h3>
            </div>
            <p className="text-xs text-cafe-500 mt-1">
              Gemini analyzes customer reviews and operational data to surface practical improvements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((ins) => (
              <div
                key={ins.id}
                className="p-5 rounded-2xl bg-cream-50 border border-cream-200/80 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cream-200 text-cafe-700">
                      {ins.category}
                    </span>
                    <span className="text-xs text-sage-600 font-bold">{Math.round(ins.confidence * 100)}% match</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-cafe-900 mb-1.5">{ins.headline}</h4>
                  <p className="text-xs text-cafe-600 leading-relaxed mb-4">{ins.summary}</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-cream-200 text-xs text-cafe-700 font-medium">
                  💡 <strong>Action:</strong> {ins.actionable}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 4: Admin AI Assistant (§20) */}
      {activeTab === 'adminAi' && (
        <div className="bg-white rounded-2xl p-6 border border-cream-200 shadow-soft space-y-4">
          <div className="pb-3 border-b border-cream-200">
            <h3 className="font-serif font-bold text-lg text-cafe-900">Admin Operational AI Assistant</h3>
            <p className="text-xs text-cafe-500">Ask Gemini anything about your store's velocity, peak hours, and feedback.</p>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {adminAiMessages.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="bg-cream-100 text-cafe-900 p-3 rounded-xl text-xs font-semibold max-w-lg">
                  {item.query}
                </div>
                <div className="bg-cream-50 text-cafe-800 p-3.5 rounded-xl text-xs leading-relaxed border border-cream-200 whitespace-pre-line">
                  {item.answer}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAskAdminAI} className="flex gap-2 pt-2 border-t border-cream-200">
            <input
              type="text"
              value={adminQuery}
              onChange={(e) => setAdminQuery(e.target.value)}
              placeholder="Ask Admin AI (e.g. 'What were our most popular items today?')..."
              className="flex-1 bg-cream-50 border border-cream-200 rounded-xl px-3.5 py-2.5 text-xs text-cafe-900 focus:outline-none focus:ring-1 focus:ring-cafe-600"
            />
            <button
              type="submit"
              disabled={isAiLoading || !adminQuery.trim()}
              className="px-4 py-2.5 bg-cafe-600 hover:bg-cafe-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Ask Gemini
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
