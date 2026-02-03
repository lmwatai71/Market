import { Listing, User, Island, Review } from './types';

export const APP_NAME = "PIKO MARKETPLACE";

export const CATEGORIES = [
  "Appliances",
  "Auto Parts",
  "Clothing & Accessories",
  "Electronics",
  "Free Stuff",
  "Furniture",
  "Local Crafts",
  "Miscellaneous",
  "Plants & Farm Goods",
  "Real Estate",
  "Rentals",
  "Services",
  "Sporting Goods",
  "Tools",
  "Vehicles"
];

// Mapping locations to islands for auto-detection
export const LOCATION_TO_ISLAND: Record<string, Island> = {
  // Hawaiʻi Island
  "Hilo": 'hawaii', "Puna": 'hawaii', "Kaʻū": 'hawaii', "South Kona": 'hawaii', 
  "North Kona": 'hawaii', "South Kohala": 'hawaii', "North Kohala": 'hawaii', "Hāmākua": 'hawaii',
  "Keaʻau": 'hawaii', "Pāhoa": 'hawaii', "Volcano": 'hawaii', "Mountain View": 'hawaii', 
  "Kurtistown": 'hawaii', "Pahala": 'hawaii', "Naʻalehu": 'hawaii', "Ocean View": 'hawaii', 
  "Captain Cook": 'hawaii', "Kealakekua": 'hawaii', "Holualoa": 'hawaii', "Kailua‑Kona": 'hawaii', 
  "Waikoloa": 'hawaii', "Waimea": 'hawaii', "Honokaʻa": 'hawaii', "Laupāhoehoe": 'hawaii', 
  "Hawi": 'hawaii', "Kapaʻau": 'hawaii',

  // Oʻahu
  "Honolulu": 'oahu', "Kailua": 'oahu', "Kaneohe": 'oahu', "Pearl City": 'oahu',
  "Waipahu": 'oahu', "Kapolei": 'oahu', "Mililani": 'oahu', "Ewa Beach": 'oahu',
  "Wahiawa": 'oahu', "Waianae": 'oahu', "Haleiwa": 'oahu', "Laie": 'oahu',
  "Waimanalo": 'oahu', "Hawaii Kai": 'oahu', "Aiea": 'oahu',

  // Maui
  "Kahului": 'maui', "Wailuku": 'maui', "Kihei": 'maui', "Lahaina": 'maui',
  "Makawao": 'maui', "Kula": 'maui', "Paia": 'maui', "Haiku": 'maui', "Hana": 'maui',
  "Pukalani": 'maui',

  // Kauaʻi
  "Lihue": 'kauai', "Kapaa": 'kauai', "Hanalei": 'kauai', "Princeville": 'kauai',
  "Kilauea": 'kauai', "Anahola": 'kauai', "Koloa": 'kauai', "Poipu": 'kauai',
  "Kalaheo": 'kauai', "Hanapepe": 'kauai', "Waimea (Kauai)": 'kauai', "Kekaha": 'kauai',

  // Molokaʻi
  "Kaunakakai": 'molokai', "Kualapuu": 'molokai', "Maunaloa": 'molokai',

  // Lānaʻi
  "Lanai City": 'lanai'
};

export const APPROVED_LOCATIONS = Object.keys(LOCATION_TO_ISLAND).sort();

export const getIslandFromLocation = (location: string): Island => {
  return LOCATION_TO_ISLAND[location] || 'hawaii';
};

