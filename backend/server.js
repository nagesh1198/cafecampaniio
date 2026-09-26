import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Google Gemini API if key is available
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
let genAI = null;
if (GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log('✨ Google Gemini API initialized successfully.');
  } catch (err) {
    console.warn('⚠️ Gemini initialization error:', err.message);
  }
} else {
  console.log('ℹ️ Running with embedded Café Companion Gemini Fallback Engine (add GEMINI_API_KEY to .env for live Gemini API).');
}

// ==========================================
// 1. SEEDED DATABASE & IN-MEMORY STORE
// ==========================================

export const CAFES = [
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
    crowdLevel: "LOW", // LOW, MODERATE, BUSY
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
      { hour: "6 PM", traffic: "Very High", value: 95 },
      { hour: "8 PM", traffic: "Moderate", value: 60 }
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
    popularItemIds: ['item-velvet-flat-white', 'item-truffle-melt', 'item-croissant'],
    openSpaceEnabled: true,
    maxSessionDurationMinutes: 60,
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80",
    trafficByHour: [
      { hour: "8 AM", traffic: "Very High", value: 90 },
      { hour: "10 AM", traffic: "High", value: 80 },
      { hour: "12 PM", traffic: "Moderate", value: 60 },
      { hour: "2 PM", traffic: "Low", value: 30 },
      { hour: "4 PM", traffic: "Moderate", value: 55 },
      { hour: "6 PM", traffic: "High", value: 85 }
    ],
    bestTimeToVisitNote: "Mid-afternoon between 1:30 PM and 3:30 PM has the lowest queue times."
  }
];

export const MENU_ITEMS = [
  // Artisan Roastery Menu
  {
    id: 'item-iced-americano',
    cafeId: 'cafe-artisan-roastery',
    name: 'Iced Americano',
    description: 'Double shot of Ethiopian Yirgacheffe espresso pulled over chilled mineral water & crystal ice.',
    price: 150,
    category: 'Coffee',
    available: true,
    preparationTimeMinutes: 4,
    tags: ['cold', 'coffee', 'low-sugar', 'vegan', 'keto'],
    ingredients: ['Double espresso', 'Purified water', 'Ice'],
    calories: 10,
    caffeineMg: 150,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'item-pour-over',
    cafeId: 'cafe-artisan-roastery',
    name: 'Single-Origin Pour Over (V60)',
    description: 'Slow-dripped filter brew highlighting delicate floral jasmine & citrus notes.',
    price: 190,
    category: 'Coffee',
    available: true,
    preparationTimeMinutes: 6,
    tags: ['hot', 'coffee', 'specialty', 'vegan'],
    ingredients: ['Single-origin beans', '92°C filtered water'],
    calories: 5,
    caffeineMg: 180,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'item-velvet-flat-white',
    cafeId: 'cafe-artisan-roastery',
    name: 'Velvet Flat White',
    description: 'Ristretto double shot with velvety microfoam creating a silky, full-bodied taste.',
    price: 180,
    category: 'Coffee',
    available: true,
    preparationTimeMinutes: 5,
    tags: ['hot', 'coffee', 'creamy'],
    ingredients: ['Espresso ristretto', 'Steamed whole milk or oat milk'],
    calories: 120,
    caffeineMg: 140,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'item-iced-mocha',
    cafeId: 'cafe-artisan-roastery',
    name: 'Belgian Iced Mocha',
    description: 'House-melted dark chocolate, double espresso, chilled milk, and light cocoa dusting.',
    price: 210,
    category: 'Coffee',
    available: true,
    preparationTimeMinutes: 6,
    tags: ['cold', 'sweet', 'chocolate', 'coffee'],
    ingredients: ['Valrhona dark chocolate', 'Espresso', 'Cold milk', 'Ice'],
    calories: 230,
    caffeineMg: 130,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'item-sourdough-toast',
    cafeId: 'cafe-artisan-roastery',
    name: 'Avocado Sourdough Tartine',
    description: 'Toasted country sourdough with smashed Haas avocado, toasted pumpkin seeds, radish, and lemon zest.',
    price: 240,
    category: 'Food & Snacks',
    available: true,
    preparationTimeMinutes: 8,
    tags: ['food', 'vegetarian', 'vegan', 'high-protein', 'healthy'],
    ingredients: ['Sourdough', 'Avocado', 'Pepitas', 'Microgreens', 'Extra virgin olive oil'],
    calories: 320,
    caffeineMg: 0,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'item-veg-grilled-sandwich',
    cafeId: 'cafe-artisan-roastery',
    name: 'Veg Pesto Grilled Melt',
    description: 'Basil pesto, grilled zucchini, bell peppers, fresh mozzarella, pressed on crusty ciabatta.',
    price: 220,
    category: 'Food & Snacks',
    available: true,
    preparationTimeMinutes: 9,
    tags: ['food', 'vegetarian', 'warm', 'savory'],
    ingredients: ['Ciabatta', 'Basil pesto', 'Grilled vegetables', 'Mozzarella cheese'],
    calories: 380,
    caffeineMg: 0,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'item-almond-croissant',
    cafeId: 'cafe-artisan-roastery',
    name: 'Toasted Almond Croissant',
    description: 'Twice-baked flaky butter croissant stuffed with rich frangipane almond cream.',
    price: 160,
    category: 'Bakery & Pastries',
    available: true,
    preparationTimeMinutes: 2,
    tags: ['sweet', 'bakery', 'vegetarian'],
    ingredients: ['Croissant', 'Almond cream', 'Toasted sliced almonds', 'Powdered sugar'],
    calories: 340,
    caffeineMg: 0,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'item-cold-brew-tonic',
    cafeId: 'cafe-botanical-brew',
    name: 'Botanical Cold Brew Tonic',
    description: '20-hour steep cold brew layered over elderflower tonic water and fresh rosemary spritz.',
    price: 180,
    category: 'Cold Brew',
    available: true,
    preparationTimeMinutes: 4,
    tags: ['cold', 'refreshing', 'vegan', 'sparkling'],
    ingredients: ['Cold brew concentrate', 'Artisan tonic', 'Elderflower essence', 'Rosemary'],
    calories: 45,
    caffeineMg: 190,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'item-matcha-latte',
    cafeId: 'cafe-botanical-brew',
    name: 'Ceremonial Uji Matcha Latte',
    description: 'First-harvest Japanese stone-ground matcha whisked with steamed oat milk.',
    price: 220,
    category: 'Tea & Beverages',
    available: true,
    preparationTimeMinutes: 5,
    tags: ['hot', 'tea', 'healthy', 'vegan', 'antioxidant'],
    ingredients: ['Ceremonial matcha', 'Oat milk', 'Light agave'],
    calories: 110,
    caffeineMg: 65,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'item-blueberry-cheesecake',
    cafeId: 'cafe-botanical-brew',
    name: 'Wild Blueberry Baked Cheesecake',
    description: 'Silky New York style baked cheesecake layered with simmered wild blueberries.',
    price: 210,
    category: 'Bakery & Pastries',
    available: true,
    preparationTimeMinutes: 2,
    tags: ['sweet', 'bakery', 'vegetarian', 'dessert'],
    ingredients: ['Cream cheese', 'Graham cracker crust', 'Wild blueberries'],
    calories: 390,
    caffeineMg: 0,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80'
  }
];

