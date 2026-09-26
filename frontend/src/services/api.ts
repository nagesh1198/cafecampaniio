import {
  Cafe,
  MenuItem,
  Order,
  CustomerFeedback,
  MiniGame,
  SportsEvent,
  Reward,
  PointsWallet,
  OpenSpaceSession,
  ConnectionPing,
  EphemeralChat,
  OperationalInsight
} from '../types';

const API_BASE = '/api';

// Fallback seeded data in case backend is offline or loading
const FALLBACK_CAFES: Cafe[] = [
  {
    id: 'cafe-artisan-roastery',
    name: "Artisan Roastery & Lab",
    tagline: "Single-origin pour-overs & quiet sunlit workspace",
    address: "104 Tech Boulevard, Ground Floor, Indiranagar",
    city: "Bengaluru",
    coordinates: { lat: 12.9716, lng: 77.5946 },
    distanceKm: 0.6,
    rating: 4.8,
    reviewCount: 342,
    openingHours: "7:30 AM – 10:00 PM",
    crowdLevel: "LOW",
    crowdBadge: "🟢 Low crowd",
    estimatedWaitMinutes: 6,
    averagePrepMinutes: 7,
    seatingInfo: "24 indoor seats, 8 outdoor garden tables",
    atmosphere: ["Work-friendly", "Quiet", "Specialty Coffee", "Outdoor seating"],
    amenities: { workFriendly: true, quiet: true, social: false, outdoorSeating: true, wifi: true },
    popularItemIds: ['item-pour-over', 'item-iced-americano', 'item-sourdough-toast'],
    openSpaceEnabled: true,
    maxSessionDurationMinutes: 90,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
    trafficByHour: [
      { hour: "8 AM", traffic: "Low", value: 20 },
      { hour: "10 AM", traffic: "Moderate", value: 50 },
      { hour: "12 PM", traffic: "High", value: 75 },
      { hour: "2 PM", traffic: "Moderate", value: 45 },
      { hour: "3:30 PM", traffic: "Low", value: 25 },
      { hour: "5 PM", traffic: "Very High", value: 90 },
      { hour: "7 PM", traffic: "High", value: 70 },
      { hour: "9 PM", traffic: "Low", value: 30 }
    ],
    bestTimeToVisitNote: "Based on regular patterns, 3:00–4:30 PM is usually less busy and optimal for focused work or quick service."
  },
  {
    id: 'cafe-botanical-brew',
    name: "Botanical Brew Garden",
    tagline: "Lush botanical greenhouse café with cold brew tonics & artisan sourdough",
    address: "22 Fern Lane, Koramangala 4th Block",
    city: "Bengaluru",
    coordinates: { lat: 12.9352, lng: 77.6245 },
    distanceKm: 1.4,
    rating: 4.7,
    reviewCount: 289,
    openingHours: "8:00 AM – 11:00 PM",
    crowdLevel: "MODERATE",
    crowdBadge: "🟡 Moderate crowd",
    estimatedWaitMinutes: 14,
    averagePrepMinutes: 9,
    seatingInfo: "32 communal & garden tables",
    atmosphere: ["Social", "Outdoor seating", "Greenery", "Artisan Bakery"],
    amenities: { workFriendly: true, quiet: false, social: true, outdoorSeating: true, wifi: true },
    popularItemIds: ['item-cold-brew-tonic', 'item-avocado-tartine', 'item-matcha-latte'],
    openSpaceEnabled: true,
    maxSessionDurationMinutes: 90,
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
    trafficByHour: [
      { hour: "9 AM", traffic: "Low", value: 25 },
      { hour: "11 AM", traffic: "Moderate", value: 55 },
      { hour: "1 PM", traffic: "High", value: 80 },
      { hour: "3 PM", traffic: "Moderate", value: 50 },
      { hour: "4:30 PM", traffic: "High", value: 75 },
      { hour: "6 PM", traffic: "Very High", value: 95 }
    ],
    bestTimeToVisitNote: "Weekday mornings before 11:00 AM offer the most tranquil seating amidst the indoor garden."
  },
  {
    id: 'cafe-velvet-espresso',
    name: "Velvet Espresso Bar & Kitchen",
    tagline: "Modern Italian espresso bar, fresh breakfast bowls & flat whites",
    address: "56 Commercial Plaza, MG Road",
    city: "Bengaluru",
    coordinates: { lat: 12.9756, lng: 77.6066 },
    distanceKm: 2.1,
    rating: 4.6,
    reviewCount: 412,
    openingHours: "7:00 AM – 9:30 PM",
    crowdLevel: "BUSY",
    crowdBadge: "🔴 Busy",
    estimatedWaitMinutes: 22,
    averagePrepMinutes: 11,
    seatingInfo: "18 indoor bar stools & booth seating",
    atmosphere: ["Fast-paced", "Urban", "Premium Espresso", "All-day Breakfast"],
    amenities: { workFriendly: false, quiet: false, social: true, outdoorSeating: false, wifi: true },
    popularItemIds: ['item-velvet-flat-white', 'item-truffle-melt'],
    openSpaceEnabled: true,
    maxSessionDurationMinutes: 60,
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80",
    trafficByHour: [
      { hour: "8 AM", traffic: "Very High", value: 90 },
      { hour: "10 AM", traffic: "High", value: 80 },
      { hour: "12 PM", traffic: "Moderate", value: 60 },
      { hour: "2 PM", traffic: "Low", value: 30 }
    ],
    bestTimeToVisitNote: "Mid-afternoon between 1:30 PM and 3:30 PM has the lowest queue times."
  }
];

