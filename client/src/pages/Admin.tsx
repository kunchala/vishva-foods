// =============================================================
// VISHVA FOODS — Admin Dashboard
// Token-gated (ADMIN_TOKEN). Live orders from /api/admin/orders,
// status updates, menu availability toggle, daily summary.
// =============================================================
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, TrendingUp, RefreshCw, Eye, EyeOff, LogOut } from "lucide-react";
import { fetchMenuItems, supabaseConfigured, type MenuItem } from "@/lib/supabase";
import { MENU_ITEMS as STATIC_MENU } from "@/lib/menuData";
import { toast } from "sonner";

const FALLBACK_MENU: MenuItem[] = (STATIC_MENU as any[]).map((m) => ({
  ...m, description: m.description ?? "", image_url: m.image_url ?? null, created_at: "", updated_at: "",
})) as MenuItem[];

interface OrderRow {
  id: string;
  customer_name: string;
  customer_email: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  fulfillment_type: "pickup" | "delivery";
  status: string;
  paid?: boolean;
  created_at: string;
}

const STATUS_OPTIONS = ["received", "preparing", "out_for_delivery", "delivered", "cancelled"];
const STATUS_COLORS: Record<string, string> = {
  received: "bg-blue-100 text-blue-700",
  preparing: "bg-[#D4A017]/20 text-[#B45309]",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-[#2E6B3E]/15 text-[#2E6B3E]",
  cancelled: "bg-red-100 text-red-700",
};

type AdminTab = "orders" | "menu" | "summary";
const TOKEN_KEY = "vishva_admin_token";

function getStoredToken(): string {
  try { return sessionStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; }
}

export default function AdminPage() {
  const [token, setToken] = useState<string>(getStoredToken());
  const [tokenInput, setTokenInput] = useState("");
  const [tab, setTab] = useState<AdminTab>("orders");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  const authed = Boolean(token);

  const loadOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", { headers: { "x-admin-token": token } });
      if (res.status === 401) {
        toast.error("Invalid admin token");
        setToken(""); try { sessionStorage.removeItem(TOKEN_KEY); } catch {}
        return;
      }
      if (res.ok) setOrders(await res.json());
    } catch {
      /* network error — keep last */
    } finally {
      setLoading(false);
    }
  }, [token]);

  const loadMenu = useCallback(async () => {
    if (!supabaseConfigured) { setMenuItems(FALLBACK_MENU); return; }
    try {
      const items = await fetchMenuItems();
      setMenuItems(items.length ? items : FALLBACK_MENU);
    } catch {
      setMenuItems(FALLBACK_MENU);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    loadOrders();
    loadMenu();
    const timer = setInterval(loadOrders, 15000); // live-ish feed
    return () => clearInterval(timer);
  }, [authed, loadOrders, loadMenu]);

  const handleLogin = () => {
    if (!tokenInput.trim()) return;
    setToken(tokenInput.trim());
    try { sessionStorage.setItem(TOKEN_KEY, tokenInput.trim()); } catch {}
  };

  const handleLogout = () => {
    setToken(""); setTokenInput("");
    try { sessionStorage.removeItem(TOKEN_KEY); } catch {}
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o))); // optimistic
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error("Couldn't update status");
      loadOrders();
    }
  };

  const toggleItemAvailability = async (item: MenuItem) => {
    const next = !item.available;
    setMenuItems((prev) => prev.map((m) => (m.id === item.id ? { ...m, available: next } : m)));
    if (!supabaseConfigured) return; // static fallback: in-memory only
    try {
      const res = await fetch(`/api/admin/menu/${item.id}/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ available: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error("Couldn't update item");
      loadMenu();
    }
  };

  const paidOrders = orders.filter((o) => o.paid);
  const todayRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const todayOrders = orders.length;

  // ── Login gate ──
  if (!authed) {
    return (
      <main className="min-h-screen bg-[#FEF6E8] pt-24 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-[#D4A017]/20 p-8 max-w-sm w-full">
          <h1 className="font-display font-bold text-[#1A0A00] text-2xl mb-2">Admin login</h1>
          <p className="text-sm text-[#1A0A00]/50 mb-5">Enter the admin token (set as <code>ADMIN_TOKEN</code> on the server).</p>
          <input
            type="password" value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
            placeholder="Admin token"
            className="w-full border border-[#1A0A00]/20 rounded-lg px-3 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#7B2D2D]/30 focus:border-[#7B2D2D]"
          />
          <button onClick={handleLogin} className="btn-crimson w-full justify-center">Sign in</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FEF6E8]">
      <div className="flex min-h-screen">
        <aside className="w-56 bg-[#1A0A00] text-[#FEF6E8] flex flex-col shrink-0 min-h-screen pt-6">
          <div className="px-5 mb-8">
            <span className="text-xl leading-none font-display font-bold text-[#FEF6E8]">Vishva Foods</span>
            <p className="text-xs text-[#FEF6E8]/40 mt-1">Admin dashboard</p>
          </div>
          <nav className="flex-1 px-3 space-y-1">
            {[
              { key: "orders" as AdminTab, label: "Orders", icon: <ShoppingBag className="w-4 h-4" /> },
              { key: "menu" as AdminTab, label: "Menu", icon: <UtensilsCrossed className="w-4 h-4" /> },
              { key: "summary" as AdminTab, label: "Summary", icon: <TrendingUp className="w-4 h-4" /> },
            ].map((item) => (
              <button key={item.key} onClick={() => setTab(item.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === item.key ? "bg-[#7B2D2D] text-[#FEF6E8]" : "text-[#FEF6E8]/60 hover:bg-[#FEF6E8]/10 hover:text-[#FEF6E8]"
                }`}>
                {item.icon}{item.label}
              </button>
            ))}
          </nav>
          <div className="px-3 pb-6">
            <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#FEF6E8]/40 hover:text-[#FEF6E8]/70 transition-colors">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </aside>

        <div className="flex-1 p-8 min-h-screen bg-[#FEF6E8]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display font-bold text-[#1A0A00] text-2xl flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6 text-[#7B2D2D]" />
                {tab === "orders" ? "Live orders" : tab === "menu" ? "Menu management" : "Daily summary"}
              </h1>
              <p className="text-sm text-[#1A0A00]/40 mt-0.5">
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <button onClick={() => loadOrders()} className="flex items-center gap-1.5 text-sm text-[#7B2D2D] hover:text-[#6A2626] font-medium">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>

          {tab === "orders" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-white rounded-xl border border-[#D4A017]/15 p-12 text-center">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="font-display text-[#1A0A00]/50 text-lg">No orders yet</p>
                  <p className="text-sm text-[#1A0A00]/40 mt-1">Paid orders will appear here in real time.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl border border-[#D4A017]/15 p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-sm font-bold text-[#7B2D2D]">VF-{order.id.slice(0, 8).toUpperCase()}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] || ""}`}>{order.status.replace("_", " ")}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${order.fulfillment_type === "pickup" ? "bg-[#FEF6E8] text-[#B45309]" : "bg-purple-50 text-purple-600"}`}>{order.fulfillment_type}</span>
                          {!order.paid && <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600">unpaid</span>}
                        </div>
                        <p className="font-semibold text-[#1A0A00]">{order.customer_name}</p>
                        <p className="text-xs text-[#1A0A00]/40">{order.customer_email}</p>
                        <div className="mt-2 text-xs text-[#1A0A00]/60 space-y-0.5">
                          {order.items?.map((item, i) => (
                            <p key={i}>{item.name} ×{item.qty} — ${(item.price * item.qty).toFixed(2)}</p>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#7B2D2D] text-lg">${Number(order.total).toFixed(2)}</p>
                        <p className="text-xs text-[#1A0A00]/40 mb-3">
                          {new Date(order.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-xs border border-[#1A0A00]/20 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#7B2D2D]/30">
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {tab === "menu" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-[#D4A017]/15 overflow-hidden">
              {!supabaseConfigured && (
                <div className="px-4 py-3 bg-[#FEF6E8] text-xs text-[#B45309] border-b border-[#D4A017]/15">
                  Showing seed menu. Connect Supabase to manage the live menu (toggles here are temporary until then).
                </div>
              )}
              <table className="w-full text-sm">
                <thead className="bg-[#FEF6E8] border-b border-[#D4A017]/15">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-[#1A0A00]/60">Dish</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1A0A00]/60">Category</th>
                    <th className="text-right px-4 py-3 font-semibold text-[#1A0A00]/60">Price</th>
                    <th className="text-center px-4 py-3 font-semibold text-[#1A0A00]/60">Available</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4A017]/10">
                  {menuItems.map((item) => (
                    <tr key={item.id} className={`transition-colors ${item.available ? "" : "opacity-50"}`}>
                      <td className="px-4 py-3 font-medium text-[#1A0A00]">{item.name}</td>
                      <td className="px-4 py-3 text-[#1A0A00]/50">{item.category}</td>
                      <td className="px-4 py-3 text-right text-[#7B2D2D] font-semibold">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => toggleItemAvailability(item)}
                          className={`p-1 rounded transition-colors ${item.available ? "text-[#2E6B3E]" : "text-[#1A0A00]/30"}`}
                          aria-label={item.available ? `Disable ${item.name}` : `Enable ${item.name}`}>
                          {item.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {tab === "summary" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: "Orders", value: todayOrders.toString(), icon: <ShoppingBag className="w-6 h-6" />, color: "text-[#7B2D2D]" },
                { label: "Paid revenue", value: `$${todayRevenue.toFixed(2)}`, icon: <TrendingUp className="w-6 h-6" />, color: "text-[#2E6B3E]" },
                { label: "Avg paid order", value: paidOrders.length > 0 ? `$${(todayRevenue / paidOrders.length).toFixed(2)}` : "—", icon: <LayoutDashboard className="w-6 h-6" />, color: "text-[#D4A017]" },
                { label: "Active menu items", value: menuItems.filter((i) => i.available).length.toString(), icon: <UtensilsCrossed className="w-6 h-6" />, color: "text-[#6B3FA0]" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-[#D4A017]/15 p-6">
                  <div className={`mb-3 ${stat.color}`}>{stat.icon}</div>
                  <p className={`font-display font-bold text-3xl ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-[#1A0A00]/50 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