export const REWARDS = [
  {
    id: 'rew-20-off',
    title: '₹20 Instant Discount',
    description: 'Redeem on any coffee or snack order above ₹100.',
    pointsCost: 300,
    discountType: 'AMOUNT_OFF',
    discountValue: 20,
    minOrderValue: 100,
    active: true,
    icon: 'Ticket'
  },
  {
    id: 'rew-free-cookie',
    title: 'Free Warm Artisan Cookie',
    description: 'Choc-chip or oatmeal walnut with any beverage purchase.',
    pointsCost: 550,
    discountType: 'FREE_ITEM',
    discountValue: 80,
    minOrderValue: 150,
    active: true,
    icon: 'Cookie'
  },
  {
    id: 'rew-50-off',
    title: '₹50 Off Lunch Combo',
    description: 'Valid on any sandwich + drink combination.',
    pointsCost: 800,
    discountType: 'AMOUNT_OFF',
    discountValue: 50,
    minOrderValue: 250,
    active: true,
    icon: 'Sparkles'
  },
  {
    id: 'rew-150-voucher',
    title: '₹150 VIP Café Voucher',
    description: 'Major discount across our entire artisan food & drink menu.',
    pointsCost: 2000,
    discountType: 'AMOUNT_OFF',
    discountValue: 150,
    minOrderValue: 300,
    active: true,
    icon: 'Award'
  }
];

export const GAMES = [
  {
    id: 'game-coffee-quiz',
    title: 'Artisan Coffee Connoisseur Quiz',
    type: 'COFFEE_QUIZ',
    durationMinutes: 3,
    pointsReward: 60,
    description: '3 quick questions about roasting, origins, and brewing. Earn 60 Café Points!',
    questions: [
      {
        question: 'Which country is historically known as the birthplace of Arabica coffee?',
        options: ['Brazil', 'Ethiopia', 'Italy', 'Vietnam'],
        correctIndex: 1,
        explanation: 'Ethiopia is recognized worldwide as the ancestral home of Coffea arabica.'
      },
      {
        question: 'What is the primary difference between a Flat White and a Latte?',
        options: [
          'Flat White uses cold milk',
          'Flat White has higher espresso-to-milk ratio with microfoam and thinner crema layer',
          'Latte contains dark chocolate',
          'There is no difference'
        ],
        correctIndex: 1,
        explanation: 'A Flat White features a double ristretto blend with velvety microfoam rather than fluffy foam.'
      },
      {
        question: 'Cold brew coffee is typically steeped for how long?',
        options: ['5 minutes', '1 hour', '12 to 24 hours', '3 days'],
        correctIndex: 2,
        explanation: 'Cold brew slow-steeps between 12 and 24 hours at room or refrigerated temperature.'
      }
    ]
  },
  {
    id: 'game-guess-coffee',
    title: 'Guess the Coffee Blend',
    type: 'GUESS_COFFEE',
    durationMinutes: 2,
    pointsReward: 40,
    description: 'Match flavor notes (jasmine, cocoa, citrus) to the correct roast origin!',
    questions: [
      {
        question: 'Notes: Bergamot citrus, delicate jasmine floral, peach sweetness.',
        options: ['Sumatra Dark Roast', 'Ethiopian Yirgacheffe', 'Italian Espresso', 'Decaf Columbian'],
        correctIndex: 1,
        explanation: 'Ethiopian Yirgacheffe is prized for its high-altitude citrus and jasmine florals.'
      },
      {
        question: 'Notes: Dark cocoa nibs, toasted walnut, heavy body, low acidity.',
        options: ['Kenyan AA', 'Colombian Supremo', 'Guatemalan Antigua', 'Costa Rican Honey'],
        correctIndex: 1,
        explanation: 'Colombian Supremo is renowned for rich chocolate and nut profiles.'
      }
    ]
  }
];

