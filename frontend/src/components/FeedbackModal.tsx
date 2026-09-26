import React, { useState } from 'react';
import { X, Star, Sparkles, CheckCircle2, Heart } from 'lucide-react';
import { api } from '../services/api';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  cafeId: string;
  onFeedbackSubmitted: (feedback: any) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  orderId,
  cafeId,
  onFeedbackSubmitted
}) => {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [selectedReactions, setSelectedReactions] = useState<string[]>(['Great Coffee', 'Fast Service']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await api.submitFeedback({
        orderId,
        cafeId,
        rating,
        text,
        quickReactions: selectedReactions,
        subRatings: { food: rating, service: rating, waiting: 5, ambience: 5 }
      });

      setIsSuccess(true);
      onFeedbackSubmitted(res.feedback);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch {
      setIsSubmitting(false);
    }
  };

  const toggleReaction = (r: string) => {
    setSelectedReactions(prev =>
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cafe-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lift border border-cream-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-cream-50 border-b border-cream-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">☕</span>
            <div>
              <h3 className="font-serif font-bold text-base text-cafe-900">How was your visit?</h3>
              <p className="text-xs text-cafe-500">Your feedback trains our Gemini AI operations</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-cafe-400 hover:text-cafe-700">
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center text-3xl mx-auto">
              ✓
            </div>
            <h4 className="font-serif font-bold text-lg text-cafe-900">Thank You!</h4>
            <p className="text-xs text-cafe-600">
              Your review was analyzed with Gemini and sent to the barista station. <strong>+25 Café Points</strong> added to your wallet!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Star Rating */}
            <div className="text-center space-y-1">
              <label className="text-xs font-bold text-cafe-600 uppercase tracking-wider block">
                Overall Experience
              </label>
              <div className="flex justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      size={28}
                      className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-cream-300'}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Reactions */}
            <div>
              <label className="text-xs font-bold text-cafe-600 uppercase tracking-wider block mb-2">
                Quick Highlights
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Great Coffee',
                  'Silky Milk',
                  'Quiet & Focused',
                  'Fast Service',
                  'Delicious Food',
                  'Friendly Baristas'
                ].map((tag) => {
                  const isSelected = selectedReactions.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleReaction(tag)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                        isSelected
                          ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                          : 'bg-cream-50 text-cafe-600 border-cream-200 hover:bg-cream-100'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Text Feedback */}
            <div>
              <label className="text-xs font-bold text-cafe-600 uppercase tracking-wider block mb-1">
                Tell us about your coffee & service
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="The single-origin pour-over had incredible floral notes..."
                rows={3}
                className="w-full bg-cream-50 border border-cream-200 rounded-xl p-3 text-xs text-cafe-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-cafe-600 hover:bg-cafe-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles size={14} />
              <span>Submit & Earn +25 Points</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
