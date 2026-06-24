// =============================================================
// VISHVA FOODS — Cart Context
// Persisted to localStorage. Supports qty stepper, subtotal,
// tax (8.5%), delivery fee, and fulfillment toggle.
// =============================================================
import React, { createContext, useContext, useEffect, useReducer } from "react";
import type { MenuItem as MenuItemType } from "@/lib/menuData";
import type { MenuItem } from "@/lib/supabase";

export interface CartItem {
  item: MenuItem | MenuItemType;
  qty: number;
}

export type FulfillmentType = "pickup" | "delivery";

interface CartState {
  items: CartItem[];
  fulfillment: FulfillmentType;
  deliveryFee: number;
  deliveryAddress: string;
  deliveryEta: string | null;
}

type CartAction =
  | { type: "ADD_ITEM"; item: MenuItem | MenuItemType }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "SET_QTY"; id: string; qty: number }
  | { type: "CLEAR" }
  | { type: "SET_FULFILLMENT"; fulfillment: FulfillmentType }
  | { type: "SET_DELIVERY_FEE"; fee: number }
  | { type: "SET_DELIVERY_ADDRESS"; address: string }
  | { type: "SET_DELIVERY_ETA"; eta: string | null };

const TAX_RATE = 0.085;
const STORAGE_KEY = "vishva_cart";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(ci => ci.item.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(ci =>
            ci.item.id === action.item.id ? { ...ci, qty: ci.qty + 1 } : ci
          ),
        };
      }
      return { ...state, items: [...state.items, { item: action.item, qty: 1 }] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter(ci => ci.item.id !== action.id) };
    case "SET_QTY": {
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter(ci => ci.item.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map(ci =>
          ci.item.id === action.id ? { ...ci, qty: action.qty } : ci
        ),
      };
    }
    case "CLEAR":
      return { ...state, items: [] };
    case "SET_FULFILLMENT":
      return { ...state, fulfillment: action.fulfillment, deliveryFee: action.fulfillment === "pickup" ? 0 : state.deliveryFee };
    case "SET_DELIVERY_FEE":
      return { ...state, deliveryFee: action.fee };
    case "SET_DELIVERY_ADDRESS":
      return { ...state, deliveryAddress: action.address };
    case "SET_DELIVERY_ETA":
      return { ...state, deliveryEta: action.eta };
    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
  fulfillment: "pickup",
  deliveryFee: 0,
  deliveryAddress: "",
  deliveryEta: null,
};

function loadFromStorage(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...initialState, ...JSON.parse(raw) };
  } catch {}
  return initialState;
}

interface CartContextValue extends CartState {
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  setFulfillment: (f: FulfillmentType) => void;
  setDeliveryFee: (fee: number) => void;
  setDeliveryAddress: (address: string) => void;
  setDeliveryEta: (eta: string | null) => void;
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadFromStorage);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const subtotal = state.items.reduce((sum, ci) => sum + ci.item.price * ci.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + state.deliveryFee;
  const itemCount = state.items.reduce((sum, ci) => sum + ci.qty, 0);

  const value: CartContextValue = {
    ...state,
    addItem: (item) => dispatch({ type: "ADD_ITEM", item }),
    removeItem: (id) => dispatch({ type: "REMOVE_ITEM", id }),
    setQty: (id, qty) => dispatch({ type: "SET_QTY", id, qty }),
    clearCart: () => dispatch({ type: "CLEAR" }),
    setFulfillment: (f) => dispatch({ type: "SET_FULFILLMENT", fulfillment: f }),
    setDeliveryFee: (fee) => dispatch({ type: "SET_DELIVERY_FEE", fee }),
    setDeliveryAddress: (address) => dispatch({ type: "SET_DELIVERY_ADDRESS", address }),
    setDeliveryEta: (eta) => dispatch({ type: "SET_DELIVERY_ETA", eta }),
    subtotal,
    tax,
    total,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
