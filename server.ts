import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Initialize GoogleGenAI client (User-Agent header required by AI Studio guidelines)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper: build shopping & service links
export function createShoppingLinks(category: string, searchTerm: string) {
  const q = encodeURIComponent(searchTerm);
  const links: Record<string, string> = {};

  // Standard eCommerce
  links['Amazon'] = `https://www.amazon.in/s?k=${q}`;
  links['Flipkart'] = `https://www.flipkart.com/search?q=${q}`;

  const catLower = (category || '').toLowerCase();

  if (catLower.includes('light') || catLower.includes('fan') || catLower.includes('furniture') || catLower.includes('table') || catLower.includes('decor') || catLower.includes('home')) {
    links['IKEA'] = `https://www.ikea.com/in/en/search/?q=${q}`;
    links['Myntra'] = `https://www.myntra.com/search?q=${q}`;
    links['Ajio'] = `https://www.ajio.com/search/?text=${q}`;
  }

  if (catLower.includes('venue') || catLower.includes('stay') || catLower.includes('room') || catLower.includes('hall')) {
    links['Google'] = `https://www.google.com/search?q=${q}`;
    links['MakeMyTrip'] = `https://www.makemytrip.com/hotels/hotel-listing/?searchText=${q}`;
    links['OYO'] = `https://www.oyorooms.com/search?location=${q}`;
    links['Booking'] = `https://www.booking.com/search.html?ss=${q}`;
  }

  if (catLower.includes('catering') || catLower.includes('food') || catLower.includes('drink') || catLower.includes('snack') || catLower.includes('cake')) {
    links['Swiggy'] = `https://www.swiggy.com/search?query=${q}`;
    links['Zomato'] = `https://www.zomato.com/search?q=${q}`;
    links['BigBasket'] = `https://www.bigbasket.com/ps/?q=${q}`;
  }

  if (catLower.includes('entertain') || catLower.includes('music') || catLower.includes('game') || catLower.includes('show')) {
    links['BookMyShow'] = `https://in.bookmyshow.com/search?q=${q}`;
  }

  if (catLower.includes('jewel') || catLower.includes('ring') || catLower.includes('bracelet') || catLower.includes('watch') || catLower.includes('necklace') || catLower.includes('earring')) {
    links['BlueStone'] = `https://www.bluestone.com/search.html?query=${q}`;
    links['Tanishq'] = `https://www.tanishq.co.in/search?q=${q}`;
    links['CaratLane'] = `https://www.caratlane.com/search?q=${q}`;
    links['Melorra'] = `https://www.melorra.com/search?q=${q}`;
    links['Meesho'] = `https://www.meesho.com/search?q=${q}`;
  }

  return links;
}

// In-memory store for session & history
interface HistoryRecord {
  id: string;
  type: 'home' | 'party' | 'jewelry';
  timestamp: string;
  username: string;
  total_budget: number;
  currency: string;
  remaining_budget: number;
  input_summary: string;
  summary: string;
  full_result: any;
}

