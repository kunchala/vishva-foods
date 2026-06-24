// =============================================================
// VISHVA FOODS — DishCard
// Editorial card: photo with hover-zoom, name, price, spice level,
// dietary pills, and an add-to-cart stepper. Proud-loud styling.
// =============================================================
import { motion } from "framer-motion";
import { Plus, Minus, Flame, Leaf } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import type { MenuItem as MenuItemType } from "@/lib/menuData";
import type { MenuItem } from "@/lib/supabase";
import { toast } from "sonner";

interface DishCardProps {
  item: MenuItem | MenuItemType;
  index?: number;
}

function SpiceIndicator({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Spice level ${level} of 3`}>
      {[1, 2, 3].map((i) => (
        <Flame key={i} className={`w-3.5 h-3.5 ${i <= level ? "text-[#C5341B] fill-[#C5341B]/25" : "text-[#1F140D]/15"}`} />
      ))}
    </div>
  );
}

function DietaryPills({ item }: { item: MenuItem | MenuItemType }) {
  const pills: { label: string; cls: string }[] = [];
  if (item.is_vegan) pills.push({ label: "Vegan", cls: "bg-[#EAF1E2] text-[#2E7D46] border-[#2E7D46]/30" });
  if (item.is_jain) pills.push({ label: "Jain", cls: "bg-[#F0E9F6] text-[#6B3FA0] border-[#6B3FA0]/30" });
  if (item.is_gluten_free) pills.push({ label: "GF", cls: "bg-[#FBEFD8] text-[#9A6B0F] border-[#B45309]/30" });
  return (
    <div className="flex flex-wrap gap-1.5">
      {pills.map((p) => (
        <span key={p.label} className={`text-[0.66rem] font-bold tracking-wide px-2 py-0.5 rounded-full border backdrop-blur-sm ${p.cls}`}>
          {p.label}
        </span>
      ))}
    </div>
  );
}

export default function DishCard({ item, index = 0 }: DishCardProps) {
  const { items, addItem, setQty, removeItem } = useCart();
  const cartItem = items.find((ci) => ci.item.id === item.id);
  const qty = cartItem?.qty ?? 0;

  const handleAdd = () => {
    addItem(item as any);
    toast.success(`${item.name} added`, { description: `$${item.price.toFixed(2)}`, duration: 1800 });
  };
  const handleDecrement = () => {
    if (qty === 1) { removeItem(item.id); toast.info(`${item.name} removed`, { duration: 1400 }); }
    else setQty(item.id, qty - 1);
  };

  return (
    <motion.article
      className="dish-card group h-full"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] hover-zoom bg-[#EAF1E2]">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🍛</div>
        )}
        {(item.is_vegan || item.is_jain || item.is_gluten_free) && (
          <div className="absolute top-2.5 left-2.5"><DietaryPills item={item} /></div>
        )}
        {!item.available && (
          <div className="absolute inset-0 bg-[#1F140D]/55 flex items-center justify-center">
            <span className="text-[#FBF3E3] text-sm font-bold tracking-wide">Sold out today</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display font-bold text-[#1F140D] text-[1.12rem] leading-tight">{item.name}</h3>
          <span className="font-display text-[#C5341B] font-bold text-[1.12rem] shrink-0 tabular-nums">${item.price.toFixed(2)}</span>
        </div>

        <p className="text-[0.9rem] text-[#1F140D]/58 leading-relaxed flex-1">{item.description}</p>

        <div className="flex items-center justify-between mt-auto pt-3">
          {item.spice_level > 0
            ? <SpiceIndicator level={item.spice_level} />
            : <span className="inline-flex items-center gap-1 text-xs text-[#2E7D46] font-semibold"><Leaf className="w-3.5 h-3.5" /> Mild</span>}

          {qty === 0 ? (
            <button
              onClick={handleAdd}
              disabled={!item.available}
              className="inline-flex items-center gap-1.5 bg-[#1F140D] text-[#FBF3E3] text-sm font-semibold pl-3 pr-4 py-2 rounded-full hover:bg-[#C5341B] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label={`Add ${item.name} to cart`}
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <button onClick={handleDecrement} className="w-8 h-8 rounded-full border-2 border-[#C5341B]/35 text-[#C5341B] flex items-center justify-center hover:bg-[#C5341B] hover:text-white transition-colors" aria-label="Decrease quantity">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-5 text-center font-bold text-[#1F140D] tabular-nums">{qty}</span>
              <button onClick={handleAdd} className="w-8 h-8 rounded-full bg-[#C5341B] text-white flex items-center justify-center hover:bg-[#aa2c15] transition-colors" aria-label="Increase quantity">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