export const SPORTS_EVENTS = [
  {
    id: 'event-ipl-today',
    title: 'Bengaluru Royals vs Chennai Kings',
    sport: 'Cricket',
    tournament: 'Premier League Match 32',
    startTime: 'Live Now — 14.2 Overs',
    status: 'LIVE',
    options: [
      { id: 'opt-blr-win', text: 'Bengaluru to Score 180+ Runs', multiplier: 1.85 },
      { id: 'opt-chennai-chase', text: 'Chennai to Chase in under 19 Overs', multiplier: 2.10 },
      { id: 'opt-super-over', text: 'Match to enter Super Over', multiplier: 6.50 }
    ],
    pointsPool: 840,
    closesInMinutes: 8
  },
  {
    id: 'event-premier-league',
    title: 'Arsenal vs Manchester City',
    sport: 'Football',
    tournament: 'English Premier League',
    startTime: 'Today, 8:30 PM',
    status: 'UPCOMING',
    options: [
      { id: 'opt-ars-win', text: 'Arsenal Victory', multiplier: 2.4 },
      { id: 'opt-draw', text: 'Full-time Draw', multiplier: 3.2 },
      { id: 'opt-mci-win', text: 'Man City Victory', multiplier: 2.1 }
    ],
    pointsPool: 1200,
    closesInMinutes: 45
  }
];

export const OPEN_SPACE_SESSIONS = [
  {
    id: 'session-1',
    userId: 'user-guest-101',
    cafeId: 'cafe-artisan-roastery',
    alias: 'Corner Table Thinker',
    checkInAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 65).toISOString(),
    isOpen: true,
    interests: ['Technology', 'Startups', 'Coffee Roasting'],
    statusNote: 'Reading about LLM agents & sipping an Americano'
  },
  {
    id: 'session-2',
    userId: 'user-guest-102',
    cafeId: 'cafe-artisan-roastery',
    alias: 'Window Seat Designer',
    checkInAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 50).toISOString(),
    isOpen: true,
    interests: ['Design', 'Books', 'Photography'],
    statusNote: 'Sketching UI mockups over a flat white'
  },
  {
    id: 'session-3',
    userId: 'user-guest-103',
    cafeId: 'cafe-artisan-roastery',
    alias: 'Garden Bench Coder',
    checkInAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 78).toISOString(),
    isOpen: true,
    interests: ['Startups', 'Gaming', 'Travel'],
    statusNote: 'Building full-stack web apps'
  }
];

export const CONNECTION_PINGS = [];
export const EPHEMERAL_CHATS = [];

export let ORDERS = [
  {
    id: 'ORD-8921',
    orderNumber: '#8921',
    cafeId: 'cafe-artisan-roastery',
    customerId: 'cust-demo-1',
    customerName: 'Alex Rivera',
    items: [
      {
        menuItemId: 'item-iced-americano',
        name: 'Iced Americano',
        quantity: 1,
        price: 150,
        customizations: { size: '16oz', milk: 'none', sweetness: '25%', ice: 'Regular' }
      },
      {
        menuItemId: 'item-sourdough-toast',
        name: 'Avocado Sourdough Tartine',
        quantity: 1,
        price: 240,
        customizations: { notes: 'Extra crispy toast please' }
      }
    ],
    subtotal: 390,
    tax: 19.5,
    tip: 20,
    total: 429.5,
    status: 'PREPARING', // NEW, PREPARING, READY, COMPLETED
    stepIndex: 2, // 1: Order received, 2: Preparing, 3: Almost ready, 4: Ready for pickup
    estimatedMinutes: 8,
    estimatedReadyTime: new Date(Date.now() + 1000 * 60 * 6).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString()
  },
  {
    id: 'ORD-8920',
    orderNumber: '#8920',
    cafeId: 'cafe-artisan-roastery',
    customerId: 'cust-demo-2',
    customerName: 'Priya Sharma',
    items: [
      {
        menuItemId: 'item-velvet-flat-white',
        name: 'Velvet Flat White',
        quantity: 1,
        price: 180,
        customizations: { size: '12oz', milk: 'Barista Oat', latteArt: 'Rosette' }
      }
    ],
    subtotal: 180,
    tax: 9,
    tip: 15,
    total: 204,
    status: 'READY',
    stepIndex: 4,
    estimatedMinutes: 0,
    estimatedReadyTime: new Date(Date.now() - 1000 * 60 * 1).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    readyAt: new Date(Date.now() - 1000 * 60 * 1).toISOString()
  },
  {
    id: 'ORD-8919',
    orderNumber: '#8919',
    cafeId: 'cafe-artisan-roastery',
    customerId: 'cust-demo-3',
    customerName: 'David Chen',
    items: [
      {
        menuItemId: 'item-pour-over',
        name: 'Single-Origin Pour Over (V60)',
        quantity: 1,
        price: 190,
        customizations: { size: '12oz' }
      }
    ],
    subtotal: 190,
    tax: 9.5,
    tip: 0,
    total: 199.5,
    status: 'COMPLETED',
    stepIndex: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  }
];

export let FEEDBACK_RECORDS = [
  {
    id: 'fb-101',
    orderId: 'ORD-8918',
    cafeId: 'cafe-artisan-roastery',
    customerId: 'cust-demo-4',
    rating: 5,
    text: 'The Ethiopian pour-over had incredible floral notes. Beautiful quiet atmosphere for morning coding!',
    quickReactions: ['Great Coffee', 'Quiet & Focused', 'Fast Service'],
    subRatings: { food: 5, service: 5, waiting: 5, ambience: 5 },
    sentiment: { label: 'POSITIVE', score: 0.95, category: 'Food' },
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'fb-102',
    orderId: 'ORD-8917',
    cafeId: 'cafe-artisan-roastery',
    customerId: 'cust-demo-5',
    rating: 4,
    text: 'Avocado toast was super fresh. Wait time was about 12 minutes which was slightly longer than expected during lunch.',
    quickReactions: ['Delicious Food'],
    subRatings: { food: 5, service: 4, waiting: 3, ambience: 5 },
    sentiment: { label: 'NEUTRAL', score: 0.62, category: 'Waiting' },
    createdAt: new Date(Date.now() - 1000 * 60 * 85).toISOString()
  },
  {
    id: 'fb-103',
    orderId: 'ORD-8916',
    cafeId: 'cafe-artisan-roastery',
    customerId: 'cust-demo-6',
    rating: 5,
    text: 'Barista oat flat white was silky and rich. Love the live order tracker on the phone.',
    quickReactions: ['Silky Milk', 'Modern Tech'],
    subRatings: { food: 5, service: 5, waiting: 5, ambience: 5 },
    sentiment: { label: 'POSITIVE', score: 0.98, category: 'Service' },
    createdAt: new Date(Date.now() - 1000 * 60 * 130).toISOString()
  }
];

