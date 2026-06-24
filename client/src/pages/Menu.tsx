// =============================================================
// VISHVA FOODS — Menu Page
// Fetches dishes from Supabase
// Category tab bar, dietary filter chips, dish grid with skeletons
// Sticky mobile "View Cart" bar
// =============================================================
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ShoppingBag, AlertCircle } from "lucide-react";
import DishCard from "@/components/DishCard";
import { fetchMenuItems, supabaseConfigured, type MenuItem } from "@/lib/supabase";
import { MENU_ITEMS as STATIC_MENU } from "@/lib/menuData";
import { useCart } from "@/contexts/CartContext";

// Built-in seed data so the menu renders before Supabase is wired up
// (or if a read fails). Mapped to the Supabase MenuItem shape.
const FALLBACK_ITEMS: MenuItem[] = (STATIC_MENU as any[]).map((m) => ({
  ...m,
  description: m.description ?? "",
  image_url: m.image_url ?? null,
  created_at: "",
  updated_at: "",
})) as MenuItem[];

type DietFilter = "all" | "vegan" | "jain" | "gluten_free";

const FILTER_LABELS: Record<DietFilter, string> = {
  all: "All",
  vegan: "Vegan",
  jain: "Jain",
  gluten_free: "Gluten Free",
};

const CATEGORIES = ["Appetizers", "Mains", "Breads", "Rice & Biryani", "Desserts", "Drinks"];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#E7D9C0] animate-pulse">
      <div className="aspect-[4/3] bg-[#EFE6D3]" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-[#EFE6D3] rounded w-3/4" />
        <div className="h-3 bg-[#EFE6D3] rounded w-full" />
        <div className="h-3 bg-[#EFE6D3] rounded w-2/3" />
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("Appetizers");
  const [dietFilter, setDietFilter] = useState<DietFilter>("all");
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { itemCount, total } = useCart();

  // Load menu: Supabase if configured, otherwise built-in seed data.
  useEffect(() => {
    async function loadMenu() {
      if (!supabaseConfigured) {
        setAllItems(FALLBACK_ITEMS);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const items = await fetchMenuItems();
        setAllItems(items.length ? items : FALLBACK_ITEMS);
      } catch {
        // Never leave the page blank — fall back to seed data.
        setAllItems(FALLBACK_ITEMS);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  // Filter items by category and dietary preferences
  const filteredItems = allItems.filter(item => {
    if (item.category !== activeCategory) return false;
    if (!item.available) return false;
    if (dietFilter === "vegan" && !item.is_vegan) return false;
    if (dietFilter === "jain" && !item.is_jain) return false;
    if (dietFilter === "gluten_free" && !item.is_gluten_free) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-[#FBF3E3]">
      {/* Page header */}
      <section className="pt-28 md:pt-32 pb-10 md:pb-12">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="eyebrow mb-4">100% vegetarian · Cooked to order</p>
            <h1 className="display-lg text-[#1F140D] text-[clamp(2.4rem,5vw,3.7rem)]">The full menu</h1>
            <p className="text-[#1F140D]/62 mt-3 text-base md:text-lg max-w-xl leading-relaxed">
              Forty-plus dishes, spices ground fresh and everything cooked to order.
              Pick a category, build your bag, and check out for pickup or delivery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category tabs */}
      <div className="sticky top-16 md:top-[4.6rem] z-30 bg-[#FBF3E3]/92 backdrop-blur-md border-y border-[#E7D9C0]">
        <div className="container">
          <div className="flex overflow-x-auto gap-0 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-3.5 text-sm font-semibold border-b-2 transition-all duration-150 whitespace-nowrap ${
                  activeCategory === cat
                    ? "border-[#C5341B] text-[#C5341B]"
                    : "border-transparent text-[#1F140D]/55 hover:text-[#C5341B] hover:border-[#E3A210]/50"
                }`}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-8">{/* CONTENT_ANCHOR */}
        {/* Error state */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-red-900">Failed to load menu</p>
              <p className="text-sm text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Dietary filter chips */}
        <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Dietary filters">
          {(Object.keys(FILTER_LABELS) as DietFilter[]).map(filter => (
            <button
              key={filter}
              onClick={() => setDietFilter(filter)}
              aria-pressed={dietFilter === filter}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                dietFilter === filter
                  ? filter === "all"
                    ? "bg-[#C5341B] text-white border-[#C5341B]"
                    : filter === "vegan"
                    ? "bg-[#2E7D46] text-white border-[#2E7D46]"
                    : filter === "jain"
                    ? "bg-[#6B3FA0] text-white border-[#6B3FA0]"
                    : "bg-[#B45309] text-white border-[#B45309]"
                  : "bg-white text-[#1F140D]/60 border-[#E7D9C0] hover:border-[#C5341B]/50"
              }`}
            >
              {FILTER_LABELS[filter]}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🍽️</p>
            <p className="font-display text-[#1F140D]/55 text-xl">No dishes match this filter</p>
            <button
              onClick={() => setDietFilter("all")}
              className="mt-4 text-sm text-[#C5341B] underline font-semibold"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item, i) => (
              <DishCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Sticky mobile cart bar */}
      {itemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#C5341B] text-white px-4 py-3 shadow-lg">
          <Link
            href="/checkout"
            className="flex items-center justify-between w-full"
            aria-label={`View cart with ${itemCount} items, total $${total.toFixed(2)}`}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span className="font-semibold">View Cart ({itemCount})</span>
            </div>
            <span className="font-bold">${total.toFixed(2)}</span>
          </Link>
        </div>
      )}
    </main>
  );
}
