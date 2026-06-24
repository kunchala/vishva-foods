// =============================================================
// VISHVA FOODS — Homepage  ("Proud Home Kitchen")
// A bold, warm, unapologetic home kitchen. Split light hero with
// a real thali + rotating stamp signature, a spice ribbon, the
// featured dishes, the home-kitchen story (the differentiator),
// a saturated coriander-green menu index, an honest how-it-works,
// the kitchen's own promise, a loud chili CTA, and marketplaces.
// =============================================================
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ArrowDown, Leaf, Flame, Clock, MapPin, Soup, Sparkles } from "lucide-react";
import DishCard from "@/components/DishCard";
import SpiceRibbon from "@/components/SpiceRibbon";
import { FEATURED_DISHES, MENU_ITEMS } from "@/lib/menuData";

const HERO_IMG = "/img/hero.jpg";
const SPICES_IMG = "/img/spices.jpg";
const COOK_IMG = "/img/cook.jpg";

const RIBBON = [
  "Palak Paneer", "Dal Makhani", "Veg Biryani", "Masala Dosa", "Chana Masala",
  "Malai Kofta", "Gulab Jamun", "Mango Lassi", "Baingan Bharta", "Garlic Naan",
];

// Curated menu index, grouped by region — real dishes, real prices.
const INDEX_GROUPS: { region: string; names: string[] }[] = [
  { region: "From the North", names: ["Dal Makhani", "Paneer Butter Masala", "Palak Paneer", "Malai Kofta"] },
  { region: "Street & snacks", names: ["Samosa (2 pcs)", "Paneer Tikka", "Hara Bhara Kabab"] },
  { region: "Rice & biryani", names: ["Veg Biryani", "Jeera Rice", "Coconut Rice"] },
  { region: "Something sweet", names: ["Gulab Jamun (3 pcs)", "Kheer", "Mango Kulfi"] },
];
const priceOf = (name: string) => MENU_ITEMS.find((m) => m.name === name)?.price;

const STEPS = [
  { n: "01", title: "Pick your dishes", body: "Browse 40+ vegetarian dishes and build your order — mild to fiery, with Jain and vegan options.", icon: Soup },
  { n: "02", title: "We cook to order", body: "Nothing sits in a warmer. Spices are ground fresh and every curry is simmered once you order.", icon: Flame },
  { n: "03", title: "Pickup or delivery", body: "Grab it from our Ashburn kitchen, or have it couriered to your door, hot and fresh.", icon: MapPin },
];