// Approximate coordinates for approved locations
export const LOCATION_COORDINATES: Record<string, { lat: number, lng: number }> = {
  // Hawaiʻi Island
  "Hilo": { lat: 19.7241, lng: -155.0868 },
  "Puna": { lat: 19.5000, lng: -154.9500 }, 
  "Kaʻū": { lat: 19.1000, lng: -155.6000 }, 
  "South Kona": { lat: 19.3000, lng: -155.9000 },
  "North Kona": { lat: 19.7000, lng: -155.9900 },
  "South Kohala": { lat: 19.9500, lng: -155.7500 },
  "North Kohala": { lat: 20.2000, lng: -155.8000 },
  "Hāmākua": { lat: 20.1000, lng: -155.4000 },
  "Keaʻau": { lat: 19.6217, lng: -155.0406 },
  "Pāhoa": { lat: 19.5000, lng: -154.9500 },
  "Volcano": { lat: 19.4318, lng: -155.2346 },
  "Mountain View": { lat: 19.5500, lng: -155.1167 },
  "Kurtistown": { lat: 19.5933, lng: -155.0606 },
  "Pahala": { lat: 19.2008, lng: -155.4772 },
  "Naʻalehu": { lat: 19.0644, lng: -155.5861 },
  "Ocean View": { lat: 19.1000, lng: -155.7667 },
  "Captain Cook": { lat: 19.4956, lng: -155.9172 },
  "Kealakekua": { lat: 19.5250, lng: -155.9250 },
  "Holualoa": { lat: 19.6208, lng: -155.9731 },
  "Kailua‑Kona": { lat: 19.6406, lng: -155.9969 },
  "Waikoloa": { lat: 19.9367, lng: -155.7920 },
  "Waimea": { lat: 20.0203, lng: -155.6650 },
  "Honokaʻa": { lat: 20.0783, lng: -155.4650 },
  "Laupāhoehoe": { lat: 19.9833, lng: -155.2333 },
  "Hawi": { lat: 20.2375, lng: -155.8322 },
  "Kapaʻau": { lat: 20.2333, lng: -155.7983 },

  // Oʻahu
  "Honolulu": { lat: 21.3069, lng: -157.8583 },
  "Kailua": { lat: 21.4022, lng: -157.7394 },
  "Kaneohe": { lat: 21.4121, lng: -157.7991 },
  "Pearl City": { lat: 21.3972, lng: -157.9694 },
  "Waipahu": { lat: 21.3867, lng: -158.0092 },
  "Kapolei": { lat: 21.3358, lng: -158.0800 },
  "Mililani": { lat: 21.4489, lng: -158.0111 },
  "Ewa Beach": { lat: 21.3156, lng: -158.0072 },
  "Wahiawa": { lat: 21.5028, lng: -158.0236 },
  "Waianae": { lat: 21.4447, lng: -158.1711 },
  "Haleiwa": { lat: 21.5928, lng: -158.1033 },
  "Laie": { lat: 21.6469, lng: -157.9225 },
  "Waimanalo": { lat: 21.3375, lng: -157.7128 },
  "Hawaii Kai": { lat: 21.2908, lng: -157.7019 },
  "Aiea": { lat: 21.3789, lng: -157.9286 },

  // Maui
  "Kahului": { lat: 20.8893, lng: -156.4729 },
  "Wailuku": { lat: 20.8911, lng: -156.5047 },
  "Kihei": { lat: 20.7644, lng: -156.4450 },
  "Lahaina": { lat: 20.8783, lng: -156.6825 },
  "Makawao": { lat: 20.8569, lng: -156.3131 },
  "Kula": { lat: 20.7933, lng: -156.3267 },
  "Paia": { lat: 20.9167, lng: -156.3833 },
  "Haiku": { lat: 20.9208, lng: -156.3244 },
  "Hana": { lat: 20.7583, lng: -155.9933 },
  "Pukalani": { lat: 20.8383, lng: -156.3417 },

  // Kauaʻi
  "Lihue": { lat: 21.9811, lng: -159.3711 },
  "Kapaa": { lat: 22.0883, lng: -159.3167 },
  "Hanalei": { lat: 22.2033, lng: -159.4983 },
  "Princeville": { lat: 22.2264, lng: -159.4853 },
  "Kilauea": { lat: 22.2117, lng: -159.4061 },
  "Anahola": { lat: 22.1467, lng: -159.3133 },
  "Koloa": { lat: 21.9067, lng: -159.4583 },
  "Poipu": { lat: 21.8817, lng: -159.4628 },
  "Kalaheo": { lat: 21.9233, lng: -159.5267 },
  "Hanapepe": { lat: 21.9117, lng: -159.5883 },
  "Waimea (Kauai)": { lat: 21.9567, lng: -159.6683 },
  "Kekaha": { lat: 21.9700, lng: -159.7150 },

  // Molokaʻi
  "Kaunakakai": { lat: 21.0883, lng: -157.0200 },
  "Kualapuu": { lat: 21.1667, lng: -157.0500 },
  "Maunaloa": { lat: 21.1333, lng: -157.2167 },

  // Lānaʻi
  "Lanai City": { lat: 20.8267, lng: -156.9189 }
};