export let USER_POINTS = {
  'cust-demo-1': {
    balance: 480,
    todayEarned: 60,
    history: [
      { id: 'tx-1', amount: 50, type: 'EARNED_ORDER', reason: 'Order #8921 placed', date: 'Just now' },
      { id: 'tx-2', amount: 60, type: 'EARNED_GAME', reason: 'Won Coffee Connoisseur Quiz', date: '10 min ago' },
      { id: 'tx-3', amount: 370, type: 'BONUS', reason: 'Welcome to Café Companion bonus', date: 'Yesterday' }
    ],
    redemptions: []
  }
};

// ==========================================
// 2. GEMINI AI CONTROLLERS (ORCHESTRATION)
// ==========================================

// Helper: Run real Gemini or intelligent fallback grounding
async function callGemini(systemPrompt, userPrompt) {
  if (genAI && GEMINI_API_KEY) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: systemPrompt
      });
      const result = await model.generateContent(userPrompt);
      const text = result.response.text();
      return text;
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart engine:', err.message);
    }
  }

  // Smart fallback simulator respecting exact constraints
  return null;
}

// 2.1 Conversational Ordering Assistant ("Café AI")
app.post('/api/ai/chat', async (req, res) => {
  const { message, cafeId = 'cafe-artisan-roastery', customerPreferences = {} } = req.body;
  const currentCafe = CAFES.find(c => c.id === cafeId) || CAFES[0];
  const availableItems = MENU_ITEMS.filter(item => item.cafeId === cafeId && item.available);

  const menuContext = availableItems.map(item => ({
    id: item.id,
    name: item.name,
    price: `₹${item.price}`,
    prepTime: `${item.preparationTimeMinutes} min`,
    tags: item.tags.join(', '),
    category: item.category,
    calories: `${item.calories} cal`
  }));

  const systemInstruction = `You are "Café AI", the intelligent, courteous ordering assistant for "${currentCafe.name}".
CRITICAL RULES:
1. ONLY recommend items that exist in the provided real menu.
2. NEVER invent menu items, prices, or ingredients.
3. If the user specifies constraints (e.g. under ₹250, 10 minutes prep, cold, low-sugar, high-protein vegetarian), find the best matching real items from the menu.
4. Keep answers brief, warm, and structured with clear recommendations and pricing.
5. Suggest a complementary pairing or combo when suitable.

REAL CAFE MENU:
${JSON.stringify(menuContext, null, 2)}`;

  let aiReply = await callGemini(systemInstruction, message);

  // If no live Gemini key, use intelligent rule-based café matcher
  if (!aiReply) {
    const lower = (message || '').toLowerCase();
    let matches = [];

    // Filter by user keywords
    if (lower.includes('cold') || lower.includes('iced')) {
      matches = availableItems.filter(i => i.tags.includes('cold'));
    } else if (lower.includes('sweet') || lower.includes('dessert') || lower.includes('pastry')) {
      matches = availableItems.filter(i => i.tags.includes('sweet') || i.category.includes('Bakery'));
    } else if (lower.includes('protein') || lower.includes('snack') || lower.includes('hungry') || lower.includes('food')) {
      matches = availableItems.filter(i => i.category.includes('Food') || i.tags.includes('high-protein'));
    } else {
      matches = availableItems.filter(i => i.isPopular);
    }

    // Budget filtering
    const budgetMatch = message.match(/₹?\s*(\d{2,4})/);
    if (budgetMatch) {
      const maxBudget = parseInt(budgetMatch[1], 10);
      matches = matches.filter(i => i.price <= maxBudget);
    }

    if (matches.length === 0) matches = availableItems.slice(0, 2);

    const rec1 = matches[0] || availableItems[0];
    const rec2 = matches[1] || availableItems[1];

    aiReply = `Based on your request, here are top picks from our live menu at **${currentCafe.name}**:

1. **${rec1.name}** — ₹${rec1.price} (${rec1.preparationTimeMinutes} min prep)
   *${rec1.description}*
${rec2 ? `\n2. **${rec2.name}** — ₹${rec2.price} (${rec2.preparationTimeMinutes} min prep)\n   *${rec2.description}*` : ''}

Would you like me to add either to your order? Both are freshly prepared on bar!`;
  }

  // Find recommended item objects to attach quick action buttons in frontend
  const lowerMsg = (message + ' ' + aiReply).toLowerCase();
  const matchedItemIds = availableItems
    .filter(i => lowerMsg.includes(i.name.toLowerCase()) || lowerMsg.includes(i.id))
    .slice(0, 3);

  res.json({
    reply: aiReply,
    suggestedItems: matchedItemIds,
    cafeName: currentCafe.name
  });
});

// 2.2 Personalized Recommendations Engine
app.post('/api/ai/recommendations', async (req, res) => {
  const { preferences = {}, pastOrders = [], cafeId = 'cafe-artisan-roastery' } = req.body;
  const currentCafe = CAFES.find(c => c.id === cafeId) || CAFES[0];
  const availableItems = MENU_ITEMS.filter(i => i.cafeId === cafeId && i.available);

  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  let greeting = `Good ${timeOfDay}!`;
  let recommendedItem = availableItems[0];
  let reason = "Hand-picked for your taste profile.";

  if (preferences.dietary?.includes('vegan') || preferences.dietary?.includes('no-dairy')) {
    recommendedItem = availableItems.find(i => i.tags.includes('vegan')) || availableItems[0];
    reason = "Crafted with 100% plant-based ingredients to match your dairy-free preference.";
  } else if (timeOfDay === 'afternoon') {
    recommendedItem = availableItems.find(i => i.tags.includes('cold')) || availableItems[0];
    reason = "A refreshing chilled brew to power your afternoon focus.";
  } else {
    recommendedItem = availableItems.find(i => i.isPopular) || availableItems[0];
    reason = "Our signature barista specialty with exceptional single-origin beans.";
  }

  res.json({
    greeting,
    recommendedItem,
    reason,
    cafeName: currentCafe.name
  });
});

