import React, { useState, useMemo } from 'react';
import { Plus, Check, Filter, Sparkles, Coffee } from 'lucide-react';
import { MenuItem, CartItem } from '../types';
import { InteractiveCupStudio } from './InteractiveCupStudio';


interface MenuSectionProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem, customizations?: any) => void;
  cafeName: string;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  menuItems,
  onAddToCart,
  cafeName
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);

  // Item customization modal
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedSize, setSelectedSize] = useState('12oz');
  const [selectedMilk, setSelectedMilk] = useState('Whole Milk');
  const [selectedSweetness, setSelectedSweetness] = useState('50%');

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

  const handleQuickAdd = (item: MenuItem) => {
    onAddToCart(item);
    setAddedItemIds(prev => [...prev, item.id]);
    setTimeout(() => {
      setAddedItemIds(prev => prev.filter(id => id !== item.id));
    }, 1800);
  };

  const handleConfirmCustomization = () => {
    if (!customizingItem) return;
    onAddToCart(customizingItem, {
      size: selectedSize,
      milk: selectedMilk,
      sweetness: selectedSweetness
    });
    setAddedItemIds(prev => [...prev, customizingItem.id]);
    setCustomizingItem(null);
    setTimeout(() => {
      setAddedItemIds(prev => prev.filter(id => id !== customizingItem.id));
    }, 1800);
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
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cafe-600 text-white shadow-sm'
                    : 'bg-cream-50 hover:bg-cream-100 text-cafe-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const isAdded = addedItemIds.includes(item.id);
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-cream-200 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo */}
                <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-cream-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-extrabold bg-white/95 backdrop-blur-sm text-cafe-900 shadow-sm font-mono">
                    ₹{item.price}
                  </div>
                  {item.isPopular && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1">
                      <Sparkles size={11} /> Barista Favorite
                    </div>
                  )}
                </div>

                {/* Details */}
                <h3 className="font-serif font-bold text-base text-cafe-900 mb-1">{item.name}</h3>
                <p className="text-xs text-cafe-600 leading-relaxed line-clamp-2 mb-3">
                  {item.description}
                </p>

                {/* Nutritional Tags */}
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
                  onClick={() => setCustomizingItem(item)}
                  className="px-3 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-cafe-700 font-semibold text-xs transition-colors"
                >
                  Customize
                </button>
                <button
                  onClick={() => handleQuickAdd(item)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isAdded
                      ? 'bg-sage-400 text-white'
                      : 'bg-cafe-600 hover:bg-cafe-700 text-white shadow-sm'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={14} />
                      <span>Added to Tray</span>
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      <span>Add to Tray</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Coffee Cup Studio Modal */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cafe-900/40 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto my-auto">
            <InteractiveCupStudio
              isModal={true}
              initialPreset={
                customizingItem.name.toLowerCase().includes('cold brew')
                  ? 'cold-brew'
                  : customizingItem.name.toLowerCase().includes('iced mocha')
                  ? 'iced-mocha'
                  : customizingItem.name.toLowerCase().includes('iced')
                  ? 'iced-americano'
                  : customizingItem.name.toLowerCase().includes('latte')
                  ? 'vanilla-oat-latte'
                  : customizingItem.name.toLowerCase().includes('macchiato')
                  ? 'caramel-macchiato'
                  : 'americano'
              }
              onAddToCart={(item, custom) => {
                onAddToCart(item, custom);
                setCustomizingItem(null);
              }}
              onClose={() => setCustomizingItem(null)}
            />
          </div>
        </div>
      )}

    </div>
  );
};