const memoryHistory: HistoryRecord[] = [
  {
    id: 'demo-home-1',
    type: 'home',
    timestamp: '2026-09-28T14:32:00.000Z',
    username: 'sai',
    total_budget: 5000,
    currency: '₹',
    remaining_budget: 500,
    input_summary: 'Living Room, Kitchen (5 Lights, 4 Fans, 2 Furniture, 1 Dining Table)',
    summary: 'Optimized living space layout with energy-efficient LED fixtures and modular furniture.',
    full_result: {
      total_budget: 5000,
      currency: '₹',
      remaining_budget: 500,
      budget_breakdown: [
        {
          category: 'Lighting',
          allocation: 1500,
          items: [
            {
              name: 'Warm White LED Panel & Bulbs (Pack of 5)',
              description: 'Energy-efficient 12W recessed ceiling lights for soft ambient glow.',
              estimated_price: 300,
              quantity: 5,
              search_terms: 'warm white led panel lights 12w',
              shopping_links: createShoppingLinks('Lighting', 'warm white led panel lights 12w')
            }
          ]
        },
        {
          category: 'Ceiling Fans',
          allocation: 2000,
          items: [
            {
              name: 'Havells / Crompton High-Speed Ceiling Fan',
              description: 'Aero-blade quiet motor ceiling fans in matte ivory finish.',
              estimated_price: 500,
              quantity: 4,
              search_terms: 'Havells high speed decorative ceiling fan',
              shopping_links: createShoppingLinks('Ceiling Fans', 'Havells high speed decorative ceiling fan')
            }
          ]
        },
        {
          category: 'Furniture & Dining',
          allocation: 1000,
          items: [
            {
              name: 'Modern Accent Plastic & Wood Chairs (Set of 2)',
              description: 'Stackable minimalist lounge chairs for dining or living room.',
              estimated_price: 250,
              quantity: 2,
              search_terms: 'modern plastic dining chairs set of 2',
              shopping_links: createShoppingLinks('Furniture', 'modern plastic dining chairs set of 2')
            },
            {
              name: 'Compact Wooden Coffee / Small Dining Table',
              description: 'Solid engineered wood compact square table with natural teak polish.',
              estimated_price: 500,
              quantity: 1,
              search_terms: 'compact wooden dining table small apartment',
              shopping_links: createShoppingLinks('Furniture', 'compact wooden dining table small apartment')
            }
          ]
        }
      ],
      calculation_table: [
        { category: 'Lighting', items_count: 5, total_cost: 1500, percentage_of_budget: 30 },
        { category: 'Ceiling Fans', items_count: 4, total_cost: 2000, percentage_of_budget: 40 },
        { category: 'Furniture & Dining', items_count: 3, total_cost: 1000, percentage_of_budget: 20 }
      ],
      additional_suggestions: [
        'Consider purchasing energy-saving BLDC fans to cut monthly electricity bills by up to 50%.',
        'Look out for festive season flash discounts on Amazon Great Indian Festival and Flipkart Big Billion Days.',
        'Prioritize core living room lighting fixtures first and stage accent lamps later.'
      ]
    }
  },
  {
    id: 'demo-party-1',
    type: 'party',
    timestamp: '2026-09-25T19:15:00.000Z',
    username: 'sai',
    total_budget: 5000,
    currency: '₹',
    remaining_budget: 0,
    input_summary: 'Wedding Reception / Celebration (3 Guests, Venue: Home)',
    summary: 'Intimate house celebration featuring gourmet buffet platter, ambient fairy decor, and streaming music.',
    full_result: {
      total_budget: 5000,
      currency: '₹',
      remaining_budget: 0,
      budget_breakdown: [
        {
          category: 'Venue',
          allocation: 0,
          items: [
            {
              name: 'Home Living & Terrace Venue',
              description: 'Utilizing cozy home setting with zero rental fees.',
              estimated_price: 0,
              quantity: 1,
              search_terms: 'home party venue ideas',
              shopping_links: createShoppingLinks('Venue', 'home party venue ideas')
            }
          ]
        },
        {
          category: 'Catering & Beverages',
          allocation: 2000,
          items: [
            {
              name: 'Gourmet 3-Course Meal Platters & Drinks',
              description: 'Appetizers, main course biryani/curry combo, and artisan desserts.',
              estimated_price: 666,
              quantity: 3,
              search_terms: 'party meal box bulk order',
              shopping_links: createShoppingLinks('Catering', 'party meal box bulk order')
            }
          ]
        },
        {
          category: 'Decoration',
          allocation: 1000,
          items: [
            {
              name: 'Warm Fairy Lights & Metallic Balloon Garland Set',
              description: 'Photogenic photo booth backdrop with fairy curtain string lights.',
              estimated_price: 1000,
              quantity: 1,
              search_terms: 'party decoration balloon garland fairy lights kit',
              shopping_links: createShoppingLinks('Decoration', 'party decoration balloon garland fairy lights kit')
            }
          ]
        },
        {
          category: 'Entertainment & Music',
          allocation: 1000,
          items: [
            {
              name: 'Premium Party Board Game & Streaming Playlist',
              description: 'Interactive social card game and high-definition playlist subscription.',
              estimated_price: 1000,
              quantity: 1,
              search_terms: 'social board games party fun adult',
              shopping_links: createShoppingLinks('Entertainment', 'social board games party fun adult')
            }
          ]
        },
        {
          category: 'Contingency & Favors',
          allocation: 1000,
          items: [
            {
              name: 'Custom Return Gifts & Emergency Ice/Snacks Buffer',
              description: 'Small token boxes and contingency budget for last-minute needs.',
              estimated_price: 1000,
              quantity: 1,
              search_terms: 'personalized wedding favor boxes',
              shopping_links: createShoppingLinks('Gifts', 'personalized wedding favor boxes')
            }
          ]
        }
      ],
      calculation_table_inr: [
        { category: 'Venue', items_count: 1, total_cost: 0, percentage_of_budget: 0 },
        { category: 'Catering & Beverages', items_count: 3, total_cost: 2000, percentage_of_budget: 40 },
        { category: 'Decoration', items_count: 1, total_cost: 1000, percentage_of_budget: 20 },
        { category: 'Entertainment & Music', items_count: 1, total_cost: 1000, percentage_of_budget: 20 },
        { category: 'Contingency & Favors', items_count: 1, total_cost: 1000, percentage_of_budget: 20 }
      ],
      venue_suggestions: [
        {
          name: 'Home Residential Lounge',
          type: 'Residential Cozy Living',
          capacity: 10,
          estimated_cost: 0,
          search_terms: 'home event ideas',
          shopping_links: createShoppingLinks('Venue', 'home event setup')
        }
      ],
      additional_suggestions: [
        'Curate a collaborative Spotify or YouTube Music playlist with your guests beforehand.',
        'Order party platters via Swiggy or Zomato pre-schedule to lock in timely arrival.',
        'Repurpose festive fairy lights to save on disposable decoration costs.'
      ]
    }
  },
  {
    id: 'demo-jewelry-1',
    type: 'jewelry',
    timestamp: '2026-09-22T11:20:00.000Z',
    username: 'sai',
    total_budget: 5000,
    currency: '₹',
    remaining_budget: 800,
    input_summary: 'Birthday Celebration (Casual & Minimalist Chic)',
    summary: 'Curated 925 sterling silver jewelry set featuring a braided bracelet, geometric band ring, and minimalist mesh watch.',
    full_result: {
      total_budget: 5000,
      currency: '₹',
      remaining_budget: 800,
      outfit_analysis: {
        colors: ['Denim Blue', 'Crisp White', 'Silver Metallic'],
        style: 'Casual Smart',
        formality: 'Smart Informal',
        notes: 'Classic blue and white combination pairs best with sleek rhodium, titanium, or 925 sterling silver tones.'
      },
      jewelry_recommendations: [
        {
          item_type: 'Bracelet',
          name: 'Braided Leather & Sterling Accent Bracelet',
          description: 'Contemporary double-strand leather bracelet with a magnetic silver clasp.',
          style: 'Casual Contemporary',
          estimated_price: 1500,
          search_terms: 'braided leather bracelet sterling silver clasp',
          shopping_links: createShoppingLinks('Jewelry', 'braided leather bracelet sterling silver clasp')
        },
        {
          item_type: 'Ring',
          name: 'Brushed Silver Minimalist Band Ring',
          description: 'Sleek bevelled edge comfort-fit titanium / silver band ring with matte satin finish.',
          style: 'Minimalist Industrial',
          estimated_price: 1200,
          search_terms: 'brushed silver band ring minimalist',
          shopping_links: createShoppingLinks('Jewelry', 'brushed silver band ring minimalist')
        },
        {
          item_type: 'Watch',
          name: 'Ultra-Slim Mesh Strap Dress Watch',
          description: 'Clean dial timepiece with a midnight blue face and stainless steel mesh strap.',
          style: 'Classic Modern',
          estimated_price: 1500,
          search_terms: 'minimalist stainless steel mesh watch blue dial',
          shopping_links: createShoppingLinks('Jewelry', 'minimalist stainless steel mesh watch blue dial')
        }
      ],
      styling_tips: [
        'Keep accessories cohesive by sticking to cool silver/steel hardware that matches the cool shirt undertones.',
        'Wear the bracelet on the opposite wrist of your watch to balance visual weight.',
        'Opt for hypoallergenic stainless steel or 925 silver for sweat resistance during day-long wear.'
      ]
    }
  }
];