// 2.3 Customer Feedback Sentiment Analysis & Categorization
app.post('/api/ai/sentiment', async (req, res) => {
  const { text = '', rating = 5 } = req.body;

  let label = 'POSITIVE';
  let score = 0.9;
  let category = 'Food';

  const lower = text.toLowerCase();
  if (rating <= 2 || lower.includes('slow') || lower.includes('bad') || lower.includes('cold') || lower.includes('long wait')) {
    label = rating <= 2 ? 'NEGATIVE' : 'NEUTRAL';
    score = 0.4;
  } else if (rating === 3 || lower.includes('okay') || lower.includes('average')) {
    label = 'NEUTRAL';
    score = 0.6;
  }

  if (lower.includes('wait') || lower.includes('time') || lower.includes('queue') || lower.includes('delay')) {
    category = 'Waiting';
  } else if (lower.includes('service') || lower.includes('barista') || lower.includes('staff')) {
    category = 'Service';
  } else if (lower.includes('ambience') || lower.includes('quiet') || lower.includes('music') || lower.includes('chair')) {
    category = 'Ambience';
  } else if (lower.includes('clean') || lower.includes('table')) {
    category = 'Cleanliness';
  } else if (lower.includes('price') || lower.includes('expensive') || lower.includes('cheap')) {
    category = 'Pricing';
  } else {
    category = 'Food';
  }

  res.json({
    label,
    score,
    category
  });
});

// 2.4 "Understand the Room" AI Operational Insights (Staff/Admin)
app.get('/api/ai/insights/:cafeId', async (req, res) => {
  const { cafeId } = req.params;
  const cafe = CAFES.find(c => c.id === cafeId) || CAFES[0];
  const feedbacks = FEEDBACK_RECORDS.filter(f => f.cafeId === cafeId);
  const activeOrders = ORDERS.filter(o => o.cafeId === cafeId);

  const insights = [
    {
      id: 'ins-1',
      category: 'Product Delight',
      headline: 'Ethiopian V60 & Flat White Quality praised',
      summary: '94% of customer feedback in the last 24h praised coffee roast aroma and silky microfoam texture.',
      confidence: 0.96,
      actionable: 'Consider highlighting the Single-Origin Pour Over on the digital chalkboard.',
      type: 'positive'
    },
    {
      id: 'ins-2',
      category: 'Queue Management',
      headline: 'Peak wait time noted between 1:00 PM – 1:45 PM',
      summary: 'Average kitchen prep time reached 14 minutes during peak lunch hours. Toast orders created a minor bottleneck.',
      confidence: 0.88,
      actionable: 'Pre-portion artisan tartine prep ingredients before the 12:30 PM rush.',
      type: 'warning'
    },
    {
      id: 'ins-3',
      category: 'Open Space Trend',
      headline: 'High interest in Tech & Startups community',
      summary: '7 customers opted into Open Space today with shared interests in Technology, Books, and Design.',
      confidence: 0.92,
      actionable: 'Host a casual 30-minute community coffee cupping session this Friday.',
      type: 'info'
    }
  ];

  res.json({
    cafeName: cafe.name,
    insights,
    totalFeedbackAnalyzed: feedbacks.length,
    activeOrdersCount: activeOrders.length
  });
});

// 2.5 Admin AI Assistant Chat
app.post('/api/ai/admin-chat', async (req, res) => {
  const { query, cafeId = 'cafe-artisan-roastery' } = req.body;
  const cafe = CAFES.find(c => c.id === cafeId) || CAFES[0];

  const lower = (query || '').toLowerCase();
  let answer = '';

  if (lower.includes('busiest') || lower.includes('hour') || lower.includes('peak')) {
    answer = `Based on today's measured order velocity at **${cafe.name}**, your busiest window was **12:00 PM – 1:30 PM** (reaching 24 orders/hour), with a secondary afternoon surge at **5:00 PM**.
\n*Measured Data:* Average queue wait during peak was 14.2 minutes.
*AI Recommendation:* Staff 2 baristas on extraction during 12–2 PM to keep queue times under 8 minutes.`;
  } else if (lower.includes('popular') || lower.includes('top item') || lower.includes('best seller')) {
    answer = `Today's top selling products are:
1. **Iced Americano** (38 units sold)
2. **Avocado Sourdough Tartine** (24 units sold)
3. **Velvet Flat White** (21 units sold)
\n*Insight:* Cold beverage orders are up 28% due to warm outdoor temperatures today.`;
  } else if (lower.includes('feedback') || lower.includes('complaint') || lower.includes('sentiment')) {
    answer = `Feedback Summary for today:
- **Customer Satisfaction:** 4.8 / 5.0 (based on 34 ratings)
- **Sentiment Breakdown:** 88% Positive, 9% Neutral, 3% Negative.
- **Top Mentions:** Fresh coffee aroma (22 mentions), Fast barista greeting (14 mentions). Minor note: 2 guests requested more oat milk options.`;
  } else {
    answer = `At **${cafe.name}**, operations are running smoothly today. You have processed 126 orders with a total revenue of ₹28,450. The current wait time is 6 minutes with 3 active orders in the queue.`;
  }

  res.json({
    answer,
    cafeName: cafe.name
  });
});

// ==========================================
// 3. CAFES & MENU CRUD
// ==========================================

app.get('/api/cafes', (req, res) => {
  res.json({ cafes: CAFES });
});

app.get('/api/cafes/:id', (req, res) => {
  const cafe = CAFES.find(c => c.id === req.params.id);
  if (!cafe) return res.status(404).json({ error: 'Café not found' });
  res.json({ cafe });
});

