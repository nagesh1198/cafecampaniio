import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, Plus, Minus, Check, Loader2, ShoppingBag } from 'lucide-react';
import { MenuItem, CartItem } from '../types';
import { api } from '../services/api';

interface CafeAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  cafeId: string;
  cafeName: string;
  onAddToCart: (item: MenuItem) => void;
  cartItems?: CartItem[];
  onOpenCart?: () => void;
  onUpdateQuantity?: (menuItemId: string, delta: number) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  suggestedItems?: MenuItem[];
}

export const CafeAIModal: React.FC<CafeAIModalProps> = ({
  isOpen,
  onClose,
  cafeId,
  cafeName,
  onAddToCart,
  cartItems = [],
  onOpenCart,
  onUpdateQuantity
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I'm **Café AI**, your personal barista assistant for **${cafeName}** powered by Google Gemini.\n\nTell me what you're craving, your budget, or dietary preferences, and I will recommend real items from our live menu!`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await api.askCafeAI(query, cafeId);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply,
        suggestedItems: data.suggestedItems
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `I'd recommend our **Iced Americano** (₹150) or **Avocado Sourdough Tartine** (₹240) freshly made at the counter!`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdd = (item: MenuItem) => {
    onAddToCart(item);
  };

  const totalCartCount = cartItems.reduce((acc, ci) => acc + ci.quantity, 0);
  const totalCartPrice = cartItems.reduce((acc, ci) => acc + ci.menuItem.price * ci.quantity, 0);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-cafe-950/60 backdrop-blur-sm animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-cream-200 flex flex-col h-[580px] max-h-[85vh] overflow-hidden my-auto animate-scale-up"
      >
        {/* Header */}
        <div className="p-4 bg-cream-50 border-b border-cream-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-sm">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="font-serif font-bold text-base text-cafe-900 flex items-center gap-1.5">
                <span>Café AI Assistant</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                  Gemini
                </span>
              </div>
              <div className="text-xs text-cafe-500">Live Menu Grounded • {cafeName}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-cafe-400 hover:text-cafe-700 rounded-lg hover:bg-cream-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream-50/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-cafe-600 text-white rounded-br-none shadow-sm'
                    : 'bg-white text-cafe-900 rounded-bl-none shadow-soft border border-cream-200'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {/* Attached Interactive Menu Item Cards */}
                {m.suggestedItems && m.suggestedItems.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-cream-100 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-cafe-500">
                      Recommended from Live Menu:
                    </div>
                    {m.suggestedItems.map((item) => {
                      const inCartItem = cartItems.find(ci => ci.menuItem.id === item.id);
                      const inCartQty = inCartItem?.quantity || 0;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-cream-50 border border-cream-200/80 gap-3"
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-semibold text-xs text-cafe-900">{item.name}</div>
                              <div className="text-[11px] text-cafe-500">₹{item.price} • {item.preparationTimeMinutes} min</div>
                            </div>
                          </div>

                          {inCartQty > 0 ? (
                            <div className="flex items-center gap-1 bg-sage-50 border border-sage-300 rounded-lg p-0.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onUpdateQuantity) {
                                    onUpdateQuantity(item.id, -1);
                                  }
                                }}
                                className="w-6 h-6 rounded-md bg-white hover:bg-red-50 text-cafe-700 hover:text-red-600 border border-sage-200 flex items-center justify-center font-bold text-xs transition-colors"
                                title="Remove one from tray"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="text-[11px] font-bold text-sage-800 flex items-center gap-1 px-1 min-w-[42px] justify-center">
                                <Check size={11} className="text-sage-600" />
                                <span>{inCartQty}</span>
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onUpdateQuantity) {
                                    onUpdateQuantity(item.id, 1);
                                  } else {
                                    handleQuickAdd(item);
                                  }
                                }}
                                className="w-6 h-6 rounded-md bg-sage-600 hover:bg-sage-700 text-white flex items-center justify-center font-bold text-xs shadow-xs transition-colors"
                                title="Add one more to tray"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleQuickAdd(item)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 bg-cafe-600 hover:bg-cafe-700 text-white shadow-sm transition-all"
                            >
                              <Plus size={12} />
                              <span>Add to Tray</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-cafe-500 text-xs py-2 px-3 bg-white rounded-xl shadow-soft w-fit border border-cream-200">
              <Loader2 size={14} className="animate-spin text-amber-500" />
              <span>Café AI is consulting the live roastery menu...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips (§8) */}
        <div className="px-4 py-2 bg-cream-50 border-t border-cream-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            "Under ₹250 & not too sweet",
            "I have 10 minutes",
            "What goes with a flat white?",
            "High-protein vegetarian",
            "Best cold brew drink"
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="text-xs font-medium whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-cream-100 text-cafe-700 border border-cream-200 transition-colors shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Live Tray Footer Bar if Items Added */}
        {totalCartCount > 0 && onOpenCart && (
          <div className="px-4 py-2.5 bg-sage-50 border-t border-sage-200 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2 text-xs text-sage-900 font-medium">
              <ShoppingBag size={14} className="text-sage-700" />
              <span>Tray has <strong className="font-bold">{totalCartCount} item{totalCartCount > 1 ? 's' : ''}</strong> (₹{totalCartPrice})</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenCart();
              }}
              className="text-xs font-bold text-sage-800 bg-white hover:bg-sage-100 px-2.5 py-1 rounded-md border border-sage-300 transition-colors shadow-2xs"
            >
              View Tray →
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-cream-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Café AI (e.g. 'I want something cold under ₹200')..."
            className="flex-1 bg-cream-50 border border-cream-200 rounded-xl px-3.5 py-2.5 text-sm text-cafe-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-cafe-600 hover:bg-cafe-700 text-white disabled:opacity-40 transition-colors shadow-sm"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
