import React, { useState } from 'react';
import { X, Sparkles, Send, Coffee, Plus, Check, Loader2 } from 'lucide-react';
import { MenuItem } from '../types';
import { api } from '../services/api';

interface CafeAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  cafeId: string;
  cafeName: string;
  onAddToCart: (item: MenuItem) => void;
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
  onAddToCart
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
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);

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
    setAddedItemIds(prev => [...prev, item.id]);
    setTimeout(() => {
      setAddedItemIds(prev => prev.filter(id => id !== item.id));
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cafe-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lift border border-cream-200 flex flex-col h-[600px] max-h-[90vh] overflow-hidden">
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
                      const isAdded = addedItemIds.includes(item.id);
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
                          <button
                            onClick={() => handleQuickAdd(item)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                              isAdded
                                ? 'bg-sage-400 text-white'
                                : 'bg-cafe-600 hover:bg-cafe-700 text-white shadow-sm'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check size={12} />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <Plus size={12} />
                                <span>Add</span>
                              </>
                            )}
                          </button>
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