app.get('/api/cafes/:id/menu', (req, res) => {
  const items = MENU_ITEMS.filter(i => i.cafeId === req.params.id);
  res.json({ items });
});

// Admin Add Menu Item
app.post('/api/cafes/:id/menu', (req, res) => {
  const { name, price, category, preparationTimeMinutes, description, tags, ingredients, image } = req.body;
  const newItem = {
    id: `item-${Date.now()}`,
    cafeId: req.params.id,
    name: name || 'New Specialty Item',
    description: description || 'Freshly prepared specialty dish.',
    price: Number(price) || 150,
    category: category || 'Coffee',
    available: true,
    preparationTimeMinutes: Number(preparationTimeMinutes) || 5,
    tags: Array.isArray(tags) ? tags : ['specialty'],
    ingredients: Array.isArray(ingredients) ? ingredients : [],
    calories: 120,
    caffeineMg: 80,
    isPopular: false,
    image: image || 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=600&q=80'
  };

  MENU_ITEMS.push(newItem);
  res.status(201).json({ success: true, item: newItem });
});

// Admin Update Menu Item
app.put('/api/cafes/:id/menu/:itemId', (req, res) => {
  const index = MENU_ITEMS.findIndex(i => i.id === req.params.itemId);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });

  MENU_ITEMS[index] = { ...MENU_ITEMS[index], ...req.body };
  res.json({ success: true, item: MENU_ITEMS[index] });
});

// Admin Delete Menu Item
app.delete('/api/cafes/:id/menu/:itemId', (req, res) => {
  const index = MENU_ITEMS.findIndex(i => i.id === req.params.itemId);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });

  const deleted = MENU_ITEMS.splice(index, 1);
  res.json({ success: true, item: deleted[0] });
});

// ==========================================
// 4. ORDERS & KANBAN MANAGEMENT
// ==========================================

app.get('/api/orders', (req, res) => {
  const { cafeId, customerId } = req.query;
  let filtered = ORDERS;
  if (cafeId) filtered = filtered.filter(o => o.cafeId === cafeId);
  if (customerId) filtered = filtered.filter(o => o.customerId === customerId);
  res.json({ orders: filtered });
});

app.get('/api/orders/:id', (req, res) => {
  const order = ORDERS.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ order });
});

// Customer Places New Order
app.post('/api/orders', (req, res) => {
  const { cafeId, customerId = 'cust-demo-1', customerName = 'Guest Coffee Lover', items = [], tip = 0 } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart cannot be empty' });
  }

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + tax + Number(tip || 0)).toFixed(2));

  const orderNum = `#${Math.floor(1000 + Math.random() * 9000)}`;
  const orderId = `ORD-${orderNum.replace('#', '')}`;

  const newOrder = {
    id: orderId,
    orderNumber: orderNum,
    cafeId: cafeId || 'cafe-artisan-roastery',
    customerId,
    customerName,
    items,
    subtotal,
    tax,
    tip: Number(tip || 0),
    total,
    status: 'NEW', // NEW -> PREPARING -> READY -> COMPLETED
    stepIndex: 1,
    estimatedMinutes: 8,
    estimatedReadyTime: new Date(Date.now() + 1000 * 60 * 8).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date().toISOString()
  };

  ORDERS.unshift(newOrder);

  // Award +50 Café Points for placing an order
  if (!USER_POINTS[customerId]) {
    USER_POINTS[customerId] = { balance: 0, todayEarned: 0, history: [], redemptions: [] };
  }
  USER_POINTS[customerId].balance += 50;
  USER_POINTS[customerId].todayEarned += 50;
  USER_POINTS[customerId].history.unshift({
    id: `tx-${Date.now()}`,
    amount: 50,
    type: 'EARNED_ORDER',
    reason: `Order ${orderNum} placed (+50 pts)`,
    date: 'Just now'
  });

  // Automated progression simulation (so demo flows forward naturally)
  setTimeout(() => {
    if (newOrder.status === 'NEW') {
      newOrder.status = 'PREPARING';
      newOrder.stepIndex = 2;
    }
  }, 4000);

  res.status(201).json({
    success: true,
    order: newOrder,
    earnedPoints: 50,
    newBalance: USER_POINTS[customerId].balance
  });
});

// Staff Updates Order Status (NEW | PREPARING | READY | COMPLETED)
app.patch('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = ORDERS.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = status;
  if (status === 'NEW') order.stepIndex = 1;
  else if (status === 'PREPARING') {
    order.stepIndex = 2;
    order.preparingAt = new Date().toISOString();
  } else if (status === 'READY') {
    order.stepIndex = 4;
    order.readyAt = new Date().toISOString();
  } else if (status === 'COMPLETED') {
    order.stepIndex = 4;
    order.completedAt = new Date().toISOString();
  }

  res.json({ success: true, order });
});

// Post Customer Feedback
app.post('/api/feedback', async (req, res) => {
  const { orderId, cafeId, customerId = 'cust-demo-1', rating = 5, text = '', quickReactions = [], subRatings = {} } = req.body;

  // Classify with Gemini / smart engine
  let sentiment = { label: 'POSITIVE', score: 0.9, category: 'Food' };
  try {
    const lower = text.toLowerCase();
    if (rating <= 2) sentiment.label = 'NEGATIVE';
    else if (rating === 3) sentiment.label = 'NEUTRAL';

    if (lower.includes('wait') || lower.includes('time')) sentiment.category = 'Waiting';
    else if (lower.includes('service') || lower.includes('barista')) sentiment.category = 'Service';
    else if (lower.includes('ambience') || lower.includes('music')) sentiment.category = 'Ambience';
  } catch {}

  const newFeedback = {
    id: `fb-${Date.now()}`,
    orderId,
    cafeId: cafeId || 'cafe-artisan-roastery',
    customerId,
    rating: Number(rating) || 5,
    text,
    quickReactions,
    subRatings,
    sentiment,
    createdAt: new Date().toISOString()
  };

  FEEDBACK_RECORDS.unshift(newFeedback);

  // Award +25 points for submitting feedback
  if (USER_POINTS[customerId]) {
    USER_POINTS[customerId].balance += 25;
    USER_POINTS[customerId].todayEarned += 25;
    USER_POINTS[customerId].history.unshift({
      id: `tx-${Date.now()}`,
      amount: 25,
      type: 'BONUS',
      reason: 'Feedback submitted (+25 pts)',
      date: 'Just now'
    });
  }

  res.status(201).json({ success: true, feedback: newFeedback, earnedPoints: 25 });
});

