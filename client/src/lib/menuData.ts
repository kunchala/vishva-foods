// =============================================================
// VISHVA FOODS — Menu Data
// Source: project spec seed data
// =============================================================

export type DietaryTag = "vegan" | "jain" | "gluten_free";

export interface MenuItem {
  id: string;
  category: Category;
  name: string;
  description: string;
  price: number;
  spice_level: 0 | 1 | 2 | 3;
  is_vegan: boolean;
  is_jain: boolean;
  is_gluten_free: boolean;
  available: boolean;
  image_url?: string;
}

export type Category =
  | "Appetizers"
  | "Mains"
  | "Breads"
  | "Rice & Biryani"
  | "Desserts"
  | "Drinks";

export const CATEGORIES: Category[] = [
  "Appetizers",
  "Mains",
  "Breads",
  "Rice & Biryani",
  "Desserts",
  "Drinks",
];

// Unsplash images for dishes (parametric memory)
const DISH_IMAGES: Record<string, string> = {
  "Samosa (2 pcs)": "/img/dishes/1601050690597-df0568f70950.jpg",
  "Paneer Tikka": "/img/dishes/1599487488170-d11ec9c172f0.jpg",
  "Hara Bhara Kabab": "/img/dishes/1567188040759-fb8a883dc6d8.jpg",
  "Veg Spring Rolls": "/img/dishes/1695712641569-05eee7b37b6d.jpg",
  "Palak Paneer": "/img/dishes/1603894584373-5ac82b2ae398.jpg",
  "Dal Makhani": "/img/dishes/1546833999-b9f581a1996d.jpg",
  "Chana Masala": "/img/dishes/1585937421612-70a008356fbe.jpg",
  "Aloo Gobi": "/img/dishes/1631452180519-c014fe946bc7.jpg",
  "Paneer Butter Masala": "/img/dishes/1603894584373-5ac82b2ae398.jpg",
  "Baingan Bharta": "/img/dishes/1567188040759-fb8a883dc6d8.jpg",
  "Malai Kofta": "/img/dishes/1631452180519-c014fe946bc7.jpg",
  "Rajma": "/img/dishes/1585937421612-70a008356fbe.jpg",
  "Vegetable Korma": "/img/dishes/1565557623262-b51c2513a641.jpg",
  "Garlic Naan": "/img/dishes/1565557623262-b51c2513a641.jpg",
  "Butter Naan": "/img/dishes/1565557623262-b51c2513a641.jpg",
  "Tandoori Roti": "/img/dishes/1565557623262-b51c2513a641.jpg",
  "Puri (2 pcs)": "/img/dishes/1565557623262-b51c2513a641.jpg",
  "Aloo Paratha": "/img/dishes/1565557623262-b51c2513a641.jpg",
  "Veg Biryani": "/img/dishes/1563379091339-03b21ab4a4f8.jpg",
  "Jeera Rice": "/img/dishes/1516684732162-798a0062be99.jpg",
  "Coconut Rice": "/img/dishes/1516684732162-798a0062be99.jpg",
  "Gulab Jamun (3 pcs)": "/img/dishes/1666190092159-3171cf0fbb12.jpg",
  "Kheer": "/img/dishes/1758910536889-43ce7b3199fd.jpg",
  "Mango Kulfi": "/img/dishes/1601493700631-2b16ec4b4716.jpg",
  "Rasgulla (3 pcs)": "/img/dishes/1666190092159-3171cf0fbb12.jpg",
  "Mango Lassi": "/img/dishes/1623065422902-30a2d299bbe4.jpg",
  "Rose Lassi": "/img/dishes/1619898804188-e7bad4bd2127.jpg",
  "Masala Chai": "/img/dishes/1619581073186-5b4ae1b0caad.jpg",
  "Fresh Lime Soda": "/img/dishes/1513558161293-cdaf765ed2fd.jpg",
};

