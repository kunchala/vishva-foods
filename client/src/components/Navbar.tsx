// =============================================================
// VISHVA FOODS — Navbar
// Ink type throughout (hero is light). Transparent at the top of
// the home page, solid rice "glass" on scroll and on other pages.
// =============================================================
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu as MenuIcon, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface NavbarProps {
  onCartOpen?: () => void;
}

export default function Navbar({ onCartOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/track", label: "Track" },
  ];

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  const isHome = location === "/";
  const solid = !isHome || scrolled || mobileOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-[#FBF3E3]/92 backdrop-blur-md border-b border-[#E7D9C0] shadow-[0_10px_30px_-24px_rgba(31,20,13,0.7)]"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-[4.6rem]">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="Vishva Foods home">
          <img src="/icon.svg" alt="" className="w-8 h-8 md:w-9 md:h-9 transition-transform duration-300 group-hover:-rotate-6" />
          <span className="font-display text-[1.6rem] md:text-[1.75rem] font-extrabold leading-none tracking-tight select-none">
            <span className="text-[#1F140D]">Vishva</span>
            <span className="text-[#C5341B]"> Foods</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-[0.95rem] font-semibold transition-colors duration-150 ${
                isActive(link.href) ? "text-[#C5341B]" : "text-[#1F140D]/72 hover:text-[#1F140D]"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-[#C5341B] rounded-full" />
              )}
            </Link>
          ))}
          <Link href="/menu" className="btn btn-chili btn-sm">
            Order now
          </Link>
          <button
            onClick={onCartOpen}
            className="relative p-2 rounded-full text-[#1F140D] hover:bg-[#1F140D]/8 transition-colors"
            aria-label={`Cart, ${itemCount} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#C5341B] text-[#FBF3E3] text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                {itemCount}
              </span>
            )}
          </button>
        </nav>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={onCartOpen}
            className="relative p-2 rounded-full text-[#1F140D]"
            aria-label={`Cart, ${itemCount} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#C5341B] text-[#FBF3E3] text-[10px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1">
                {itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="p-2 rounded-full text-[#1F140D]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#FBF3E3] border-t border-[#E7D9C0]">
          <nav className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3 px-2 rounded-lg font-semibold ${isActive(link.href) ? "text-[#C5341B] bg-[#C5341B]/6" : "text-[#1F140D]/80"}`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/menu" className="btn btn-chili justify-center mt-2">Order now</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