// Helper to safely parse JSON from Gemini response
function extractJsonFromText(text: string) {
  if (!text) return null;
  let clean = text.trim();
  // Strip markdown code fences if present
  clean = clean.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  try {
    return JSON.parse(clean);
  } catch {
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(clean.substring(firstBrace, lastBrace + 1));
      } catch (err) {
        console.error('Failed to extract JSON from block:', err);
      }
    }
  }
  return null;
}

// 1. Health check & Session Info
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/session-info', (_req: Request, res: Response) => {
  res.json({
    username: 'sai',
    login_time: new Date(Date.now() - 3600000).toISOString(),
    last_activity: new Date().toISOString(),
    session_duration_minutes: 60,
    is_authenticated: true
  });
});

// 2. History endpoints
app.get('/api/history', (_req: Request, res: Response) => {
  res.json({ history: memoryHistory });
});

app.post('/api/history', (req: Request, res: Response) => {
  const { type, total_budget, currency, remaining_budget, input_summary, summary, full_result } = req.body;
  const newRecord: HistoryRecord = {
    id: 'plan-' + Date.now(),
    type: type || 'home',
    timestamp: new Date().toISOString(),
    username: 'sai',
    total_budget: Number(total_budget) || 0,
    currency: currency || '₹',
    remaining_budget: Number(remaining_budget) || 0,
    input_summary: input_summary || 'Budget Plan',
    summary: summary || 'AI-optimized budget recommendations plan.',
    full_result: full_result || {}
  };
  memoryHistory.unshift(newRecord);
  res.json({ success: true, record: newRecord });
});