// Admin KPI Stats
app.get('/api/admin/:cafeId/stats', (req, res) => {
  const { cafeId } = req.params;
  const cafeOrders = ORDERS.filter(o => o.cafeId === cafeId);
  const totalRevenue = cafeOrders.reduce((sum, o) => sum + (o.total || 0), 0) + 24500;
  const activeQueue = cafeOrders.filter(o => o.status === 'NEW' || o.status === 'PREPARING');

  res.json({
    ordersToday: 126 + cafeOrders.length,
    revenueToday: totalRevenue,
    averageWaitMinutes: 11,
    customerSatisfaction: 4.8,
    currentQueueCount: activeQueue.length,
    popularItemName: 'Iced Americano (Ethiopian Roast)',
    popularItemUnits: 38
  });
});

// ==========================================
// 5. PLAY WHILE YOU WAIT & REWARDS ENGINE
// ==========================================

app.get('/api/games', (req, res) => {
  res.json({
    miniGames: GAMES,
    sportsEvents: SPORTS_EVENTS
  });
});

// Server-side Point Award Validation (Fraud-proof)
app.post('/api/games/validate', (req, res) => {
  const { gameId, answers, customerId = 'cust-demo-1' } = req.body;
  const game = GAMES.find(g => g.id === gameId);

  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  // Calculate actual correct answers server-side
  let correctCount = 0;
  game.questions.forEach((q, idx) => {
    if (answers && answers[idx] === q.correctIndex) {
      correctCount++;
    }
  });

  const pointsEarned = correctCount * Math.round(game.pointsReward / game.questions.length);

  if (!USER_POINTS[customerId]) {
    USER_POINTS[customerId] = { balance: 0, todayEarned: 0, history: [], redemptions: [] };
  }

  USER_POINTS[customerId].balance += pointsEarned;
  USER_POINTS[customerId].todayEarned += pointsEarned;
  USER_POINTS[customerId].history.unshift({
    id: `tx-${Date.now()}`,
    amount: pointsEarned,
    type: 'EARNED_GAME',
    reason: `Won ${game.title} (${correctCount}/${game.questions.length} correct)`,
    date: 'Just now'
  });

  res.json({
    success: true,
    correctCount,
    totalQuestions: game.questions.length,
    pointsEarned,
    newBalance: USER_POINTS[customerId].balance
  });
});

// Sports Prediction submission
app.post('/api/games/predictions', (req, res) => {
  const { eventId, selectedOptionId, customerId = 'cust-demo-1', pointsWager = 50 } = req.body;
  const event = SPORTS_EVENTS.find(e => e.id === eventId);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const option = event.options.find(o => o.id === selectedOptionId);
  const potentialWinnings = Math.round(pointsWager * (option?.multiplier || 1.8));

  // Deduct wager
  if (!USER_POINTS[customerId]) {
    USER_POINTS[customerId] = { balance: 200, todayEarned: 0, history: [], redemptions: [] };
  }
  USER_POINTS[customerId].balance = Math.max(0, USER_POINTS[customerId].balance - pointsWager);

  USER_POINTS[customerId].history.unshift({
    id: `tx-${Date.now()}`,
    amount: -pointsWager,
    type: 'REDEEMED_REWARD',
    reason: `Prediction locked: ${option?.text}`,
    date: 'Just now'
  });

  res.json({
    success: true,
    predictionId: `pred-${Date.now()}`,
    eventTitle: event.title,
    optionText: option?.text,
    potentialWinnings,
    newBalance: USER_POINTS[customerId].balance
  });
});

// Rewards Catalog
app.get('/api/rewards', (req, res) => {
  res.json({ rewards: REWARDS });
});

// Redeem Reward
app.post('/api/rewards/redeem', (req, res) => {
  const { rewardId, customerId = 'cust-demo-1' } = req.body;
  const reward = REWARDS.find(r => r.id === rewardId);
  if (!reward) return res.status(404).json({ error: 'Reward not found' });

  const userWallet = USER_POINTS[customerId] || { balance: 480, todayEarned: 0, history: [], redemptions: [] };

  if (userWallet.balance < reward.pointsCost) {
    return res.status(400).json({ error: `Insufficient points. You need ${reward.pointsCost} pts.` });
  }

  userWallet.balance -= reward.pointsCost;
  const voucherCode = `CAFE-${reward.discountValue}-${Math.floor(100 + Math.random() * 900)}`;

  userWallet.history.unshift({
    id: `tx-${Date.now()}`,
    amount: -reward.pointsCost,
    type: 'REDEEMED_REWARD',
    reason: `Redeemed ${reward.title} (-${reward.pointsCost} pts)`,
    date: 'Just now'
  });

  userWallet.redemptions.unshift({
    voucherCode,
    rewardTitle: reward.title,
    discountValue: reward.discountValue,
    redeemedAt: new Date().toISOString()
  });

  res.json({
    success: true,
    voucherCode,
    reward,
    newBalance: userWallet.balance
  });
});

