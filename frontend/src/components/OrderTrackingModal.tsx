import React, { useState, useEffect } from 'react';
import { X, Sparkles, Star, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
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
  onCancelOrder?: (orderId: string) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  order,
  pointsWallet,
  onRefreshPoints,
  onOpenFeedback,
  onOpenOpenSpace,
  onCancelOrder
}) => {
  const [showGames, setShowGames] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const isReady = order.status === 'READY' || order.status === 'COMPLETED';
  const isCancellable = (order.status === 'NEW' || order.status === 'PREPARING') && !isReady;

  const handleConfirmCancel = async () => {
    if (!onCancelOrder) return;
    setIsCancelling(true);
    try {
      await onCancelOrder(order.id);
      setShowCancelConfirm(false);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-cafe-900/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-cream-50 w-full max-w-md max-h-[88vh] rounded-3xl shadow-2xl border border-cream-200 flex flex-col overflow-hidden my-auto animate-scale-up"
      >
        {/* Header - Fixed & Always Visible */}
        <div className="p-3.5 sm:p-4 bg-white border-b border-cream-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              ☕
            </div>
            <div>
              <div className="font-serif font-bold text-sm text-cafe-900 leading-tight">
                Live Brewing Station
              </div>
              <div className="text-[11px] text-cafe-500">
                Order <span className="font-semibold text-cafe-700">{order.orderNumber}</span> • {order.status}
              </div>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full bg-cream-100 hover:bg-cream-200 text-cafe-700 transition-colors"
            title="Close popup (Order continues tracking in background)"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-4 space-y-3.5 overflow-y-auto flex-1 text-xs">
          
          {/* Cancel Order Confirmation Prompt */}
          {showCancelConfirm ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3 animate-fade-in">
              <div className="flex items-start gap-2.5">
                <AlertCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-sm text-rose-900">
                    Cancel Order {order.orderNumber}?
                  </h4>
                  <p className="text-[11px] text-rose-700 mt-1 leading-relaxed">
                    Are you sure you want to cancel this order? The kitchen will stop preparing your beverages.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-3 py-1.5 bg-white hover:bg-rose-100/60 text-cafe-700 font-bold text-[11px] rounded-xl border border-cream-300 transition-colors"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={isCancelling}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {isCancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Real-time Visual Brewing Cup Component (Compact) */}
              <BrewingVisualizer
                status={order.status}
                stepIndex={order.stepIndex}
                estimatedReadyTime={order.estimatedReadyTime}
                orderNumber={order.orderNumber}
              />

              {/* Ready State Banner */}
              {isReady ? (
                <div className="p-3.5 bg-sage-50 border border-sage-200 rounded-2xl text-center space-y-1.5 animate-fade-in">
                  <div className="text-xl">🎉</div>
                  <h4 className="font-serif font-bold text-sm text-sage-900">
                    Your Order is Ready at the Counter!
                  </h4>
                  <p className="text-[11px] text-sage-700 max-w-xs mx-auto leading-relaxed">
                    Freshly extracted. Show order <strong>{order.orderNumber}</strong> at pickup.
                  </p>
                  <div className="pt-1 flex justify-center gap-2">
                    <button
                      onClick={onOpenFeedback}
                      className="px-3.5 py-1.5 bg-sage-600 hover:bg-sage-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                    >
                      <Star size={13} />
                      <span>Rate Your Experience (+25 pts)</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* While You Wait Quick Interaction Cards */
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-cafe-900">
                        While you wait (~{order.estimatedMinutes} min)
                      </h4>
                      <p className="text-[10px] text-cafe-500">Earn points or explore the lounge</p>
                    </div>
                    <button
                      onClick={() => setShowGames(!showGames)}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-800 underline"
                    >
                      {showGames ? 'Hide Games' : 'Coffee Games →'}
                    </button>
                  </div>

                  {/* Quick Action Tiles */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setShowGames(true)}
                      className="p-2.5 bg-white rounded-xl border border-cream-200 shadow-xs hover:border-amber-200 transition-all text-left flex items-start gap-2"
                    >
                      <span className="text-base">🎮</span>
                      <div>
                        <div className="text-xs font-bold text-cafe-900">Coffee Quiz</div>
                        <div className="text-[10px] text-cafe-500">+60 Points</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenOpenSpace();
                      }}
                      className="p-2.5 bg-white rounded-xl border border-cream-200 shadow-xs hover:border-amber-200 transition-all text-left flex items-start gap-2"
                    >
                      <span className="text-base">🌿</span>
                      <div>
                        <div className="text-xs font-bold text-cafe-900">Open Space</div>
                        <div className="text-[10px] text-cafe-500">Live community</div>
                      </div>
                    </button>
                  </div>

                  {/* Embedded Play While You Wait Center */}
                  {showGames && (
                    <div className="pt-2 animate-fade-in border-t border-cream-200">
                      <PlayWaitCenter
                        pointsWallet={pointsWallet}
                        onRefreshPoints={onRefreshPoints}
                        estimatedWaitMinutes={order.estimatedMinutes}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Order Items Receipt (Clean & Compact) */}
              <div className="p-3 bg-white rounded-xl border border-cream-200 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-cafe-400">
                  <span>Order Items</span>
                  <span>Price</span>
                </div>
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs text-cafe-800">
                    <span>
                      <strong className="text-cafe-900">{it.quantity}x</strong> {it.name}
                    </span>
                    <span className="font-semibold font-mono text-[11px]">
                      ₹{it.price * it.quantity}
                    </span>
                  </div>
                ))}
                <div className="border-t border-cream-100 pt-1.5 flex justify-between font-bold text-xs text-cafe-900">
                  <span>Total Paid</span>
                  <span className="font-mono text-sm text-cafe-900">₹{order.total}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer - Fixed Action Buttons */}
        <div className="p-3 sm:p-3.5 bg-white border-t border-cream-200 shrink-0 flex items-center justify-between gap-2">
          {/* Cancel Order trigger */}
          {isCancellable && !showCancelConfirm ? (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              Cancel Order
            </button>
          ) : (
            <span className="text-[10px] text-cafe-400">
              {isReady ? 'Ready for pickup' : 'Live tracking active'}
            </span>
          )}

          {/* Dismiss / Continue Browsing button */}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cafe-600 hover:bg-cafe-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>Continue Browsing</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