app.delete('/api/history/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = memoryHistory.findIndex((item) => item.id === id);
  if (index !== -1) {
    memoryHistory.splice(index, 1);
    res.json({ success: true, message: 'Deleted' });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// 3. Home Interior Planner Endpoint
app.post('/api/generate-home', async (req: Request, res: Response) => {
  try {
    const {
      total_budget = 5000,
      currency = '₹',
      num_lights = 5,
      num_fans = 4,
      num_furniture = 2,
      num_dining_tables = 1,
      rooms = ['Living Room', 'Kitchen'],
      additional_requirements = 'Modern Indian aesthetic, durable and budget-friendly'
    } = req.body;

    const budgetNum = Number(total_budget) || 5000;
    const roomStr = Array.isArray(rooms) && rooms.length > 0 ? rooms.join(', ') : 'Living Room, Bedroom';

    let resultJson: any = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are PocketSmart AI, an expert home interior budget planner for India.
The user wants home interior product recommendations with a total budget of ${currency} ${budgetNum.toFixed(2)}.

User Requirements:
- Number of lights/lighting fixtures: ${num_lights}
- Number of ceiling fans: ${num_fans}
- Number of furniture pieces: ${num_furniture}
- Number of dining tables: ${num_dining_tables}
- Rooms to consider: ${roomStr}
- Additional preferences: ${additional_requirements}

Provide a realistic, cost-effective budget allocation where total cost <= ${budgetNum}.
Include popular Indian and global brands available on Amazon India, Flipkart, and IKEA (e.g., Havells, Crompton, Philips, Wipro, Solimo, IKEA, Wakefit, Nilkamal).

Respond strictly with valid JSON following this schema:
{
  "total_budget": ${budgetNum},
  "currency": "${currency}",
  "budget_breakdown": [
    {
      "category": "Lighting",
      "allocation": number,
      "items": [
        {
          "name": "string",
          "description": "string",
          "estimated_price": number (unit price),
          "quantity": number,
          "search_terms": "string"
        }
      ]
    },
    {
      "category": "Ceiling Fans",
      "allocation": number,
      "items": [
        {
          "name": "string",
          "description": "string",
          "estimated_price": number,
          "quantity": number,
          "search_terms": "string"
        }
      ]
    },
    {
      "category": "Furniture & Dining",
      "allocation": number,
      "items": [
        {
          "name": "string",
          "description": "string",
          "estimated_price": number,
          "quantity": number,
          "search_terms": "string"
        }
      ]
    }
  ],
  "calculation_table": [
    {
      "category": "string",
      "items_count": number,
      "total_cost": number,
      "percentage_of_budget": number
    }
  ],
  "remaining_budget": number,
  "additional_suggestions": [
    "string tips for maximizing value, durability, and savings"
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        resultJson = extractJsonFromText(response.text || '');
      } catch (geminiErr) {
        console.warn('Gemini API call failed or rate limited, using intelligent fallback:', geminiErr);
      }
    }

    // Fallback generator if AI offline / key not provided
    if (!resultJson || !resultJson.budget_breakdown) {
      const lightBudget = Math.round(budgetNum * 0.25);
      const fanBudget = Math.round(budgetNum * 0.40);
      const furnitureBudget = Math.round(budgetNum * 0.25);
      const remaining = Math.max(0, budgetNum - (lightBudget + fanBudget + furnitureBudget));

      const perLight = num_lights > 0 ? Math.round(lightBudget / num_lights) : 250;
      const perFan = num_fans > 0 ? Math.round(fanBudget / num_fans) : 600;
      const perChair = Math.round((furnitureBudget * 0.45) / Math.max(1, num_furniture));
      const tableCost = Math.round(furnitureBudget * 0.55);

      resultJson = {
        total_budget: budgetNum,
        currency,
        remaining_budget: remaining,
        budget_breakdown: [
          {
            category: 'Lighting',
            allocation: lightBudget,
            items: [
              {
                name: `Philips / Wipro LED 10W Bulbs & Fixtures (Pack of ${num_lights})`,
                description: `High-lumen glare-free warm LED lighting suited for ${roomStr}.`,
                estimated_price: perLight,
                quantity: num_lights,
                search_terms: 'Philips 10W warm led bulb fixture pack'
              }
            ]
          },
          {
            category: 'Ceiling Fans',
            allocation: fanBudget,
            items: [
              {
                name: `Havells / Orient Aerocool High-Velocity Fans`,
                description: 'Energy-efficient aerodynamic blades with whisper-quiet double ball bearing.',
                estimated_price: perFan,
                quantity: num_fans,
                search_terms: 'Havells aerocool ceiling fan high speed'
              }
            ]
          },
          {
            category: 'Furniture & Dining',
            allocation: furnitureBudget,
            items: [
              {
                name: `Ergonomic Accent Chairs (Pack of ${num_furniture})`,
                description: 'Contemporary Scandinavian contoured chairs for living and dining.',
                estimated_price: perChair,
                quantity: num_furniture,
                search_terms: 'ergonomic wooden dining accent chairs'
              },
              {
                name: `Solid Wood Modular Dining / Multi-utility Table`,
                description: 'Compact engineered wood dining table with water-resistant finish.',
                estimated_price: tableCost,
                quantity: num_dining_tables,
                search_terms: 'engineered wood 4 seater dining table modern'
              }
            ]
          }
        ],
        calculation_table: [
          { category: 'Lighting', items_count: num_lights, total_cost: lightBudget, percentage_of_budget: 25 },
          { category: 'Ceiling Fans', items_count: num_fans, total_cost: fanBudget, percentage_of_budget: 40 },
          { category: 'Furniture & Dining', items_count: num_furniture + num_dining_tables, total_cost: furnitureBudget, percentage_of_budget: 25 }
        ],
        additional_suggestions: [
          'Take advantage of bundle pricing on IKEA and Amazon Basics for dining sets and accent rugs.',
          'Opt for 5-star BEE rated BLDC ceiling fans to reduce utility bills by up to 50% year-round.',
          'Use warm white (2700K-3000K) lighting in living areas and neutral white (4000K) in cooking/study areas.'
        ]
      };
    }

    // Attach real shopping links to all items
    for (const cat of resultJson.budget_breakdown || []) {
      for (const item of cat.items || []) {
        item.shopping_links = createShoppingLinks(cat.category, item.search_terms || item.name);
      }
    }

    res.json(resultJson);
  } catch (error: any) {
    console.error('Error generating home recommendations:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// 4. Party Planner Endpoint
app.post('/api/generate-party', async (req: Request, res: Response) => {
  try {
    const {
      total_budget = 5000,
      currency = '₹',
      num_guests = 4,
      party_type = 'Birthday',
      venue_type = 'Home',
      needs_catering = true,
      needs_decoration = true,
      needs_entertainment = true,
      needs_photography = false,
      additional_requirements = 'Finger food, fun playlist, party games, festive vibe'
    } = req.body;

    const budgetNum = Number(total_budget) || 5000;
    const guestNum = Number(num_guests) || 4;

    let resultJson: any = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are PocketSmart AI, an expert party & event budget planner.
The user wants recommendations for an event with a budget of ${currency} ${budgetNum.toFixed(2)}.

Party Details:
- Event Type: ${party_type}
- Guest Count: ${guestNum}
- Venue Type: ${venue_type}
- Catering needed: ${needs_catering ? 'Yes' : 'No'}
- Decoration needed: ${needs_decoration ? 'Yes' : 'No'}
- Entertainment needed: ${needs_entertainment ? 'Yes' : 'No'}
- Photography/Add-ons: ${needs_photography ? 'Yes' : 'No'}
- Additional requirements: ${additional_requirements}

Allocate the total budget proportionally across Venue, Catering, Decoration, Entertainment, and a sensible Contingency buffer.
Ensure all prices are in ${currency} and sum does not exceed ${budgetNum}.
Target realistic Indian & international platforms like Swiggy, Zomato, BookMyShow, MakeMyTrip, OYO, Amazon, Flipkart.

Return strictly JSON matching this structure:
{
  "total_budget": ${budgetNum},
  "currency": "${currency}",
  "remaining_budget": number,
  "budget_breakdown": [
    {
      "category": "Venue",
      "allocation": number,
      "items": [
        {
          "name": "string",
          "description": "string",
          "estimated_price": number,
          "quantity": number,
          "search_terms": "string"
        }
      ]
    },
    {
      "category": "Catering",
      "allocation": number,
      "items": [
        {
          "name": "string",
          "description": "string",
          "estimated_price": number,
          "quantity": number,
          "search_terms": "string"
        }
      ]
    },
    {
      "category": "Decoration",
      "allocation": number,
      "items": [
        {
          "name": "string",
          "description": "string",
          "estimated_price": number,
          "quantity": number,
          "search_terms": "string"
        }
      ]
    },
    {
      "category": "Entertainment",
      "allocation": number,
      "items": [
        {
          "name": "string",
          "description": "string",
          "estimated_price": number,
          "quantity": number,
          "search_terms": "string"
        }
      ]
    },
    {
      "category": "Contingency",
      "allocation": number,
      "items": [
        {
          "name": "string",
          "description": "string",
          "estimated_price": number,
          "quantity": number,
          "search_terms": "string"
        }
      ]
    }
  ],
  "calculation_table_inr": [
    {
      "category": "string",
      "items_count": number,
      "total_cost": number,
      "percentage_of_budget": number
    }
  ],
  "venue_suggestions": [
    {
      "name": "string",
      "type": "string",
      "capacity": number,
      "estimated_cost": number,
      "search_terms": "string"
    }
  ],
  "additional_suggestions": [
    "string tips for food prep, DIY decor, music streaming, and timing"
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        resultJson = extractJsonFromText(response.text || '');
      } catch (geminiErr) {
        console.warn('Gemini API call failed or rate limited, using intelligent fallback:', geminiErr);
      }
    }

    if (!resultJson || !resultJson.budget_breakdown) {
      const isHome = venue_type.toLowerCase().includes('home');
      const venueCost = isHome ? 0 : Math.round(budgetNum * 0.25);
      const availBudget = budgetNum - venueCost;

      const cateringCost = needs_catering ? Math.round(availBudget * 0.45) : 0;
      const decorCost = needs_decoration ? Math.round(availBudget * 0.20) : 0;
      const entertainCost = needs_entertainment ? Math.round(availBudget * 0.20) : 0;
      const contingencyCost = availBudget - (cateringCost + decorCost + entertainCost);

      resultJson = {
        total_budget: budgetNum,
        currency,
        remaining_budget: Math.max(0, contingencyCost < 0 ? 0 : 0),
        budget_breakdown: [
          {
            category: 'Venue',
            allocation: venueCost,
            items: [
              {
                name: isHome ? 'Home Living & Terrace Venue' : `${venue_type} Booking Reservation`,
                description: isHome ? 'Hosting in private home setting with zero venue fees.' : `Rental space suited for ${guestNum} guests.`,
                estimated_price: venueCost,
                quantity: 1,
                search_terms: isHome ? 'home party space setup' : `${venue_type} party booking ${party_type}`
              }
            ]
          },
          {
            category: 'Catering',
            allocation: cateringCost,
            items: [
              {
                name: 'Custom Party Meal Platters & Finger Foods',
                description: `Appetizers, main dishes and beverages curated for ${guestNum} people.`,
                estimated_price: Math.round(cateringCost / Math.max(1, guestNum)),
                quantity: guestNum,
                search_terms: 'party snack platter bulk order'
              }
            ]
          },
          {
            category: 'Decoration',
            allocation: decorCost,
            items: [
              {
                name: 'Theme Balloon Arch & Fairy Light Curtain Backdrop',
                description: `High-impact photo-ready decorations matching ${party_type} celebration.`,
                estimated_price: decorCost,
                quantity: 1,
                search_terms: `${party_type} celebration balloon decor kit fairy lights`
              }
            ]
          },
          {
            category: 'Entertainment',
            allocation: entertainCost,
            items: [
              {
                name: 'Music Playlist & Party Card Games',
                description: 'Lively crowd-interactive games, trivia deck, and speaker setup.',
                estimated_price: entertainCost,
                quantity: 1,
                search_terms: 'fun party board games friends family'
              }
            ]
          },
          {
            category: 'Contingency',
            allocation: Math.max(0, contingencyCost),
            items: [
              {
                name: 'Buffer for Extra Ice, Drinks & Last-Minute Supplies',
                description: 'Emergency allocation to handle unexpected guest arrivals or needs.',
                estimated_price: Math.max(0, contingencyCost),
                quantity: 1,
                search_terms: 'party essentials snacks beverages pack'
              }
            ]
          }
        ],
        calculation_table_inr: [
          { category: 'Venue', items_count: 1, total_cost: venueCost, percentage_of_budget: Math.round((venueCost / budgetNum) * 100) },
          { category: 'Catering', items_count: guestNum, total_cost: cateringCost, percentage_of_budget: Math.round((cateringCost / budgetNum) * 100) },
          { category: 'Decoration', items_count: 1, total_cost: decorCost, percentage_of_budget: Math.round((decorCost / budgetNum) * 100) },
          { category: 'Entertainment', items_count: 1, total_cost: entertainCost, percentage_of_budget: Math.round((entertainCost / budgetNum) * 100) },
          { category: 'Contingency', items_count: 1, total_cost: Math.max(0, contingencyCost), percentage_of_budget: Math.round((Math.max(0, contingencyCost) / budgetNum) * 100) }
        ],
        venue_suggestions: [
          {
            name: isHome ? 'Home Cozy Lounge' : `Boutique ${venue_type}`,
            type: venue_type,
            capacity: Math.max(10, guestNum * 2),
            estimated_cost: venueCost,
            search_terms: `${venue_type} venue booking`
          }
        ],
        additional_suggestions: [
          'Pre-order snacks and appetizers on Swiggy or Zomato an hour in advance to avoid rush hour delays.',
          'Use reusable party bunting and LED string lights for aesthetic photos that last all night.',
          'Designate a selfie-corner with the balloon arch backdrop for great guest memories.'
        ]
      };
    }

    // Attach shopping & service links
    for (const cat of resultJson.budget_breakdown || []) {
      for (const item of cat.items || []) {
        item.shopping_links = createShoppingLinks(cat.category, item.search_terms || item.name);
      }
    }

    for (const v of resultJson.venue_suggestions || []) {
      v.shopping_links = createShoppingLinks('Venue', v.search_terms || v.name);
    }

    res.json(resultJson);
  } catch (error: any) {
    console.error('Error generating party recommendations:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// 5. Jewelry Planner Endpoint (Multimodal Text + Image Support)
app.post('/api/generate-jewelry', async (req: Request, res: Response) => {
  try {
    const {
      total_budget = 5000,
      currency = '₹',
      occasion = 'Birthday',
      preferences = 'Casual, modern minimalist silver accents',
      image_base64 = null,
      image_mime_type = 'image/jpeg'
    } = req.body;

    const budgetNum = Number(total_budget) || 5000;
    let resultJson: any = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        const textPrompt = `You are PocketSmart AI, a professional jewelry stylist and budget consultant for India.
The user wants jewelry recommendations for the occasion "${occasion}" with a budget of ${currency} ${budgetNum.toFixed(2)}.
User Style Preferences: ${preferences || 'Not specified'}.

${image_base64 ? 'The user has attached an image of their outfit. Analyze the outfit colors, cut, neckline, style (e.g. ethnic, western, cocktail, smart-casual), and formality to suggest complementary jewelry pieces (necklace, earrings, bracelet, ring, watch).' : 'No outfit image provided. Recommend versatile, high-style jewelry pieces suitable for ' + occasion + '.'}

Provide recommendations adhering strictly to budget. Include popular brands and shopping platforms in India like Tanishq, CaratLane, BlueStone, Melorra, Amazon India, Flipkart, and Meesho.

Respond strictly with JSON following this schema:
{
  "total_budget": ${budgetNum},
  "currency": "${currency}",
  "remaining_budget": number,
  "outfit_analysis": {
    "colors": ["string color 1", "string color 2"],
    "style": "string (e.g. Casual Denim, Elegant Ethnic Saree, Sleek Black Evening)",
    "formality": "string (e.g. Smart Casual, Festive, Semi-Formal)",
    "notes": "string style commentary"
  },
  "jewelry_recommendations": [
    {
      "item_type": "Bracelet | Ring | Watch | Earrings | Necklace",
      "name": "string product name",
      "description": "string describing design and how it complements the outfit/occasion",
      "style": "string",
      "estimated_price": number,
      "search_terms": "string"
    }
  ],
  "styling_tips": [
    "string tip 1",
    "string tip 2",
    "string tip 3"
  ]
}`;

        let contents: any;
        if (image_base64) {
          // Remove potential data URI prefix e.g. "data:image/png;base64,"
          const base64Data = image_base64.replace(/^data:[^;]+;base64,/, '');
          const imagePart = {
            inlineData: {
              mimeType: image_mime_type || 'image/jpeg',
              data: base64Data,
            },
          };
          contents = {
            parts: [
              imagePart,
              { text: textPrompt }
            ]
          };
        } else {
          contents = textPrompt;
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            responseMimeType: 'application/json',
          },
        });

        resultJson = extractJsonFromText(response.text || '');
      } catch (geminiErr) {
        console.warn('Gemini API call failed or rate limited, using intelligent fallback:', geminiErr);
      }
    }

    if (!resultJson || !resultJson.jewelry_recommendations) {
      // Intelligent fallback matching screenshot p. 37
      const braceletPrice = Math.round(budgetNum * 0.30);
      const ringPrice = Math.round(budgetNum * 0.25);
      const watchPrice = Math.round(budgetNum * 0.30);
      const remaining = Math.max(0, budgetNum - (braceletPrice + ringPrice + watchPrice));

      resultJson = {
        total_budget: budgetNum,
        currency,
        remaining_budget: remaining,
        outfit_analysis: {
          colors: ['Denim Blue', 'Crisp White', 'Silver Metallic'],
          style: preferences.toLowerCase().includes('saree') || occasion.toLowerCase().includes('wedding') ? 'Festive Ethnic' : 'Casual Smart',
          formality: occasion.toLowerCase().includes('wedding') ? 'Festive Glamour' : 'Casual Contemporary',
          notes: 'Subtle metal tones complement neutral and rich fabrics, elevating the ensemble without visual clutter.'
        },
        jewelry_recommendations: [
          {
            item_type: 'Bracelet',
            name: 'Braided Multi-Strand Leather & Silver Clasp Bracelet',
            description: 'A modern braided leather bracelet with brushed metal accents. Complements the casual style without being overly flashy.',
            style: 'Casual Modern',
            estimated_price: braceletPrice,
            search_terms: 'braided leather bracelet silver accents casual'
          },
          {
            item_type: 'Ring',
            name: 'Brushed Silver / Titanium Minimalist Band Ring',
            description: 'A silver or dark grey metal ring with a minimalist brushed finish. Avoids being loud while providing a clean statement.',
            style: 'Minimalist Chic',
            estimated_price: ringPrice,
            search_terms: 'brushed silver minimalist band ring'
          },
          {
            item_type: 'Watch',
            name: 'Classic Slim Dial Watch with Leather / Steel Strap',
            description: 'A classic, simple watch with a leather or silver metal band. A darker dial highlights the outfit palette cleanly.',
            style: 'Classic Executive',
            estimated_price: watchPrice,
            search_terms: 'classic slim dial analog watch minimalist'
          }
        ],
        styling_tips: [
          'Keep the jewelry minimal to match the clean profile of the outfit.',
          'Consider the watch as a focal statement piece, choosing a design that reflects personal style.',
          'Ensure the metal tones of the ring and bracelet complement each other (e.g. all silver/chrome).'
        ]
      };
    }

    // Attach shopping links to each jewelry recommendation
    for (const item of resultJson.jewelry_recommendations || []) {
      item.shopping_links = createShoppingLinks(item.item_type || 'Jewelry', item.search_terms || item.name);
    }

    res.json(resultJson);
  } catch (error: any) {
    console.error('Error generating jewelry recommendations:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Vite middleware for dev or static serving for production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PocketSmart AI backend server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
