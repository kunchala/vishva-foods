// =============================================================
// VISHVA FOODS — Footer
// Rich clove-dark footer with grain, brand mark, links, hours.
// =============================================================
import { Link } from "wouter";
import { Instagram, Phone, Clock, MapPin } from "lucide-react";
import SpiceRibbon from "./SpiceRibbon";

export default function Footer() {
  return (
    <footer>
      {/* Closing ribbon ties back to the hero motif */}
      <SpiceRibbon items={["Made to order", "Freshly ground", "100% vegetarian", "Pickup or delivery", "Ashburn VA"]} variant="turmeric" />

      <div className="grain relative bg-[#1A0D07] text-[#FEF6E8] overflow-hidden">
        <div className="container relative z-10 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-2.5 mb-4" aria-label="Vishva Foods home">
                <img src="/icon.svg" alt="" className="w-10 h-10" />
                <span className="font-display text-2xl font-extrabold leading-none tracking-tight select-none">
                  <span className="text-[#FEF6E8]">Vishva</span>
                  <span className="text-[#E3A210]"> Foods</span>
                </span>
              </Link>
              <p className="text-sm text-[#FEF6E8]/60 leading-relaxed max-w-xs">
                A family kitchen in Ashburn cooking vegetarian Indian food to order —
                spices ground fresh, curries finished by hand, no dine-in by design.
              </p>
              <a
                href="https://instagram.com/vishvaindianfoods"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 text-[#D4A017] hover:text-[#FEF6E8] transition-colors text-sm font-medium"
                aria-label="Vishva Foods on Instagram"
              >
                <Instagram className="w-4 h-4" /> @vishvaindianfoods
              </a>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4A017] mb-5">Explore</h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  { href: "/menu", label: "Full Menu" },
                  { href: "/track", label: "Track Order" },
                  { href: "/checkout", label: "Checkout" },
                  { href: "/admin", label: "Admin" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[#FEF6E8]/60 hover:text-[#D4A017] transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FEF6E8]/40 mb-3">Also order on</h4>
                <div className="flex gap-3">
                  <a href="https://ubereats.com" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-[#FEF6E8]/60 hover:text-[#FEF6E8] transition-colors border border-[#FEF6E8]/20 px-3 py-1.5 rounded-full">Uber Eats</a>
                  <a href="https://grubhub.com" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-[#FEF6E8]/60 hover:text-[#FEF6E8] transition-colors border border-[#FEF6E8]/20 px-3 py-1.5 rounded-full">Grubhub</a>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4A017] mb-5">Hours &amp; Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5 text-[#FEF6E8]/60">
                  <MapPin className="w-4 h-4 mt-0.5 text-[#D4A017] shrink-0" />
                  <span>Serving Ashburn, VA · Pickup or delivery only</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#FEF6E8]/60">
                  <Phone className="w-4 h-4 text-[#D4A017] shrink-0" />
                  <a href="tel:+17035550000" className="hover:text-[#D4A017] transition-colors">+1 (703) 555-0000</a>
                </li>
                <li className="flex items-start gap-2.5 text-[#FEF6E8]/60">
                  <Clock className="w-4 h-4 mt-0.5 text-[#D4A017] shrink-0" />
                  <div><div>Tue–Sun · 11:00 AM – 9:00 PM</div><div>Monday · Closed</div></div>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-[#FEF6E8]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FEF6E8]/40">
            <p>© {new Date().getFullYear()} Vishva Foods. All rights reserved.</p>
            <p className="font-display italic text-[#D4A017]/70">The world on your plate.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