export const MENU_ITEMS: MenuItem[] = [
  // ── Appetizers ──
  {
    id: "app-1", category: "Appetizers", name: "Samosa (2 pcs)",
    description: "Crispy pastry with spiced potato & peas",
    price: 7.99, spice_level: 1, is_vegan: false, is_jain: false, is_gluten_free: false, available: true,
    image_url: DISH_IMAGES["Samosa (2 pcs)"],
  },
  {
    id: "app-2", category: "Appetizers", name: "Paneer Tikka",
    description: "Grilled cottage cheese in yogurt marinade",
    price: 14.99, spice_level: 2, is_vegan: false, is_jain: false, is_gluten_free: true, available: true,
    image_url: DISH_IMAGES["Paneer Tikka"],
  },
  {
    id: "app-3", category: "Appetizers", name: "Hara Bhara Kabab",
    description: "Spinach & pea patties, mint chutney",
    price: 12.99, spice_level: 1, is_vegan: true, is_jain: false, is_gluten_free: false, available: true,
    image_url: DISH_IMAGES["Hara Bhara Kabab"],
  },
  {
    id: "app-4", category: "Appetizers", name: "Veg Spring Rolls",
    description: "Crispy rolls, mixed veggies",
    price: 9.99, spice_level: 1, is_vegan: true, is_jain: false, is_gluten_free: false, available: true,
    image_url: DISH_IMAGES["Veg Spring Rolls"],
  },

  // ── Mains ──
  {
    id: "main-1", category: "Mains", name: "Palak Paneer",
    description: "Cottage cheese in creamy spinach",
    price: 16.99, spice_level: 1, is_vegan: false, is_jain: false, is_gluten_free: true, available: true,
    image_url: DISH_IMAGES["Palak Paneer"],
  },
  {
    id: "main-2", category: "Mains", name: "Dal Makhani",
    description: "Slow-cooked black lentils, butter & cream",
    price: 15.99, spice_level: 1, is_vegan: false, is_jain: false, is_gluten_free: true, available: true,
    image_url: DISH_IMAGES["Dal Makhani"],
  },
  {
    id: "main-3", category: "Mains", name: "Chana Masala",
    description: "Chickpeas in tangy tomato gravy",
    price: 14.99, spice_level: 2, is_vegan: true, is_jain: false, is_gluten_free: true, available: true,
    image_url: DISH_IMAGES["Chana Masala"],
  },
  {
    id: "main-4", category: "Mains", name: "Aloo Gobi",
    description: "Cauliflower & potato, turmeric & cumin",
    price: 14.99, spice_level: 1, is_vegan: true, is_jain: true, is_gluten_free: true, available: true,
    image_url: DISH_IMAGES["Aloo Gobi"],
  },
  {
    id: "main-5", category: "Mains", name: "Paneer Butter Masala",
    description: "Paneer in rich tomato-cream sauce",
    price: 17.99, spice_level: 1, is_vegan: false, is_jain: false, is_gluten_free: true, available: true,
    image_url: DISH_IMAGES["Paneer Butter Masala"],
  },
  {
    id: "main-6", category: "Mains", name: "Baingan Bharta",
    description: "Smoky roasted eggplant",
    price: 15.99, spice_level: 2, is_vegan: true, is_jain: false, is_gluten_free: true, available: true,
    image_url: DISH_IMAGES["Baingan Bharta"],
  },
  {
    id: "main-7", category: "Mains", name: "Malai Kofta",
    description: "Fried cottage cheese dumplings in cream sauce",
    price: 17.99, spice_level: 1, is_vegan: false, is_jain: false, is_gluten_free: false, available: true,
    image_url: DISH_IMAGES["Malai Kofta"],
  },
  {
    id: "main-8", category: "Mains", name: "Rajma",
    description: "Red kidney beans in onion-tomato gravy",
    price: 14.99, spice_level: 1, is_vegan: true, is_jain: false, is_gluten_free: true, available: true,
    image_url: DISH_IMAGES["Rajma"],
  },
  {
    id: "main-9", category: "Mains", name: "Vegetable Korma",
    description: "Mixed veg in mild coconut-cashew gravy",
    price: 15.99, spice_level: 1, is_vegan: true, is_jain: false, is_gluten_free: true, available: true,
    image_url: DISH_IMAGES["Vegetable Korma"],
  },

  // ── Breads ──
  {
    id: "bread-1", category: "Breads", name: "Garlic Naan",
    description: "Soft leavened bread with garlic & butter",
    price: 3.99, spice_level: 0, is_vegan: false, is_jain: false, is_gluten_free: false, available: true,
    image_url: DISH_IMAGES["Garlic Naan"],
  },
  {
    id: "bread-2", category: "Breads", name: "Butter Naan",
    description: "Classic soft leavened bread with butter",
    price: 3.49, spice_level: 0, is_vegan: false, is_jain: false, is_gluten_free: false, available: true,
    image_url: DISH_IMAGES["Butter Naan"],
  },
  {
    id: "bread-3", category: "Breads", name: "Tandoori Roti",
    description: "Whole wheat flatbread from the tandoor",
    price: 2.99, spice_level: 0, is_vegan: true, is_jain: true, is_gluten_free: false, available: true,
    image_url: DISH_IMAGES["Tandoori Roti"],
  },
  {
    id: "bread-4", category: "Breads", name: "Puri (2 pcs)",
    description: "Deep-fried whole wheat puffed bread",
    price: 3.99, spice_level: 0, is_vegan: true, is_jain: true, is_gluten_free: false, available: true,
    image_url: DISH_IMAGES["Puri (2 pcs)"],
  },
  {
    id: "bread-5", category: "Breads", name: "Aloo Paratha",
    description: "Whole wheat flatbread stuffed with spiced potato",
    price: 4.99, spice_level: 1, is_vegan: false, is_jain: false, is_gluten_free: false, available: true,
    image_url: DISH_IMAGES["Aloo Paratha"],
  },

  // ── Rice & Biryani ──
  {
    id: "rice-1", category: "Rice & Biryani", name: "Veg Biryani",
    description: "Saffron basmati, seasonal vegetables",
    price: 18.99, spice_level: 2, is_vegan: true, is_jain: false, is_gluten_free: true, available: true,
    image_url: DISH_IMAGES["Veg Biryani"],
  },
  {
    id: "rice-2", category: "Rice & Biryani", name: "Jeera Rice",
    description: "Basmati tempered with cumin",
    price: 6.99, spice_level: 0, is_vegan: true, is_jain: true, is_gluten_free: true, available: true,
    image_url: DISH_IMAGES["Jeera Rice"],
  },
  {
    id: "rice-3", category: "Rice & Biryani", name: "Coconut Rice",
    description: "South Indian style, grated coconut",
    price: 7.99, spice_level: 0, is_vegan: true, is_jain: false, is_gluten_free: true, available: true,
    image_url: DISH_IMAGES["Coconut Rice"],
  },

  // ── Desserts ──
  {
    id: "des-1", category: "Desserts", name: "Gulab Jamun (3 pcs)",
    description: "Soft dumplings in rose syrup",
    price: 6.99, spice_level: 0, is_vegan: false, is_jain: false, is_gluten_free: false, available: true,
    image_url: DISH_IMAGES["Gulab Jamun (3 pcs)"],
  },
  {
    id: "des-2", category: "Desserts", name: "Kheer",
    description: "Rice pudding with cardamom & saffron",
    price: 5.99, spice_level: 0, is_vegan: false, is_jain: false, is_gluten_free: true, available: true,
    image_url: DISH_IMAGES["Kheer"],
  },
  {
    id: "des-3", category: "Desserts", name: "Mango Kulfi",
    description: "Alphonso mango ice cream",
    price: 6.99, spice_level: 0, is_vegan: true, is_jain: false, is_gluten_free: true, available: true,
    image_url: DISH_IMAGES["Mango Kulfi"],
  },
  {
    id: "des-4", category: "Desserts", name: "Rasgulla (3 pcs)",
    description: "Spongy cottage cheese balls in light syrup",
    price: 6.99, spice_level: 0, is_vegan: false, is_jain: false, is_gluten_free: true, available: true,
    image_url: DISH_IMAGES["Rasgulla (3 pcs)"],
  },

  // ── Drinks ──
  {
    id: "drink-1", category: "Drinks", name: "Mango Lassi",
    description: "Yogurt-based mango smoothie",
    price: 5.99, spice_level: 0, is_vegan: false, is_jain: false, is_gluten_free: true, available: true,
    image_url: DISH_IMAGES["Mango Lassi"],
  },
  {
    id: "drink-2", category: "Drinks", name: "Rose Lassi",
    description: "Sweet yogurt with rose water",
    price: 5.49, spice_level: 0, is_vegan: false, is_jain: false, is_gluten_free: true, available: true,
    image_url: DISH_IMAGES["Rose Lassi"],
  },
  {
    id: "drink-3", category: "Drinks", name: "Masala Chai",
    description: "Spiced Indian milk tea",
    price: 3.99, spice_level: 0, is_vegan: false, is_jain: false, is_gluten_free: true, available: true,
    image_url: DISH_IMAGES["Masala Chai"],
  },
  {
    id: "drink-4", category: "Drinks", name: "Fresh Lime Soda",
    description: "Refreshing lime with sparkling water",
    price: 3.49, spice_level: 0, is_vegan: true, is_jain: true, is_gluten_free: true, available: true,
    image_url: DISH_IMAGES["Fresh Lime Soda"],
  },
];

// Featured dishes for homepage horizontal scroll
export const FEATURED_DISH_IDS = ["app-2", "main-5", "rice-1", "des-1"];
export const FEATURED_DISHES = MENU_ITEMS.filter(item =>
  FEATURED_DISH_IDS.includes(item.id)
);
