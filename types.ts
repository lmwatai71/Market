export type Island = 'hawaii' | 'oahu' | 'maui' | 'kauai' | 'molokai' | 'lanai';

export interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  photos: string[];
  location: string;
  condition: string;
  sellerId: string;
  sellerName: string;
  sellerPhone?: string; // Added for SMS functionality
  sellerPaymentHandles?: { // Added for Payment functionality
    venmo?: string;
    cashapp?: string;
    zelle?: string;
  };
  sellerRating: number;
  createdAt: string;
  boostedUntil?: string;
  coordinates?: { x: number; y: number }; // Relative coordinates for mock map
  island: Island;
  negotiable?: boolean;
}

export interface User {
  id: string;
  name: string;
  location: string;
  rating: number;
  profilePhoto: string;
  verified: boolean;
  createdAt: string;
  island: Island;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  // Optional structured data if the AI returns an action
  actionData?: ListingDraft | SearchFilters | MessageDraft;
  timestamp: Date;
}

// AI Output Types
export interface ListingDraft {
  type: 'DRAFT_LISTING';
  data: {
    title: string;
    price: string;
    category: string;
    description: string;
    photos: string[];
    location: string;
    condition: string;
  };
}

export interface SearchFilters {
  type: 'SEARCH';
  data: {
    searchQuery: string;
    filters: {
      category: string;
      minPrice: string;
      maxPrice: string;
      location: string;
    };
  };
}

export interface MessageDraft {
  type: 'MESSAGE_SELLER';
  data: {
    messageToSeller: string;
  };
}

export type ViewState = 'home' | 'browse' | 'chat' | 'profile' | 'map' | 'tools' | 'create' | 'listing';