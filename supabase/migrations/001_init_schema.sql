-- =============================================================
-- VISHVA FOODS — Supabase Schema
-- Tables: menu_items, orders, order_status_log
-- RLS: Customers see only their own orders; admin service role sees all
-- =============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── MENU_ITEMS TABLE ──
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  spice_level INT DEFAULT 0 CHECK (spice_level >= 0 AND spice_level <= 3),
  is_vegan BOOLEAN DEFAULT FALSE,
  is_jain BOOLEAN DEFAULT FALSE,
  is_gluten_free BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ORDERS TABLE ──
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  tax NUMERIC(10, 2) NOT NULL,
  delivery_fee NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  fulfillment_type TEXT NOT NULL CHECK (fulfillment_type IN ('pickup', 'delivery')),
  pickup_address_sent BOOLEAN DEFAULT FALSE,
  delivery_address JSONB,
  status TEXT DEFAULT 'received' CHECK (status IN ('received', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  stripe_payment_intent_id TEXT,
  doordash_delivery_id TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ORDER_STATUS_LOG TABLE ──
CREATE TABLE IF NOT EXISTS order_status_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  note TEXT
);

-- ── INDEXES ──
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_fulfillment ON orders(fulfillment_type);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_available ON menu_items(available);
CREATE INDEX idx_order_status_log_order_id ON order_status_log(order_id);

-- ── ROW LEVEL SECURITY ──
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_log ENABLE ROW LEVEL SECURITY;

-- Menu items: public read
CREATE POLICY "menu_items_public_read" ON menu_items
  FOR SELECT USING (true);

-- Orders: customers see only their own orders
CREATE POLICY "orders_customer_read" ON orders
  FOR SELECT USING (
    auth.jwt() ->> 'email' = customer_email OR
    auth.role() = 'service_role'
  );

-- Orders: customers can insert their own orders
CREATE POLICY "orders_customer_insert" ON orders
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'email' = customer_email OR
    auth.role() = 'service_role'
  );

-- Orders: admin (service role) can update
CREATE POLICY "orders_admin_update" ON orders
  FOR UPDATE USING (auth.role() = 'service_role');

-- Order status log: customers see their own order logs
CREATE POLICY "order_status_log_customer_read" ON order_status_log
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE
      auth.jwt() ->> 'email' = customer_email OR
      auth.role() = 'service_role'
    )
  );

-- Order status log: admin can insert
CREATE POLICY "order_status_log_admin_insert" ON order_status_log
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- ── ENABLE REALTIME ──
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_status_log;
