// =============================================================
// VISHVA FOODS — Supabase Seed Script
// Inserts all 29 menu items from the spec
// Run: npx tsx supabase/seed.ts
// =============================================================
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const MENU_ITEMS = [
  // Appetizers
  {
    category: "Appetizers",
    name: "Samosa (2 pcs)",
    description: "Crispy pastry with spiced potato & peas",
    price: 7.99,
    spice_level: 1,
    is_vegan: false,
    is_jain: false,
    is_gluten_free: false,
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  },
  {
    category: "Appetizers",
    name: "Paneer Tikka",
    description: "Grilled cottage cheese in yogurt marinade",
    price: 14.99,
    spice_level: 2,
    is_vegan: false,
    is_jain: false,
    is_gluten_free: true,
    image_url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80",
  },
  {
    category: "Appetizers",
    name: "Hara Bhara Kabab",
    description: "Spinach & pea patties, mint chutney",
    price: 12.99,
    spice_level: 1,
    is_vegan: true,
    is_jain: false,
    is_gluten_free: false,
    image_url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80",
  },
  {
    category: "Appetizers",
    name: "Veg Spring Rolls",
    description: "Crispy rolls, mixed veggies",
    price: 9.99,
    spice_level: 1,
    is_vegan: true,
    is_jain: false,
    is_gluten_free: false,
    image_url: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80",
  },

  // Mains
  {
    category: "Mains",
    name: "Palak Paneer",
    description: "Cottage cheese in creamy spinach",
    price: 16.99,
    spice_level: 1,
    is_vegan: false,
    is_jain: false,
    is_gluten_free: true,
    image_url: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400&q=80",
  },
  {
    category: "Mains",
    name: "Dal Makhani",
    description: "Slow-cooked black lentils, butter & cream",
    price: 15.99,
    spice_level: 1,
    is_vegan: false,
    is_jain: false,
    is_gluten_free: true,
    image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80",
  },
  {
    category: "Mains",
    name: "Chana Masala",
    description: "Chickpeas in tangy tomato gravy",
    price: 14.99,
    spice_level: 2,
    is_vegan: true,
    is_jain: false,
    is_gluten_free: true,
    image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
  },
  {
    category: "Mains",
    name: "Aloo Gobi",
    description: "Cauliflower & potato, turmeric & cumin",
    price: 14.99,
    spice_level: 1,
    is_vegan: true,
    is_jain: true,
    is_gluten_free: true,
    image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80",
  },
  {
    category: "Mains",
    name: "Paneer Butter Masala",
    description: "Paneer in rich tomato-cream sauce",
    price: 17.99,
    spice_level: 1,
    is_vegan: false,
    is_jain: false,
    is_gluten_free: true,
    image_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
  },
  {
    category: "Mains",
    name: "Baingan Bharta",
    description: "Smoky roasted eggplant",
    price: 15.99,
    spice_level: 2,
    is_vegan: true,
    is_jain: false,
    is_gluten_free: true,
    image_url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80",
  },
  {
    category: "Mains",
    name: "Malai Kofta",
    description: "Fried cottage cheese dumplings in cream sauce",
    price: 17.99,
    spice_level: 1,
    is_vegan: false,
    is_jain: false,
    is_gluten_free: false,
    image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80",
  },
  {
    category: "Mains",
    name: "Rajma",
    description: "Red kidney beans in onion-tomato gravy",
    price: 14.99,
    spice_level: 1,
    is_vegan: true,
    is_jain: false,
    is_gluten_free: true,
    image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
  },
  {
    category: "Mains",
    name: "Vegetable Korma",
    description: "Mixed veg in mild coconut-cashew gravy",
    price: 15.99,
    spice_level: 1,
    is_vegan: true,
    is_jain: false,
    is_gluten_free: true,
    image_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  },

  // Breads
  {
    category: "Breads",
    name: "Garlic Naan",
    description: "Soft leavened bread with garlic & butter",
    price: 3.99,
    spice_level: 0,
    is_vegan: false,
    is_jain: false,
    is_gluten_free: false,
    image_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  },
  {
    category: "Breads",
    name: "Butter Naan",
    description: "Classic soft leavened bread with butter",
    price: 3.49,
    spice_level: 0,
    is_vegan: false,
    is_jain: false,
    is_gluten_free: false,
    image_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  },
  {
    category: "Breads",
    name: "Tandoori Roti",
    description: "Whole wheat flatbread from the tandoor",
    price: 2.99,
    spice_level: 0,
    is_vegan: true,
    is_jain: true,
    is_gluten_free: false,
    image_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  },
  {
    category: "Breads",
    name: "Puri (2 pcs)",
    description: "Deep-fried whole wheat puffed bread",
    price: 3.99,
    spice_level: 0,
    is_vegan: true,
    is_jain: true,
    is_gluten_free: false,
    image_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  },
  {
    category: "Breads",
    name: "Aloo Paratha",
    description: "Whole wheat flatbread stuffed with spiced potato",
    price: 4.99,
    spice_level: 1,
    is_vegan: false,
    is_jain: false,
    is_gluten_free: false,
    image_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  },

  // Rice & Biryani
  {
    category: "Rice & Biryani",
    name: "Veg Biryani",
    description: "Saffron basmati, seasonal vegetables",
    price: 18.99,
    spice_level: 2,
    is_vegan: true,
    is_jain: false,
    is_gluten_free: true,
    image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
  },
  {
    category: "Rice & Biryani",
    name: "Jeera Rice",
    description: "Basmati tempered with cumin",
    price: 6.99,
    spice_level: 0,
    is_vegan: true,
    is_jain: true,
    is_gluten_free: true,
    image_url: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&q=80",
  },
  {
    category: "Rice & Biryani",
    name: "Coconut Rice",
    description: "South Indian style, grated coconut",
    price: 7.99,
    spice_level: 0,
    is_vegan: true,
    is_jain: false,
    is_gluten_free: true,
    image_url: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&q=80",
  },

  // Desserts
  {
    category: "Desserts",
    name: "Gulab Jamun (3 pcs)",
    description: "Soft dumplings in rose syrup",
    price: 6.99,
    spice_level: 0,
    is_vegan: false,
    is_jain: false,
    is_gluten_free: false,
    image_url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
  },
  {
    category: "Desserts",
    name: "Kheer",
    description: "Rice pudding with cardamom & saffron",
    price: 5.99,
    spice_level: 0,
    is_vegan: false,
    is_jain: false,
    is_gluten_free: true,
    image_url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
  },
  {
    category: "Desserts",
    name: "Mango Kulfi",
    description: "Alphonso mango ice cream",
    price: 6.99,
    spice_level: 0,
    is_vegan: true,
    is_jain: false,
    is_gluten_free: true,
    image_url: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&q=80",
  },
  {
    category: "Desserts",
    name: "Rasgulla (3 pcs)",
    description: "Spongy cottage cheese balls in light syrup",
    price: 6.99,
    spice_level: 0,
    is_vegan: false,
    is_jain: false,
    is_gluten_free: true,
    image_url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
  },

  // Drinks
  {
    category: "Drinks",
    name: "Mango Lassi",
    description: "Yogurt-based mango smoothie",
    price: 5.99,
    spice_level: 0,
    is_vegan: false,
    is_jain: false,
    is_gluten_free: true,
    image_url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80",
  },
  {
    category: "Drinks",
    name: "Rose Lassi",
    description: "Sweet yogurt with rose water",
    price: 5.49,
    spice_level: 0,
    is_vegan: false,
    is_jain: false,
    is_gluten_free: true,
    image_url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80",
  },
  {
    category: "Drinks",
    name: "Masala Chai",
    description: "Spiced Indian milk tea",
    price: 3.99,
    spice_level: 0,
    is_vegan: false,
    is_jain: false,
    is_gluten_free: true,
    image_url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  },
  {
    category: "Drinks",
    name: "Fresh Lime Soda",
    description: "Refreshing lime with sparkling water",
    price: 3.49,
    spice_level: 0,
    is_vegan: true,
    is_jain: true,
    is_gluten_free: true,
    image_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
  },
];

async function seed() {
  console.log("🌱 Seeding menu items...");

  // Clear existing items
  const { error: deleteError } = await supabase.from("menu_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (deleteError) console.warn("⚠️  Delete warning:", deleteError.message);

  // Insert all items
  const { data, error } = await supabase.from("menu_items").insert(MENU_ITEMS);

  if (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`✅ Seeded ${MENU_ITEMS.length} menu items`);
  console.log("✨ Database is ready!");
}

seed().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
