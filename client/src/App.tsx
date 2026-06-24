// =============================================================
// VISHVA FOODS — App Router
// Routes: / · /menu · /checkout · /confirm/:orderId · /track/:orderId · /admin
// Global: CartProvider · Navbar · CartDrawer · Footer
// =============================================================
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import MenuPage from "./pages/Menu";
import CheckoutPage from "./pages/Checkout";
import OrderConfirmPage from "./pages/OrderConfirm";
import TrackPage from "./pages/Track";
import AdminPage from "./pages/Admin";
import NotFound from "./pages/NotFound";

function AppLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  const [location] = useLocation();

  const isAdmin = location.startsWith("/admin");

  return (
    <>
      {/* Navbar — hidden on admin (admin has its own sidebar) */}
      {!isAdmin && <Navbar onCartOpen={() => setCartOpen(true)} />}

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Page routes */}
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/menu" component={MenuPage} />
        <Route path="/checkout" component={CheckoutPage} />
        <Route path="/confirm/:orderId" component={OrderConfirmPage} />
        <Route path="/track" component={TrackPage} />
        <Route path="/track/:orderId" component={TrackPage} />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>

      {/* Footer — hidden on admin */}
      {!isAdmin && <Footer />}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CartProvider>
          <TooltipProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "white",
                  border: "1px solid rgba(212, 160, 23, 0.2)",
                  color: "#1A0A00",
                },
              }}
            />
            <AppLayout />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