const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <main className="bg-[#FBF3E3] overflow-x-hidden">
      {/* ════════════════ HERO ════════════════ */}
      <section className="relative min-h-[100svh] flex items-stretch">
        <div className="container w-full grid lg:grid-cols-12 items-center gap-10 lg:gap-8 pt-28 lg:pt-24 pb-14">
          {/* Copy */}
          <div className="lg:col-span-7 max-w-2xl">
            <motion.p
              className="eyebrow mb-6"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
            >
              100% vegetarian · Cooked to order · Ashburn VA
            </motion.p>

            <motion.h1
              className="display-xl text-[#1F140D] text-[clamp(2.9rem,7.2vw,5.6rem)] mb-7"
              initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.06, ease }}
            >
              <span className="block">
                The whole{" "}
                <span className="relative inline-block text-[#C5341B]">
                  world
                  <svg className="absolute -bottom-2 left-0 w-full" height="14" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M2,9 C50,3 150,3 198,8" stroke="#E3A210" strokeWidth="5" fill="none" strokeLinecap="round" />
                  </svg>
                </span>,
              </span>
              <span className="block">cooked to order.</span>
            </motion.h1>

            <motion.p
              className="text-[#1F140D]/68 text-lg md:text-xl leading-relaxed mb-8 max-w-xl"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18, ease }}
            >
              A one-person home kitchen in Ashburn. Spices ground fresh the morning
              we cook, curries simmered to order — never batch-made, never frozen.
              Just pickup or delivery, the way real home food should taste.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-3.5"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.28, ease }}
            >
              <Link href="/menu" className="btn btn-chili">
                Order now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/menu" className="btn btn-outline">See the menu</Link>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-8 text-sm text-[#1F140D]/60"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="inline-flex items-center gap-1.5"><Leaf className="w-4 h-4 text-[#2E7D46]" /> 100% vegetarian</span>
              <span className="text-[#E7D9C0]">|</span>
              <span className="inline-flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-[#E3A210]" /> No onion / garlic on request</span>
              <span className="text-[#E7D9C0]">|</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#C5341B]" /> Same-day pickup</span>
            </motion.div>
          </div>

          {/* Image + stamp signature */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2, ease }}
          >
            <div className="relative rounded-[1.75rem] overflow-hidden aspect-[4/5] sm:aspect-[5/5] lg:aspect-[4/5] shadow-[0_40px_80px_-40px_rgba(31,20,13,0.55)] ring-1 ring-[#1F140D]/8">
              <img src={HERO_IMG} alt="A vegetarian Indian thali — naan, papad and three curries" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F140D]/25 to-transparent" />
            </div>

            {/* Rotating stamp */}
            <div className="absolute -left-5 -bottom-5 sm:-left-7 sm:-bottom-7">
              <div className="relative w-[112px] h-[112px] sm:w-[128px] sm:h-[128px]">
                <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full stamp-spin">
                  <defs>
                    <path id="stampRing" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                  </defs>
                  <circle cx="60" cy="60" r="58" fill="#C5341B" />
                  <text style={{ fontFamily: "Hanken Grotesk, sans-serif", fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.14em", fill: "#FBF3E3" }}>
                    <textPath href="#stampRing" startOffset="0">VISHVA FOODS · COOKED TO ORDER · </textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Leaf className="w-8 h-8 sm:w-9 sm:h-9 text-[#E3A210]" strokeWidth={2.2} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-[#1F140D]/40">
          <span className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase">Scroll</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* ════════ SPICE RIBBON ════════ */}
      <SpiceRibbon items={RIBBON} variant="turmeric" />

      {/* ════════════════ FEATURED ════════════════ */}
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <p className="eyebrow mb-4">Crowd favorites</p>
              <h2 className="display-lg text-[#1F140D] text-[clamp(2.1rem,4.2vw,3.2rem)]">
                Tonight's favorites
              </h2>
            </div>
            <Link href="/menu" className="btn btn-outline btn-sm self-end">
              All 40+ dishes <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {FEATURED_DISHES.map((dish, i) => (
              <DishCard key={dish.id} item={dish} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ STORY (the differentiator) ════════════════ */}
      <section className="py-20 md:py-28 bg-[#EAF1E2]">
        <div className="container grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Images */}
          <Reveal className="relative">
            <div className="rounded-[1.5rem] overflow-hidden aspect-[4/3] shadow-[0_30px_60px_-36px_rgba(31,20,13,0.5)]">
              <img src={SPICES_IMG} alt="Whole spices, chillies and herbs laid out before grinding" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -right-4 sm:-right-8 w-40 sm:w-52 rounded-2xl overflow-hidden border-[6px] border-[#EAF1E2] shadow-xl rotate-2">
              <img src={COOK_IMG} alt="A freshly served vegetarian thali" className="w-full h-full object-cover aspect-square" />
            </div>
          </Reveal>

          {/* Copy */}
          <Reveal delay={0.1}>
            <p className="eyebrow mb-5">Our kitchen</p>
            <h2 className="display-lg text-[#1F140D] text-[clamp(2.1rem,4.4vw,3.3rem)] mb-6">
              One cook. One kitchen.<br />Everything made to order.
            </h2>
            <div className="space-y-4 text-[#1F140D]/72 text-lg leading-relaxed max-w-xl">
              <p>
                Vishva isn't a restaurant or a factory. It's a home kitchen, run by one
                person who grew up around these dishes — and cooks them the same way:
                masalas ground fresh, dals slow-simmered, paneer made for the order in front of them.
              </p>
              <p>
                There are no freezers full of batch curry here. When you order, that's when
                we start cooking. It's slower than a takeaway counter, and that's the whole point.
              </p>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-3 gap-4 mt-9 max-w-lg">
              {[
                { k: "100%", v: "Vegetarian" },
                { k: "40+", v: "Dishes" },
                { k: "0", v: "Freezers" },
              ].map((s) => (
                <div key={s.v} className="border-l-2 border-[#2E7D46]/40 pl-4">
                  <div className="font-display font-extrabold text-[#C5341B] text-3xl md:text-4xl leading-none">{s.k}</div>
                  <div className="text-sm text-[#1F140D]/60 mt-1.5 font-medium">{s.v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════ MENU INDEX (bold coriander block) ════════════════ */}
      <section className="grain py-20 md:py-28 bg-[#234D31] text-[#FBF3E3]">
        <div className="container relative z-10">
          <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <p className="eyebrow eyebrow-light mb-4">The menu, in brief</p>
              <h2 className="display-lg text-[#FBF3E3] text-[clamp(2.1rem,4.4vw,3.3rem)]">
                From dal to dessert
              </h2>
            </div>
            <Link href="/menu" className="btn btn-turmeric btn-sm self-end">
              See the full menu <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-x-14 gap-y-10">
            {INDEX_GROUPS.map((group) => (
              <Reveal key={group.region}>
                <h3 className="tag !text-[#E3A210] mb-4">{group.region}</h3>
                <ul className="space-y-3.5">
                  {group.names.map((name) => {
                    const price = priceOf(name);
                    if (price == null) return null;
                    return (
                      <li key={name} className="lead-row">
                        <span className="font-display font-semibold text-[1.05rem] text-[#FBF3E3]">{name}</span>
                        <span className="lead-dots !border-[#FBF3E3]/25" />
                        <span className="font-display font-bold text-[#E3A210] tabular-nums">${price.toFixed(2)}</span>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ HOW IT WORKS ════════════════ */}
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <p className="eyebrow eyebrow-plain justify-center mb-4">How it works</p>
            <h2 className="display-lg text-[#1F140D] text-[clamp(2.1rem,4.4vw,3.3rem)]">
              Three steps to dinner
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.1}>
                <div className="relative h-full rounded-2xl border-2 border-[#E7D9C0] bg-white/60 p-7 hover:border-[#E3A210]/60 transition-colors">
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-display font-extrabold text-5xl text-[#E7D9C0] leading-none">{step.n}</span>
                    <span className="w-11 h-11 rounded-full bg-[#C5341B] text-[#FBF3E3] flex items-center justify-center">
                      <step.icon className="w-5 h-5" />
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#1F140D] mb-2.5">{step.title}</h3>
                  <p className="text-[#1F140D]/64 leading-relaxed">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ KITCHEN'S PROMISE (pull quote) ════════════════ */}
      <section className="py-16 md:py-24 bg-[#FBF3E3]">
        <div className="container">
          <Reveal className="max-w-4xl mx-auto text-center">
            <div className="text-[#E3A210] text-6xl font-display leading-none mb-2">“</div>
            <p className="font-display font-bold text-[#1F140D] text-[clamp(1.7rem,3.6vw,2.7rem)] leading-tight text-balance">
              I cook every single order the way I'd cook for my own family —
              fresh, by hand, and never frozen.
            </p>
            <div className="flex items-center justify-center gap-3 mt-7">
              <span className="w-9 h-9 rounded-full bg-[#C5341B] flex items-center justify-center">
                <Leaf className="w-4.5 h-4.5 text-[#E3A210]" />
              </span>
              <span className="text-[#1F140D]/70 font-semibold">The Vishva Foods kitchen · Ashburn, VA</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════ CLOSING CTA (loud chili) ════════════════ */}
      <section className="grain py-20 md:py-28 bg-[#C5341B] text-[#FBF3E3]">
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <Reveal>
            <p className="eyebrow eyebrow-light eyebrow-plain justify-center mb-5">Hungry yet?</p>
            <h2 className="display-xl text-[#FBF3E3] text-[clamp(2.6rem,6vw,4.6rem)] mb-6">
              Let's get you fed.
            </h2>
            <p className="text-[#FBF3E3]/85 text-lg md:text-xl leading-relaxed mb-9 max-w-xl mx-auto">
              Real vegetarian Indian food, cooked to order in a home kitchen and sent
              straight to your table. Pickup or delivery across Ashburn.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/menu" className="btn btn-turmeric">
                Order now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/track" className="btn btn-outline-cream">Track an order</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════ MARKETPLACES ════════════════ */}
      <section className="py-12 border-t border-[#E7D9C0]">
        <div className="container flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
          <span className="text-sm font-semibold text-[#1F140D]/55">Prefer your usual app? Find us on</span>
          <div className="flex items-center gap-2.5">
            {["DoorDash", "Uber Eats", "Grubhub"].map((m) => (
              <span key={m} className="pill-soft text-[0.82rem]">{m}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