export const findNearestLocation = (lat: number, lng: number): string | null => {
  let nearest = null;
  let minDistance = Infinity;

  for (const [name, coords] of Object.entries(LOCATION_COORDINATES)) {
    // Simple Euclidean distance is sufficient for local selection
    const dist = Math.sqrt(Math.pow(lat - coords.lat, 2) + Math.pow(lng - coords.lng, 2));
    if (dist < minDistance) {
      minDistance = dist;
      nearest = name;
    }
  }

  // Threshold: If closest is > ~0.5 degrees away (approx 35 miles), might be off-island or too far
  // Kept roughly same threshold, works for inter-island gaps
  if (minDistance > 0.5) return null;
  return nearest;
};

export const MOCK_REVIEWS: Review[] = [
  { id: 'r1', reviewerName: 'Malia K.', rating: 5, comment: 'Super friendly and item was exactly as described! Mahalo!', date: 'Oct 2023' },
  { id: 'r2', reviewerName: 'John D.', rating: 4, comment: 'Good communication, slightly late but all good.', date: 'Sep 2023' },
  { id: 'r3', reviewerName: 'Pua L.', rating: 5, comment: 'Quick response and easy pickup.', date: 'Nov 2023' },
  { id: 'r4', reviewerName: 'David S.', rating: 5, comment: 'Honest seller. The surfboard rides like a dream.', date: 'Aug 2023' },
];

export const getReviewsForSeller = (sellerId: string): Review[] => {
  // In a real app, verify sellerId. Here, return random subset for demo purposes.
  // Use pseudo-random based on string length to consistent results per seller
  const count = (sellerId.length % 3) + 1;
  return MOCK_REVIEWS.slice(0, count + 1);
};

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Kaimana',
  location: 'Kailua‑Kona',
  rating: 4.8,
  profilePhoto: 'https://picsum.photos/100/100',
  verified: true,
  createdAt: '2023-01-15',
  island: 'hawaii'
};

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'l1',
    title: 'Vintage Koa Wood Surfboard',
    price: 1200,
    category: 'Local Crafts',
    description: 'Beautiful condition, shaped in the 70s. Watertight and ready to ride or display.',
    photos: ['https://picsum.photos/400/300?random=1'],
    location: 'Hilo',
    condition: 'Good',
    sellerId: 'u2',
    sellerName: 'Uncle Bob',
    sellerPhone: '808-555-0102',
    sellerRating: 4.9,
    sellerReviewCount: 12,
    createdAt: '2023-10-25',
    boostedUntil: '2023-11-01',
    coordinates: { x: 75, y: 40 }, // Hilo side
    island: 'hawaii',
    negotiable: true
  },
  {
    id: 'l2',
    title: 'Monstera Cuttings (Huge)',
    price: 25,
    category: 'Plants & Farm Goods',
    description: 'Large rooted cuttings from my yard. Variegated available too for higher price.',
    photos: ['https://picsum.photos/400/300?random=2'],
    location: 'Kailua‑Kona',
    condition: 'New',
    sellerId: 'u3',
    sellerName: 'Lani',
    sellerPhone: '808-555-0103',
    sellerRating: 5.0,
    sellerReviewCount: 4,
    createdAt: '2023-10-26',
    coordinates: { x: 20, y: 50 }, // Kona side
    island: 'hawaii',
    negotiable: false
  },
  {
    id: 'l3',
    title: 'Honda Moped - Runs Great',
    price: 1200,
    category: 'Vehicles',
    description: 'Perfect for town commuting. New tires, safety check good till next year.',
    photos: ['https://picsum.photos/400/300?random=3'],
    location: 'Honolulu',
    condition: 'Good',
    sellerId: 'u4',
    sellerName: 'Keoni',
    sellerPhone: '808-555-0104',
    sellerRating: 4.7,
    sellerReviewCount: 8,
    createdAt: '2023-10-20',
    coordinates: { x: 30, y: 80 }, 
    island: 'oahu',
    negotiable: true
  },
  {
    id: 'l4',
    title: 'Moving Sale - Sofa & Table',
    price: 150,
    category: 'Furniture',
    description: 'Must go by Friday. Comfortable beige sofa and coffee table.',
    photos: ['https://picsum.photos/400/300?random=4'],
    location: 'Kahului',
    condition: 'Fair',
    sellerId: 'u5',
    sellerName: 'Sarah',
    sellerPhone: '808-555-0105',
    sellerRating: 4.5,
    sellerReviewCount: 2,
    createdAt: '2023-10-27',
    coordinates: { x: 40, y: 20 },
    island: 'maui',
    negotiable: true
  }
];

