import React, { useState, useEffect } from 'react';
import { Award, Trophy, Gamepad2, Gift, CheckCircle2, ChevronRight, Zap, Flame, Clock, Coins } from 'lucide-react';
import { MiniGame, SportsEvent, Reward, PointsWallet } from '../types';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

interface PlayWaitCenterProps {
  pointsWallet: PointsWallet;
  onRefreshPoints: () => void;
  estimatedWaitMinutes?: number;
}

export const PlayWaitCenter: React.FC<PlayWaitCenterProps> = ({
  pointsWallet,
  onRefreshPoints,
  estimatedWaitMinutes = 8
}) => {
  const [activeTab, setActiveTab] = useState<'games' | 'sports' | 'rewards' | 'leaderboard'>('games');
  const [miniGames, setMiniGames] = useState<MiniGame[]>([]);
  const [sportsEvents, setSportsEvents] = useState<SportsEvent[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // Active playing state
  const [activeGame, setActiveGame] = useState<MiniGame | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);

  // Sports prediction state
  const [selectedEvent, setSelectedEvent] = useState<SportsEvent | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [predictionMessage, setPredictionMessage] = useState<string>('');

  // Reward redemption state
  const [redeemedCode, setRedeemedCode] = useState<string>('');

  useEffect(() => {
    api.getGames().then(data => {
      setMiniGames(data.miniGames);
      setSportsEvents(data.sportsEvents);
    });
    api.getRewards().then(setRewards);
    api.getLeaderboard().then(d => setLeaderboard(d.leaderboard));
  }, []);

  const handleStartGame = (game: MiniGame) => {
    setActiveGame(game);
    setAnswers(new Array(game.questions.length).fill(-1));
    setQuizSubmitted(false);
    setQuizResult(null);
  };

  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    const next = [...answers];
    next[qIdx] = optIdx;
    setAnswers(next);
  };

  const handleSubmitQuiz = async () => {
    if (!activeGame) return;
    const res = await api.validateGameAnswers(activeGame.id, answers);
    setQuizResult(res);
    setQuizSubmitted(true);
    onRefreshPoints();

    if (res.pointsEarned > 0 && typeof window !== 'undefined') {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleLockPrediction = async () => {
    if (!selectedEvent || !selectedOptionId) return;
    const res = await api.submitPrediction(selectedEvent.id, selectedOptionId);
    setPredictionMessage(`🎉 Locked in! Potential reward: +${res.potentialWinnings} Café Points.`);
    onRefreshPoints();
    setTimeout(() => {
      setSelectedEvent(null);
      setPredictionMessage('');
    }, 3000);
  };

  const handleRedeemReward = async (reward: Reward) => {
    try {
      const res = await api.redeemReward(reward.id);
      setRedeemedCode(res.voucherCode);
      onRefreshPoints();
      if (typeof window !== 'undefined') {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
      }
    } catch (err: any) {
      alert(err.message || 'Cannot redeem');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-cream-200">
      {/* Wallet Bar Banner */}
      <div className="bg-cream-100 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 mb-6 border border-cream-200/80 shadow-soft">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white flex items-center justify-center shadow-sm shrink-0 border border-amber-300/40">
            <Coins size={22} className="text-amber-100 stroke-[2.2]" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cafe-500 leading-tight">
              Your Café Points Wallet
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-black text-cafe-900 tracking-tight tabular-nums leading-none font-sans">
                {pointsWallet.balance.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-cafe-600 leading-none font-sans">
                Points
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/90 px-3.5 py-1.5 rounded-xl border border-cream-200 shadow-xs text-right">
            <div className="text-[10px] text-cafe-500 font-bold uppercase tracking-wider leading-none">Today's Earnings</div>
            <div className="text-sm font-extrabold text-sage-700 tabular-nums leading-tight mt-0.5 font-sans">+{pointsWallet.todayEarned} pts</div>
          </div>
          <button
            onClick={() => setActiveTab('rewards')}
            className="px-4 py-2.5 bg-cafe-600 hover:bg-cafe-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-[1.02]"
          >
            Redeem Rewards
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-cream-200 pb-3 mb-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'games', label: 'Coffee Mini-Games', icon: Gamepad2 },
          { id: 'sports', label: 'Live Match Predictions', icon: Flame },
          { id: 'rewards', label: 'Rewards Catalog', icon: Gift },
          { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-cafe-600 text-white shadow-sm'
                  : 'bg-cream-50 hover:bg-cream-100 text-cafe-600'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Mini-Games */}
      {activeTab === 'games' && (
        <div>
          {activeGame ? (
            <div className="bg-cream-50 rounded-2xl p-5 border border-cream-200">
              <div className="flex items-center justify-between pb-3 border-b border-cream-200 mb-4">
                <div>
                  <h3 className="font-serif font-bold text-base text-cafe-900">{activeGame.title}</h3>
                  <p className="text-xs text-cafe-500">Reward: +{activeGame.pointsReward} Café Points</p>
                </div>
                <button
                  onClick={() => setActiveGame(null)}
                  className="text-xs font-semibold text-cafe-600 hover:text-cafe-800"
                >
                  ← Exit Quiz
                </button>
              </div>

              {!quizSubmitted ? (
                <div className="space-y-5">
                  {activeGame.questions.map((q, qIdx) => (
                    <div key={qIdx} className="bg-white p-4 rounded-xl border border-cream-200 shadow-soft">
                      <div className="text-xs font-bold text-cafe-800 mb-3">
                        Question {qIdx + 1}: {q.question}
                      </div>
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = answers[qIdx] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectAnswer(qIdx, optIdx)}
                              className={`w-full text-left p-2.5 rounded-lg text-xs font-medium border transition-all ${
                                isSelected
                                  ? 'bg-amber-50 border-amber-400 text-amber-900 font-semibold'
                                  : 'bg-cream-50 hover:bg-cream-100 border-cream-200 text-cafe-700'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleSubmitQuiz}
                    disabled={answers.includes(-1)}
                    className="w-full py-3 bg-cafe-600 hover:bg-cafe-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow-sm"
                  >
                    Submit Answers & Earn Points
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center text-3xl mx-auto">
                    🎉
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xl text-cafe-900">Quiz Completed!</h4>
                    <p className="text-sm text-cafe-600 mt-1">
                      You got <strong>{quizResult?.correctCount}</strong> out of {quizResult?.totalQuestions} correct.
                    </p>
                    <div className="inline-block mt-3 px-4 py-1.5 bg-amber-100 text-amber-800 font-extrabold rounded-full text-sm">
                      +{quizResult?.pointsEarned} Café Points Earned!
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveGame(null)}
                    className="px-6 py-2 bg-cafe-600 hover:bg-cafe-700 text-white rounded-xl text-xs font-bold"
                  >
                    Play Another Game
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {miniGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-cream-50 rounded-2xl p-5 border border-cream-200/80 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                        +{game.pointsReward} Points
                      </span>
                      <span className="text-xs text-cafe-500 font-medium">⏱️ {game.durationMinutes} min</span>
                    </div>
                    <h4 className="font-serif font-bold text-base text-cafe-900 mb-1">{game.title}</h4>
                    <p className="text-xs text-cafe-600 leading-relaxed mb-4">{game.description}</p>
                  </div>

                  <button
                    onClick={() => handleStartGame(game)}
                    className="w-full py-2.5 bg-white hover:bg-cafe-600 hover:text-white text-cafe-800 border border-cream-300 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Gamepad2 size={14} />
                    <span>Play Now</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Sports Match Predictions */}
      {activeTab === 'sports' && (
        <div className="space-y-4">
          <div className="text-xs text-cafe-500">
            Make free predictions on live sporting events while waiting. Points pool is split among winners!
          </div>

          {predictionMessage && (
            <div className="p-3 bg-sage-50 text-sage-800 border border-sage-200 rounded-xl text-xs font-semibold animate-fade-in">
              {predictionMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sportsEvents.map((event) => (
              <div
                key={event.id}
                className="bg-cream-50 rounded-2xl p-5 border border-cream-200/80 shadow-soft"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    {event.status}
                  </span>
                  <span className="text-xs font-semibold text-cafe-600">{event.startTime}</span>
                </div>

                <h4 className="font-serif font-bold text-sm text-cafe-900 mb-1">{event.title}</h4>
                <p className="text-[11px] text-cafe-500 mb-3">{event.tournament} • Pool: {event.pointsPool} pts</p>

                <div className="space-y-2 mb-4">
                  {event.options.map((opt) => {
                    const isSelected = selectedEvent?.id === event.id && selectedOptionId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSelectedEvent(event);
                          setSelectedOptionId(opt.id);
                        }}
                        className={`w-full p-2.5 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold'
                            : 'bg-white hover:bg-cream-100 border-cream-200 text-cafe-800'
                        }`}
                      >
                        <span>{opt.text}</span>
                        <span className="text-xs font-bold text-amber-600">x{opt.multiplier}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedEvent?.id === event.id && (
                  <button
                    onClick={handleLockPrediction}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                  >
                    Lock Prediction (Wager 50 pts)
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Rewards Catalog */}
      {activeTab === 'rewards' && (
        <div>
          {redeemedCode && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center mb-6 space-y-1">
              <div className="text-xs font-bold text-amber-800">🎉 Reward Voucher Generated!</div>
              <div className="text-xl font-mono font-extrabold text-cafe-900 tracking-wider">
                {redeemedCode}
              </div>
              <div className="text-[11px] text-cafe-500">Show this code at the cashier counter or apply at checkout.</div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rewards.map((rew) => {
              const canAfford = pointsWallet.balance >= rew.pointsCost;
              return (
                <div
                  key={rew.id}
                  className="bg-cream-50 rounded-2xl p-4 border border-cream-200/80 shadow-soft flex flex-col justify-between"
                >
                  <div>
                    <div className="text-2xl mb-2">🎁</div>
                    <h4 className="font-serif font-bold text-sm text-cafe-900 mb-1">{rew.title}</h4>
                    <p className="text-xs text-cafe-500 leading-relaxed mb-3">{rew.description}</p>
                  </div>

                  <div>
                    <div className="text-xs font-extrabold text-amber-700 mb-2 font-mono">
                      🪙 {rew.pointsCost} Points
                    </div>
                    <button
                      onClick={() => handleRedeemReward(rew)}
                      disabled={!canAfford}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                        canAfford
                          ? 'bg-cafe-600 hover:bg-cafe-700 text-white shadow-sm'
                          : 'bg-cream-200 text-cafe-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Redeem Voucher' : 'Need More Points'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-3">
          <div className="text-xs text-cafe-500">
            Top Café Companion patrons this month. Anonymous aliases preserve privacy.
          </div>

          <div className="space-y-2">
            {leaderboard.map((user) => (
              <div
                key={user.rank}
                className="flex items-center justify-between p-3.5 rounded-xl bg-cream-50 border border-cream-200/70"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    user.rank === 1 ? 'bg-amber-400 text-white' : user.rank === 2 ? 'bg-slate-300 text-slate-800' : 'bg-cream-200 text-cafe-600'
                  }`}>
                    #{user.rank}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-cafe-900">{user.alias}</div>
                    <div className="text-[10px] text-cafe-500">{user.badge}</div>
                  </div>
                </div>
                <div className="text-sm font-extrabold text-cafe-800 font-mono">
                  {user.points} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