export const api = {
  // Cafes
  async getCafes(): Promise<Cafe[]> {
    try {
      const res = await fetch(`${API_BASE}/cafes`);
      if (res.ok) {
        const data = await res.json();
        if (data?.cafes?.length) return data.cafes;
      }
    } catch {}
    return FALLBACK_CAFES;
  },

  async getCafe(id: string): Promise<Cafe | null> {
    try {
      const res = await fetch(`${API_BASE}/cafes/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.cafe) return data.cafe;
      }
    } catch {}
    return FALLBACK_CAFES.find(c => c.id === id) || FALLBACK_CAFES[0];
  },

  async getMenu(cafeId: string): Promise<MenuItem[]> {
    try {
      const res = await fetch(`${API_BASE}/cafes/${cafeId}/menu`);
      if (res.ok) {
        const data = await res.json();
        if (data?.items?.length) return data.items;
      }
    } catch {}
    return [];
  },

  // AI Conversational Ordering
  async askCafeAI(message: string, cafeId: string, customerPreferences?: any) {
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, cafeId, customerPreferences })
      });
      if (res.ok) return await res.json();
    } catch {}
    return {
      reply: `Based on your request, I recommend our **Iced Americano** (₹150) or **Avocado Sourdough Tartine** (₹240) freshly made at the counter!`,
      suggestedItems: []
    };
  },

  // AI Personalized Recommendation
  async getAIRecommendation(cafeId: string, preferences?: any) {
    try {
      const res = await fetch(`${API_BASE}/ai/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cafeId, preferences })
      });
      if (res.ok) return await res.json();
    } catch {}
    return {
      greeting: "Good afternoon!",
      reason: "Our top-rated cold brew tonic for a crisp refreshment.",
      recommendedItem: null
    };
  },

  // Orders
  async getOrders(params?: { cafeId?: string; customerId?: string }): Promise<Order[]> {
    try {
      const qs = new URLSearchParams(params as any).toString();
      const res = await fetch(`${API_BASE}/orders?${qs}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.orders) return data.orders;
      }
    } catch {}
    return [];
  },

  async createOrder(orderPayload: any): Promise<{ order: Order; earnedPoints: number; newBalance: number }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    if (!res.ok) throw new Error('Failed to create order');
    return await res.json();
  },

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    return data.order;
  },

  // Customer Feedback
  async submitFeedback(feedbackPayload: any) {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackPayload)
    });
    return await res.json();
  },

  // Admin Stats & AI Insights
  async getAdminStats(cafeId: string) {
    try {
      const res = await fetch(`${API_BASE}/admin/${cafeId}/stats`);
      if (res.ok) return await res.json();
    } catch {}
    return {
      ordersToday: 126,
      revenueToday: 28450,
      averageWaitMinutes: 11,
      customerSatisfaction: 4.8,
      currentQueueCount: 3,
      popularItemName: 'Iced Americano',
      popularItemUnits: 38
    };
  },

  async getAdminInsights(cafeId: string): Promise<{ insights: OperationalInsight[] }> {
    try {
      const res = await fetch(`${API_BASE}/ai/insights/${cafeId}`);
      if (res.ok) return await res.json();
    } catch {}
    return { insights: [] };
  },

  async askAdminAI(query: string, cafeId: string) {
    const res = await fetch(`${API_BASE}/ai/admin-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, cafeId })
    });
    return await res.json();
  },

  // Games & Rewards
  async getGames(): Promise<{ miniGames: MiniGame[]; sportsEvents: SportsEvent[] }> {
    try {
      const res = await fetch(`${API_BASE}/games`);
      if (res.ok) return await res.json();
    } catch {}
    return { miniGames: [], sportsEvents: [] };
  },

  async validateGameAnswers(gameId: string, answers: number[], customerId = 'cust-demo-1') {
    const res = await fetch(`${API_BASE}/games/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, answers, customerId })
    });
    return await res.json();
  },

  async submitPrediction(eventId: string, selectedOptionId: string, customerId = 'cust-demo-1', pointsWager = 50) {
    const res = await fetch(`${API_BASE}/games/predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, selectedOptionId, customerId, pointsWager })
    });
    return await res.json();
  },

  async getRewards(): Promise<Reward[]> {
    try {
      const res = await fetch(`${API_BASE}/rewards`);
      if (res.ok) {
        const data = await res.json();
        if (data?.rewards) return data.rewards;
      }
    } catch {}
    return [];
  },

  async redeemReward(rewardId: string, customerId = 'cust-demo-1') {
    const res = await fetch(`${API_BASE}/rewards/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rewardId, customerId })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to redeem reward');
    }
    return await res.json();
  },

  async getUserPoints(customerId = 'cust-demo-1'): Promise<PointsWallet> {
    try {
      const res = await fetch(`${API_BASE}/users/${customerId}/points`);
      if (res.ok) {
        const data = await res.json();
        if (data?.wallet) return data.wallet;
      }
    } catch {}
    return {
      balance: 480,
      todayEarned: 60,
      history: [],
      redemptions: []
    };
  },

  async getLeaderboard() {
    try {
      const res = await fetch(`${API_BASE}/leaderboard`);
      if (res.ok) return await res.json();
    } catch {}
    return { leaderboard: [] };
  },

  // Open Space
  async getWhosHere(cafeId: string): Promise<{ count: number; activeSessions: OpenSpaceSession[] }> {
    try {
      const res = await fetch(`${API_BASE}/openspace/${cafeId}/whos-here`);
      if (res.ok) return await res.json();
    } catch {}
    return { count: 3, activeSessions: [] };
  },

  async joinOpenSpace(payload: any) {
    const res = await fetch(`${API_BASE}/openspace/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  async leaveOpenSpace(userId = 'cust-demo-1') {
    const res = await fetch(`${API_BASE}/openspace/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return await res.json();
  },

  async sendWave(payload: any) {
    const res = await fetch(`${API_BASE}/openspace/wave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  async respondWave(pingId: string, accept: boolean) {
    const res = await fetch(`${API_BASE}/openspace/respond-wave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pingId, accept })
    });
    return await res.json();
  },

  async getChat(chatId: string): Promise<{ chat: EphemeralChat }> {
    const res = await fetch(`${API_BASE}/openspace/chat/${chatId}`);
    return await res.json();
  },

  async sendChatMessage(chatId: string, text: string, sender = 'You') {
    const res = await fetch(`${API_BASE}/openspace/chat/${chatId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sender })
    });
    return await res.json();
  }
};