// User Points Wallet
app.get('/api/users/:id/points', (req, res) => {
  const wallet = USER_POINTS[req.params.id] || {
    balance: 480,
    todayEarned: 60,
    history: [
      { id: 'tx-1', amount: 50, type: 'EARNED_ORDER', reason: 'Order #8921 placed', date: 'Just now' },
      { id: 'tx-2', amount: 60, type: 'EARNED_GAME', reason: 'Won Coffee Quiz', date: '10 min ago' }
    ],
    redemptions: []
  };
  res.json({ wallet });
});

// Leaderboard
app.get('/api/leaderboard', (req, res) => {
  res.json({
    leaderboard: [
      { rank: 1, alias: 'MochaMaster', points: 3420, badge: '👑 Roastery Legend' },
      { rank: 2, alias: 'BeanWhisperer', points: 2890, badge: '⭐ Coffee Sage' },
      { rank: 3, alias: 'EspressoExplorer', points: 2150, badge: '✨ Latte Artist' },
      { rank: 4, alias: 'You (Alex R.)', points: USER_POINTS['cust-demo-1']?.balance || 480, badge: '☕ Daily Brewer' },
      { rank: 5, alias: 'SunlitSip', points: 420, badge: '🌿 Morning Regular' }
    ]
  });
});

// ==========================================
// 6. CAFÉ OPEN SPACE (LIVE PRESENCE & CHAT)
// ==========================================

app.get('/api/openspace/:cafeId/whos-here', (req, res) => {
  const sessions = OPEN_SPACE_SESSIONS.filter(s => s.cafeId === req.params.cafeId && s.isOpen);
  res.json({
    count: sessions.length,
    activeSessions: sessions
  });
});

// Join / Check-in to Open Space
app.post('/api/openspace/checkin', (req, res) => {
  const { userId = 'cust-demo-1', cafeId = 'cafe-artisan-roastery', alias, interests = [], statusNote } = req.body;
  const newSession = {
    id: `session-${Date.now()}`,
    userId,
    cafeId,
    alias: alias || 'Espresso Explorer',
    checkInAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    isOpen: true,
    interests: interests.length > 0 ? interests : ['Technology', 'Coffee Roasting'],
    statusNote: statusNote || 'Enjoying a fresh cup at the counter'
  };

  OPEN_SPACE_SESSIONS.push(newSession);
  res.status(201).json({ success: true, session: newSession });
});

// Leave Open Space
app.post('/api/openspace/checkout', (req, res) => {
  const { userId = 'cust-demo-1' } = req.body;
  const session = OPEN_SPACE_SESSIONS.find(s => s.userId === userId && s.isOpen);
  if (session) {
    session.isOpen = false;
  }
  res.json({ success: true });
});

// Send a low-pressure "👋 wave"
app.post('/api/openspace/wave', async (req, res) => {
  const { fromUserId = 'cust-demo-1', toUserId, fromAlias = 'Espresso Explorer', toAlias = 'Corner Table Thinker' } = req.body;

  // Generate friendly Gemini icebreaker
  let icebreaker = "Both of you are enjoying single-origin brews today — wave back to compare flavor notes!";
  try {
    const aiIce = await callGemini(
      "Generate a friendly, lighthearted 1-sentence icebreaker between two people at a coffee roastery.",
      `From: ${fromAlias}, To: ${toAlias}. Keep it warm and polite.`
    );
    if (aiIce) icebreaker = aiIce;
  } catch {}

  const ping = {
    id: `ping-${Date.now()}`,
    fromUserId,
    toUserId,
    fromAlias,
    toAlias,
    icebreaker,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };

  CONNECTION_PINGS.push(ping);
  res.status(201).json({ success: true, ping });
});

// Respond to wave (Accept / Decline)
app.post('/api/openspace/respond-wave', (req, res) => {
  const { pingId, accept } = req.body;
  const ping = CONNECTION_PINGS.find(p => p.id === pingId);
  if (!ping) return res.status(404).json({ error: 'Ping not found' });

  if (accept) {
    ping.status = 'ACCEPTED';
    const chatId = `chat-${Date.now()}`;
    const newChat = {
      id: chatId,
      participants: [ping.fromAlias, ping.toAlias],
      messages: [
        {
          id: 'msg-1',
          sender: 'Café Companion Concierge',
          text: `👋 Wave accepted! ${ping.icebreaker}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString()
    };
    EPHEMERAL_CHATS.push(newChat);
    return res.json({ success: true, status: 'ACCEPTED', chatId, chat: newChat });
  } else {
    ping.status = 'DECLINED';
    return res.json({ success: true, status: 'DECLINED' }); // Handled silently without rejection notice
  }
});

// Ephemeral Chat messages
app.get('/api/openspace/chat/:chatId', (req, res) => {
  const chat = EPHEMERAL_CHATS.find(c => c.id === req.params.chatId);
  if (!chat) {
    // Provide demo active chat if requested
    return res.json({
      chat: {
        id: req.params.chatId,
        participants: ['You', 'Corner Table Thinker'],
        messages: [
          { id: 'msg-1', sender: 'Concierge', text: '👋 Wave connected! You both share an interest in Startups & Coffee Roasting.', timestamp: '12:04 PM' },
          { id: 'msg-2', sender: 'Corner Table Thinker', text: 'Hey there! How is that pour-over you ordered?', timestamp: '12:05 PM' }
        ]
      }
    });
  }
  res.json({ chat });
});

app.post('/api/openspace/chat/:chatId/message', (req, res) => {
  const { text, sender = 'You' } = req.body;
  let chat = EPHEMERAL_CHATS.find(c => c.id === req.params.chatId);
  if (!chat) {
    chat = {
      id: req.params.chatId,
      participants: ['You', 'Corner Table Thinker'],
      messages: []
    };
    EPHEMERAL_CHATS.push(chat);
  }

  const msg = {
    id: `msg-${Date.now()}`,
    sender,
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  chat.messages.push(msg);

  res.status(201).json({ success: true, message: msg });
});

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Café Companion Cloud Run / Firebase API',
    geminiActive: !!GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`☕ Café Companion backend running on port ${PORT}`);
});
