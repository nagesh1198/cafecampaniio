import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Minus, Check, Sparkles, Coffee, X, Wand2 } from 'lucide-react';
import { MenuItem, CartItem } from '../types';

interface MenuSectionProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem, customizations?: any) => void;
  cafeName: string;
  cartItems?: CartItem[];
  onUpdateQuantity?: (menuItemId: string, delta: number) => void;
  onNavigateToStudio?: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  menuItems,
  onAddToCart,
  cafeName,
  cartItems = [],
  onUpdateQuantity,
  onNavigateToStudio
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');

  // Item customization modal
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<'8oz' | '12oz' | '16oz' | '20oz'>('12oz');
  const [selectedMilk, setSelectedMilk] = useState('Whole Milk');
  const [selectedSweetness, setSelectedSweetness] = useState('50%');
  const [selectedTemp, setSelectedTemp] = useState<'hot' | 'iced'>('hot');

  // Close customize modal on Escape
  useEffect(() => {
    if (!customizingItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCustomizingItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [customizingItem]);

  const categories = ['All', 'Coffee', 'Cold Brew', 'Tea & Beverages', 'Bakery & Pastries', 'Food & Snacks'];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      if (!matchCat) return false;

      if (dietaryFilter === 'vegetarian') return item.tags.includes('vegetarian');
      if (dietaryFilter === 'vegan') return item.tags.includes('vegan');
      if (dietaryFilter === 'low-sugar') return item.tags.includes('low-sugar');
      if (dietaryFilter === 'high-protein') return item.tags.includes('high-protein');

      return true;
    });
  }, [menuItems, selectedCategory, dietaryFilter]);

  const handleOpenCustomize = (item: MenuItem) => {
    setCustomizingItem(item);
    setSelectedSize('12oz');
    setSelectedMilk(item.category === 'Tea & Beverages' ? 'None' : 'Whole Milk');
    setSelectedSweetness('50%');
    setSelectedTemp(item.name.toLowerCase().includes('iced') || item.category === 'Cold Brew' ? 'iced' : 'hot');
  };

  const calculatedCustomPrice = useMemo(() => {
    if (!customizingItem) return 0;
    let price = customizingItem.price;
    if (selectedSize === '16oz') price += 40;
    if (selectedSize === '20oz') price += 70;
    if (selectedMilk === 'Oat Milk' || selectedMilk === 'Almond Milk') price += 30;
    return price;
  }, [customizingItem, selectedSize, selectedMilk]);

  const handleConfirmCustomization = () => {
    if (!customizingItem) return;
    onAddToCart(customizingItem, {
      size: selectedSize,
      milk: selectedMilk,
      sweetness: selectedSweetness,
      temperature: selectedTemp,
      price: calculatedCustomPrice
    });
    setCustomizingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Category Shelf Bar */}
      <div className="bg-white rounded-2xl p-4 border border-cream-200 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-cafe-500">
            Categories ({filteredItems.length} items)
          </div>
          {/* Dietary Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-cafe-500 font-medium">Dietary:</span>
            <select
              value={dietaryFilter}
              onChange={(e) => setDietaryFilter(e.target.value)}
              className="bg-cream-50 border border-cream-200 rounded-lg px-2 py-1 text-xs font-semibold text-cafe-800"
            >
              <option value="all">All Diets</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">100% Vegan</option>
              <option value="low-sugar">Low Sugar</option>
              <option value="high-protein">High Protein</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cafe-600 text-white shadow-sm'
                    : 'bg-cream-100 hover:bg-cream-200 text-cafe-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Item Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-cream-200 p-4 shadow-card hover:shadow-lift transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Item Image with badging */}
                <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-cream-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-cafe-800 shadow-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                </div>

                {/* Title & Price */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-serif font-bold text-base text-cafe-900 leading-tight">
                    {item.name}
                  </h3>
                  <span className="font-bold text-cafe-800 text-sm whitespace-nowrap">
                    ₹{item.price}
                  </span>
                </div>

                <p className="text-xs text-cafe-500 line-clamp-2 mb-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Dietary / Nutrition Chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-cream-100 text-cafe-600 font-medium">
                    ⏱️ {item.preparationTimeMinutes}m prep
                  </span>
                  {item.calories > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-cream-100 text-cafe-600 font-medium">
                      🔥 {item.calories} cal
                    </span>
                  )}
                  {item.caffeineMg > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-medium">
                      ⚡ {item.caffeineMg}mg
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-cream-100">
                <button
                  type="button"
                  onClick={() => handleOpenCustomize(item)}
                  className="px-3 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-cafe-700 font-semibold text-xs transition-colors"
                  title="Customize size, milk, and sweetness"
                >
                  Customize
                </button>
                {(() => {
                  const cartQuantity = cartItems.find(ci => ci.menuItem.id === item.id)?.quantity || 0;
                  if (cartQuantity > 0) {
                    return (
                      <div className="flex-1 flex items-center justify-between bg-sage-50 border border-sage-300 rounded-xl px-1.5 py-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onUpdateQuantity) {
                              onUpdateQuantity(item.id, -1);
                            }
                          }}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-red-50 text-cafe-700 hover:text-red-600 border border-sage-200 flex items-center justify-center font-bold text-xs transition-colors"
                          title="Remove one from tray"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="text-xs font-bold text-sage-800 flex items-center gap-1">
                          <Check size={13} className="text-sage-600" />
                          <span>{cartQuantity} in Tray</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onUpdateQuantity) {
                              onUpdateQuantity(item.id, 1);
                            } else {
                              onAddToCart(item);
                            }
                          }}
                          className="w-7 h-7 rounded-lg bg-sage-600 hover:bg-sage-700 text-white flex items-center justify-center font-bold text-xs shadow-xs transition-colors"
                          title="Add another"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    );
                  }
                  return (
                    <button
                      onClick={() => onAddToCart(item)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 bg-cafe-600 hover:bg-cafe-700 text-white shadow-sm transition-all"
                    >
                      <Plus size={14} />
                      <span>Add to Tray</span>
                    </button>
                  );
                })()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Compact, Easily Dismissible Item Customization Modal */}
      {customizingItem && (
        <div 
          onClick={() => setCustomizingItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-cafe-950/60 backdrop-blur-sm animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md max-h-[88vh] rounded-3xl shadow-2xl border border-cream-200 flex flex-col overflow-hidden my-auto animate-scale-up"
          >
            {/* Header */}
            <div className="p-4 bg-cream-50 border-b border-cream-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <img 
                  src={customizingItem.image} 
                  alt={customizingItem.name} 
                  className="w-10 h-10 rounded-xl object-cover border border-cream-200" 
                />
                <div>
                  <h3 className="font-serif font-bold text-sm text-cafe-900 leading-tight">
                    Customize {customizingItem.name}
                  </h3>
                  <div className="text-[11px] text-cafe-500 font-medium">
                    Base: ₹{customizingItem.price} • {customizingItem.preparationTimeMinutes}m prep
                  </div>
                </div>
              </div>
              <button
                onClick={() => setCustomizingItem(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-cream-100 text-cafe-700 border border-cream-200 flex items-center justify-center shadow-xs transition-colors"
                title="Close (Esc)"
              >
                <X size={16} />
              </button>
            </div>

            {/* Options Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
              
              {/* Temperature */}
              <div>
                <label className="font-bold text-cafe-700 block mb-1.5 uppercase text-[10px] tracking-wider">
                  Temperature
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTemp('hot')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      selectedTemp === 'hot'
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-cream-50 text-cafe-700 border-cream-200 hover:bg-cream-100'
                    }`}
                  >
                    <span>☕ Hot</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTemp('iced')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      selectedTemp === 'iced'
                        ? 'bg-sky-500 text-white border-sky-600 shadow-xs'
                        : 'bg-cream-50 text-cafe-700 border-cream-200 hover:bg-cream-100'
                    }`}
                  >
                    <span>🧊 Iced</span>
                  </button>
                </div>
              </div>

              {/* Cup Size */}
              <div>
                <label className="font-bold text-cafe-700 block mb-1.5 uppercase text-[10px] tracking-wider">
                  Cup Size
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: '8oz', label: '8oz', sub: 'Short' },
                    { id: '12oz', label: '12oz', sub: 'Standard' },
                    { id: '16oz', label: '16oz', sub: '+₹40' },
                    { id: '20oz', label: '20oz', sub: '+₹70' },
                  ].map(sz => (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => setSelectedSize(sz.id as any)}
                      className={`py-2 px-1 rounded-xl border text-center transition-all ${
                        selectedSize === sz.id
                          ? 'bg-cafe-600 text-white border-cafe-700 shadow-xs font-bold'
                          : 'bg-cream-50 text-cafe-700 border-cream-200 hover:bg-cream-100'
                      }`}
                    >
                      <div className="text-xs font-bold">{sz.label}</div>
                      <div className="text-[9px] opacity-80">{sz.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Milk Option */}
              <div>
                <label className="font-bold text-cafe-700 block mb-1.5 uppercase text-[10px] tracking-wider">
                  Milk Preference
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {[
                    { id: 'Whole Milk', label: 'Whole Milk' },
                    { id: 'Oat Milk', label: 'Oat Milk (+₹30)' },
                    { id: 'Almond Milk', label: 'Almond (+₹30)' },
                    { id: 'Skim Milk', label: 'Skim Milk' },
                    { id: 'None', label: 'Black / None' },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMilk(m.id)}
                      className={`py-2 px-2 rounded-xl border text-center text-[11px] transition-all ${
                        selectedMilk === m.id
                          ? 'bg-cafe-600 text-white border-cafe-700 shadow-xs font-bold'
                          : 'bg-cream-50 text-cafe-700 border-cream-200 hover:bg-cream-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sweetness */}
              <div>
                <label className="font-bold text-cafe-700 block mb-1.5 uppercase text-[10px] tracking-wider">
                  Sweetness Level
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['0%', '25%', '50%', '100%'].map(sw => (
                    <button
                      key={sw}
                      type="button"
                      onClick={() => setSelectedSweetness(sw)}
                      className={`py-1.5 px-2 rounded-xl border text-center text-xs transition-all ${
                        selectedSweetness === sw
                          ? 'bg-cafe-600 text-white border-cafe-700 shadow-xs font-bold'
                          : 'bg-cream-50 text-cafe-700 border-cream-200 hover:bg-cream-100'
                      }`}
                    >
                      {sw}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer with Price and Actions */}
            <div className="p-4 bg-white border-t border-cream-200 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setCustomizingItem(null)}
                className="px-4 py-2.5 rounded-xl border border-cream-300 text-cafe-700 bg-cream-100 hover:bg-cream-200 text-xs font-bold transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmCustomization}
                className="flex-1 py-2.5 bg-cafe-600 hover:bg-cafe-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Add Custom Cup</span>
                <span className="bg-cafe-700 px-2 py-0.5 rounded-md text-amber-200 font-bold ml-1">
                  ₹{calculatedCustomPrice}
                </span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
