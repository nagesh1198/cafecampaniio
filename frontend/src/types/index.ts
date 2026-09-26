export type UserRole = 'CUSTOMER' | 'CAFE_STAFF' | 'CAFE_ADMIN';

export type CrowdLevel = 'LOW' | 'MODERATE' | 'BUSY';

export interface Cafe {
  id: string;
  name: string;
  tagline: string;
  address: string;
  city: string;
  coordinates: { lat: number; lng: number };
  distanceKm: number;
  rating: number;
  reviewCount: number;
  openingHours: string;
  crowdLevel: CrowdLevel;
  crowdBadge: string;
  estimatedWaitMinutes: number;
  averagePrepMinutes: number;
  seatingInfo: string;
  atmosphere: string[];
  amenities: {
    workFriendly: boolean;
    quiet: boolean;
    social: boolean;
    outdoorSeating: boolean;
    wifi: boolean;
  };
  popularItemIds: string[];
  openSpaceEnabled: boolean;
  maxSessionDurationMinutes: number;
  image: string;
  trafficByHour: { hour: string; traffic: string; value: number }[];
  bestTimeToVisitNote: string;
}

export interface MenuItem {
  id: string;
  cafeId: string;
  name: string;
  description: string;
  price: number;
  category: 'Coffee' | 'Cold Brew' | 'Tea & Beverages' | 'Bakery & Pastries' | 'Food & Snacks';
  available: boolean;
  preparationTimeMinutes: number;
  tags: string[];
  ingredients: string[];
  calories: number;
  caffeineMg: number;
  isPopular?: boolean;
  image: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customizations?: {
    size?: string;
    milk?: string;
    sweetness?: string;
    ice?: string;
    notes?: string;
  };
}

export type OrderStatus = 'NEW' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber: string;
  cafeId: string;
  customerId: string;
  customerName: string;
  items: {
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
    customizations?: Record<string, any>;
  }[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  status: OrderStatus;
  stepIndex: number; // 1: Received, 2: Preparing, 3: Almost ready, 4: Ready
  estimatedMinutes: number;
  estimatedReadyTime: string;
  createdAt: string;
  preparingAt?: string;
  readyAt?: string;
  completedAt?: string;
}

export interface CustomerFeedback {
  id: string;
  orderId?: string;
  cafeId: string;
  customerId: string;
  rating: number;
  text: string;
  quickReactions: string[];
  subRatings: {
    food?: number;
    service?: number;
    waiting?: number;
    ambience?: number;
  };
  sentiment?: {
    label: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
    score: number;
    category: 'Food' | 'Service' | 'Waiting' | 'Cleanliness' | 'Ambience' | 'Pricing';
  };
  createdAt: string;
}

export interface MiniGame {
  id: string;
  title: string;
  type: 'COFFEE_QUIZ' | 'GUESS_COFFEE' | 'MEMORY_CHALLENGE' | 'DAILY_CHALLENGE';
  durationMinutes: number;
  pointsReward: number;
  description: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface SportsEvent {
  id: string;
  title: string;
  sport: string;
  tournament: string;
  startTime: string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
  options: {
    id: string;
    text: string;
    multiplier: number;
  }[];
  pointsPool: number;
  closesInMinutes: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  discountType: 'AMOUNT_OFF' | 'PERCENT_OFF' | 'FREE_ITEM';
  discountValue: number;
  minOrderValue: number;
  active: boolean;
  icon: string;
}

export interface PointsWallet {
  balance: number;
  todayEarned: number;
  history: {
    id: string;
    amount: number;
    type: 'EARNED_ORDER' | 'EARNED_GAME' | 'REDEEMED_REWARD' | 'BONUS';
    reason: string;
    date: string;
  }[];
  redemptions: {
    voucherCode: string;
    rewardTitle: string;
    discountValue: number;
    redeemedAt: string;
  }[];
}

export interface OpenSpaceSession {
  id: string;
  userId: string;
  cafeId: string;
  alias: string;
  checkInAt: string;
  expiresAt: string;
  isOpen: boolean;
  interests: string[];
  statusNote: string;
}

export interface ConnectionPing {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromAlias: string;
  toAlias: string;
  icebreaker: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
}

export interface EphemeralChat {
  id: string;
  participants: string[];
  messages: {
    id: string;
    sender: string;
    text: string;
    timestamp: string;
  }[];
  expiresAt?: string;
}

export interface OperationalInsight {
  id: string;
  category: string;
  headline: string;
  summary: string;
  confidence: number;
  actionable: string;
  type: 'positive' | 'warning' | 'info';
}
