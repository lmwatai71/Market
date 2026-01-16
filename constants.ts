import { Listing, User } from './types';

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

export const APPROVED_LOCATIONS = [
  // Districts
  "Hilo", "Puna", "Kaʻū", "South Kona", "North Kona", "South Kohala", "North Kohala", "Hāmākua",
  // Major Towns
  "Keaʻau", "Pāhoa", "Volcano", "Mountain View", "Kurtistown", 
  "Pahala", "Naʻalehu", "Ocean View", 
  "Captain Cook", "Kealakekua", "Holualoa", "Kailua‑Kona", 
  "Waikoloa", "Waimea", "Honokaʻa", "Laupāhoehoe", "Hawi", "Kapaʻau"
].sort();

// Approximate coordinates for approved locations
export const LOCATION_COORDINATES: Record<string, { lat: number, lng: number }> = {
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
  "Kapaʻau": { lat: 20.2333, lng: -155.7983 }
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
  if (minDistance > 0.5) return null;
  return nearest;
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
    createdAt: '2023-10-26',
    coordinates: { x: 20, y: 50 }, // Kona side
    island: 'hawaii',
    negotiable: false
  },
  {
    id: 'l3',
    title: 'Toyota Tacoma TRD Off-Road',
    price: 18500,
    category: 'Vehicles',
    description: '2015 Tacoma, 80k miles. Lifted, new tires. Runs perfect. Island cruiser.',
    photos: ['https://picsum.photos/400/300?random=3'],
    location: 'Ocean View',
    condition: 'Excellent',
    sellerId: 'u4',
    sellerName: 'Keoni',
    sellerPhone: '808-555-0104',
    sellerRating: 4.7,
    createdAt: '2023-10-20',
    coordinates: { x: 30, y: 80 }, // South
    island: 'hawaii',
    negotiable: true
  },
  {
    id: 'l4',
    title: 'Moving Sale - Sofa & Table',
    price: 150,
    category: 'Furniture',
    description: 'Must go by Friday. Comfortable beige sofa and coffee table.',
    photos: ['https://picsum.photos/400/300?random=4'],
    location: 'Waimea',
    condition: 'Fair',
    sellerId: 'u5',
    sellerName: 'Sarah',
    sellerPhone: '808-555-0105',
    sellerRating: 4.5,
    createdAt: '2023-10-27',
    coordinates: { x: 40, y: 20 }, // North
    island: 'hawaii',
    negotiable: true
  }
];

export const SYSTEM_INSTRUCTION = `
You are the security-aware AI assistant for PIKO MARKETPLACE, a Hawaiʻi-based local marketplace app.
Your role is to help users buy, sell, trade, and discover items, while STRICTLY protecting them from scams and fake accounts.

LOCATION RULE (CORE):
PIKO MARKETPLACE currently operates ONLY on Hawaiʻi Island (Big Island).
All users, listings, businesses, and service providers must be located within Hawaiʻi Island districts or towns.
Approved locations include: Hilo, Puna, Kaʻū, Kona (North/South), Kohala (North/South), Hāmākua, Waimea, Volcano, Pāhoa, etc.

If a user attempts to select or enter a location outside Hawaiʻi Island:
- Politely inform them the app is currently Hawaiʻi Island only.
- Ask if they want to continue with a Hawaiʻi Island location.
- Do not create listings or show results outside Hawaiʻi Island.

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
   - Ensure the location is one of the approved Hawaiʻi Island towns.
   - Suggest one of the official categories: Appliances, Auto Parts, Clothing & Accessories, Electronics, Free Stuff, Furniture, Local Crafts, Miscellaneous, Plants & Farm Goods, Real Estate, Rentals, Services, Sporting Goods, Tools, Vehicles.
2. Help users browse listings by category, price, or location.
3. Help users draft friendly, safe messages.
4. Support local culture (use respectful Hawaiʻi-aware language).
5. Suggest improvements for listings.
6. Never give legal/medical/financial advice.
7. Never handle payments directly.

TONE:
- Calm, firm, and respectful regarding security.
- Friendly and local-first for general assistance.
- Prioritize safety over convenience.

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
  "location": "String (Must be a Hawaiʻi Island town)",
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