export const SYSTEM_INSTRUCTION = `
You are the security-aware AI assistant for PIKO MARKETPLACE, a Hawaiʻi-based local marketplace app serving the entire state.
Your role is to help users buy, sell, trade, and discover items across all islands (Hawaiʻi Island, Oʻahu, Maui, Kauaʻi, Molokaʻi, and Lānaʻi), while STRICTLY protecting them from scams.

LOCATION RULE (CORE):
PIKO MARKETPLACE operates in Hawaiʻi only.
All users, listings, businesses, and service providers must be located within Hawaiʻi.
Approved locations include major towns on all islands (e.g., Honolulu, Hilo, Kahului, Lihue, Kaunakakai).

If a user attempts to select or enter a location outside Hawaiʻi:
- Politely inform them the app is exclusive to Hawaiʻi.
- Ask if they want to continue with a Hawaiʻi location.
- Do not create listings or show results outside Hawaiʻi.

SECURITY PROTOCOLS:
You must enforce phone verification for sensitive actions.
Sensitive actions include:
- Creating a new account
- Logging in from a new device
- Posting a new listing
- Sending the first message to a seller
- Using paid features like boosts or subscriptions

Verification Flow:
1. If a user attempts a sensitive action and is not verified, ask for their phone number safely.
2. Confirm they want to receive a code via SMS.
3. Call the tool "send_verification_code" with the phone number.
4. Inform the user a 6-digit code was sent (mention "123456" is for testing if asked, but usually keep it realistic). Remind them NEVER to share this code.
5. Ask the user to enter the code.
6. Call the tool "verify_verification_code" with the phone number and the code.
7. If valid, proceed with their request. If invalid, ask them to try again.

MARKETPLACE RESPONSIBILITIES:
1. Help users create listings by asking for missing details (title, price, category, condition, location).
   - Ensure the location is one of the approved Hawaiʻi towns.
   - Suggest one of the official categories.
2. Help users browse listings by category, price, or location.
3. Help users draft friendly, safe messages.
4. Support local culture (use respectful Hawaiʻi-aware language, understand island geography).
5. Suggest improvements for listings.
6. Never give legal/medical/financial advice.
7. Never handle payments directly.

OUTPUT FORMATS:
When the user wants to perform a specific action, output a JSON object in a markdown code block at the end of your response.

Scenario 1: Creating a listing.
\`\`\`json
{
  "title": "String",
  "price": "String or Number",
  "category": "String (One of: Appliances, Auto Parts, Clothing & Accessories, Electronics, Free Stuff, Furniture, Local Crafts, Miscellaneous, Plants & Farm Goods, Real Estate, Rentals, Services, Sporting Goods, Tools, Vehicles)",
  "description": "String",
  "photos": ["Array of Strings"],
  "location": "String (Must be a Hawaiʻi town)",
  "condition": "String"
}
\`\`\`

Scenario 2: Browsing or Searching.
\`\`\`json
{
  "searchQuery": "String",
  "filters": {
    "category": "String (empty if none)",
    "minPrice": "String (empty if none)",
    "maxPrice": "String (empty if none)",
    "location": "String (empty if none)"
  }
}
\`\`\`

Scenario 3: Messaging a seller.
\`\`\`json
{
  "messageToSeller": "String"
}
\`\`\`
`;