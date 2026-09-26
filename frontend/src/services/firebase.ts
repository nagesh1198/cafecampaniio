import { UserRole } from '../types';

// Read config from Vite environment variables
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoPlaceholderKey123",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cafe-companion-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cafe-companion-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cafe-companion-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456",
};

// Fallback Mock Auth & Firestore for seamless out-of-the-box demoing
export const auth: any = {
  currentUser: {
    uid: 'cust-demo-1',
    email: 'alex.rivera@example.com',
    displayName: 'Alex Rivera'
  }
};

export const db: any = {};
export const googleProvider: any = {};

// Demo Accounts & Role Switching (§20)
export interface DemoUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  cafeId?: string;
  avatarUrl: string;
}

export const DEMO_USERS: Record<UserRole, DemoUser> = {
  CUSTOMER: {
    uid: 'cust-demo-1',
    email: 'alex.rivera@example.com',
    displayName: 'Alex Rivera',
    role: 'CUSTOMER',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  CAFE_STAFF: {
    uid: 'staff-demo-1',
    email: 'priya.barista@artisanroastery.com',
    displayName: 'Priya (Head Barista)',
    role: 'CAFE_STAFF',
    cafeId: 'cafe-artisan-roastery',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
  },
  CAFE_ADMIN: {
    uid: 'admin-demo-1',
    email: 'manager@artisanroastery.com',
    displayName: 'Marco (Café Manager)',
    role: 'CAFE_ADMIN',
    cafeId: 'cafe-artisan-roastery',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  }
};
