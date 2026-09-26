import React, { useState } from 'react';
import { X, Sparkles, MessageSquare, Award, Star } from 'lucide-react';
import { Order, PointsWallet } from '../types';
import { BrewingVisualizer } from './BrewingVisualizer';
import { PlayWaitCenter } from './PlayWaitCenter';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  pointsWallet: PointsWallet;
  onRefreshPoints: () => void;
  onOpenFeedback: () => void;
  onOpenOpenSpace: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  order,
  pointsWallet,
  onRefreshPoints,
  onOpenFeedback,
  onOpenOpenSpace
}) => {
  const [showGames, setShowGames] = useState(false);

  if (!isOpen || !order) return null;

  const isReady = order.status === 'READY' || order.status === 'COMPLETED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cafe-900/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-cream-50 w-full max-w-xl rounded-3xl shadow-2xl border border-cream-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-cream-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
              ☕
            </div>
            <div>
              <div className="font-serif font-bold text-base text-cafe-900">
                Live Brewing Station
              </div>
              <div className="text-xs text-cafe-500">Real-Time Extraction Queue • {order.orderNumber}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-cafe-400 hover:text-cafe-700">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Real-time Visual Brewing Cup Component */}
          <BrewingVisualizer
            status={order.status}
            stepIndex={order.stepIndex}
            estimatedReadyTime={order.estimatedReadyTime}
            orderNumber={order.orderNumber}
          />

          {/* Celebration Banner when Ready (§13) */}
          {isReady ? (
            <div className="p-4 bg-sage-50 border border-sage-200 rounded-2xl text-center space-y-2 animate-fade-in">
              <div className="text-2xl">🎉</div>
              <h4 className="font-serif font-bold text-base text-sage-900">
                Your Order is Ready at the Counter!
              </h4>
              <p className="text-xs text-sage-700 max-w-xs mx-auto leading-relaxed">
                Freshly prepared with golden crema. Please show order <strong>{order.orderNumber}</strong> at pickup.
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={onOpenFeedback}
                  className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  <Star size={13} />
                  <span>Rate Your Experience (+25 pts)</span>
                </button>
              </div>
            </div>
          ) : (
            /* While You Wait Interaction Cards */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-cafe-900">While you wait ({order.estimatedMinutes} min)</h4>
                  <p className="text-[11px] text-cafe-500">Play quick coffee quizzes or connect with guests</p>
                </div>
                <button
                  onClick={() => setShowGames(!showGames)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 underline"
                >
                  {showGames ? 'Hide Games' : 'Open Game Center →'}
                </button>
              </div>

              {/* Quick Action Tiles */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowGames(true)}
                  className="p-3.5 bg-white rounded-2xl border border-cream-200 shadow-soft hover:shadow-card transition-all text-left flex items-start gap-2.5"
                >
                  <span className="text-xl">🎮</span>
                  <div>
                    <div className="text-xs font-bold text-cafe-900">Coffee Quiz</div>
                    <div className="text-[10px] text-cafe-500">Earn +60 Café Points</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenOpenSpace();
                  }}
                  className="p-3.5 bg-white rounded-2xl border border-cream-200 shadow-soft hover:shadow-card transition-all text-left flex items-start gap-2.5"
                >
                  <span className="text-xl">🌿</span>
                  <div>
                    <div className="text-xs font-bold text-cafe-900">Open Space</div>
                    <div className="text-[10px] text-cafe-500">3 guests here to wave</div>
                  </div>
                </button>
              </div>

              {/* Embedded Play While You Wait Center */}
              {showGames && (
                <div className="pt-2 animate-fade-in">
                  <PlayWaitCenter
                    pointsWallet={pointsWallet}
                    onRefreshPoints={onRefreshPoints}
                    estimatedWaitMinutes={order.estimatedMinutes}
                  />
                </div>
              )}
            </div>
          )}

          {/* Items Summary Receipt */}
          <div className="p-4 bg-white rounded-2xl border border-cream-200 shadow-soft space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-cafe-500 mb-1">
              Order Receipt
            </div>
            {order.items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-xs text-cafe-800">
                <span>{it.quantity}x {it.name}</span>
                <span className="font-semibold font-mono">₹{it.price * it.quantity}</span>
              </div>
            ))}
            <div className="border-t border-cream-100 pt-2 flex justify-between font-bold text-xs text-cafe-900">
              <span>Total Paid</span>
              <span className="font-mono text-sm">₹{order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
