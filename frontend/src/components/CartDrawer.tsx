import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Coffee, Sparkles, CheckCircle2 } from 'lucide-react';
import { CartItem, Order } from '../types';
import confetti from 'canvas-confetti';
import { baristaAudio } from './AudioBarista';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onPlaceOrder: (items: CartItem[], tip: number) => Promise<Order>;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder
}) => {
  const [tip, setTip] = useState(20);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, it) => sum + (it.menuItem.price * it.quantity), 0);
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + tax + tip).toFixed(2));

  const handleCheckout = async () => {
    if (items.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    try {
      baristaAudio.playChime();
      await onPlaceOrder(items, tip);
      if (typeof window !== 'undefined') {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
      onClose();
    } catch (err: any) {
      alert(err.message || 'Order failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-cafe-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-cream-200">
        {/* Header */}
        <div className="p-4 bg-cream-50 border-b border-cream-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <h3 className="font-serif font-bold text-base text-cafe-900">Your Fresh Order</h3>
          </div>
          <button onClick={onClose} className="p-1 text-cafe-400 hover:text-cafe-700">
            <X size={18} />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.map((cartItem, idx) => (
            <div
              key={idx}
              className="p-3 bg-cream-50/70 rounded-2xl border border-cream-200/80 flex items-center justify-between gap-3 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <img
                  src={cartItem.menuItem.image}
                  alt={cartItem.menuItem.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-cafe-900">{cartItem.menuItem.name}</div>
                  <div className="text-[11px] text-cafe-500">
                    ₹{cartItem.menuItem.price} each • {cartItem.menuItem.preparationTimeMinutes} min
                  </div>
                  {cartItem.customizations?.size && (
                    <div className="text-[10px] text-cafe-600 font-medium mt-0.5">
                      {cartItem.customizations.size} • {cartItem.customizations.milk || 'Standard'}
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    baristaAudio.playClick();
                    onUpdateQuantity(idx, -1);
                  }}
                  className="w-6 h-6 rounded-lg bg-white border border-cream-300 flex items-center justify-center text-xs text-cafe-700"
                >
                  <Minus size={11} />
                </button>
                <span className="text-xs font-bold text-cafe-900 font-mono w-4 text-center">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={() => {
                    baristaAudio.playClick();
                    onUpdateQuantity(idx, 1);
                  }}
                  className="w-6 h-6 rounded-lg bg-white border border-cream-300 flex items-center justify-center text-xs text-cafe-700"
                >
                  <Plus size={11} />
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-16 text-cafe-400 space-y-2">
              <Coffee size={36} className="mx-auto opacity-30" />
              <p className="text-xs font-medium">Your tray is empty.</p>
              <p className="text-[11px] text-cafe-400">Explore the menu or ask Café AI for tailored suggestions!</p>
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-4 bg-cream-50 border-t border-cream-200 space-y-3">
            {/* Tipping */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-cafe-600">Tip the Barista Crew</span>
              <div className="flex gap-1">
                {[0, 10, 20, 30].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTip(t)}
                    className={`px-2.5 py-0.5 rounded-lg font-bold text-[11px] border transition-colors ${
                      tip === t
                        ? 'bg-cafe-600 text-white border-cafe-600'
                        : 'bg-white text-cafe-700 border-cream-200'
                    }`}
                  >
                    {t === 0 ? 'None' : `₹${t}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-1 text-xs text-cafe-600 pt-1 border-t border-cream-200/60">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-cafe-900 pt-1">
                <span>Total Amount</span>
                <span className="font-serif text-base text-cafe-800 font-extrabold">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Reward Bonus notice */}
            <div className="text-[11px] text-sage-700 bg-sage-50 px-3 py-1.5 rounded-xl border border-sage-200 text-center font-semibold">
              ✨ Placing this order awards <strong className="text-sage-800">+50 Café Points</strong>!
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full py-3 bg-cafe-600 hover:bg-cafe-700 text-white font-bold rounded-xl text-xs shadow-card flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Place Order & Watch Live Brewing</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
