// =============================================================
// VISHVA FOODS — Order Confirmation Email Template
// React Email component for order confirmation
// =============================================================
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface OrderConfirmationEmailProps {
  orderId: string;
  customerName: string;
  items: Array<{ name: string; qty: number; price: number }>;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  fulfillmentType: "pickup" | "delivery";
  pickupAddress?: string;
  deliveryAddress?: string;
  estimatedTime: string;
}

export default function OrderConfirmationEmail({
  orderId,
  customerName,
  items,
  subtotal,
  tax,
  deliveryFee,
  total,
  fulfillmentType,
  pickupAddress,
  deliveryAddress,
  estimatedTime,
}: OrderConfirmationEmailProps) {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://vishvaindianfoods.com";

  return (
    <Html>
      <Head />
      <Preview>Order confirmed! #{orderId}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>🍛 Vishva Foods</Text>
            <Text style={headerText}>Order Confirmed!</Text>
          </Section>

          {/* Order ID */}
          <Section style={content}>
            <Text style={greeting}>Hi {customerName},</Text>
            <Text style={paragraph}>
              Thank you for your order! We've received your payment and are preparing your delicious meal.
            </Text>

            <Section style={orderIdBox}>
              <Text style={orderIdLabel}>Order ID</Text>
              <Text style={orderIdValue}>{orderId}</Text>
              <Text style={orderIdSubtext}>Estimated {fulfillmentType}: {estimatedTime}</Text>
            </Section>
          </Section>

          {/* Order Items */}
          <Section style={content}>
            <Text style={sectionTitle}>Order Summary</Text>
            {items.map((item, i) => (
              <Row key={i} style={itemRow}>
                <Text style={itemName}>{item.name}</Text>
                <Text style={itemQty}>×{item.qty}</Text>
                <Text style={itemPrice}>${(item.price * item.qty).toFixed(2)}</Text>
              </Row>
            ))}

            <Hr style={divider} />

            <Row style={totalRow}>
              <Text style={totalLabel}>Subtotal</Text>
              <Text style={totalValue}>${subtotal.toFixed(2)}</Text>
            </Row>
            <Row style={totalRow}>
              <Text style={totalLabel}>Tax (8.5%)</Text>
              <Text style={totalValue}>${tax.toFixed(2)}</Text>
            </Row>
            {fulfillmentType === "delivery" && (
              <Row style={totalRow}>
                <Text style={totalLabel}>Delivery Fee</Text>
                <Text style={totalValue}>${deliveryFee.toFixed(2)}</Text>
              </Row>
            )}

            <Row style={grandTotalRow}>
              <Text style={grandTotalLabel}>Total</Text>
              <Text style={grandTotalValue}>${total.toFixed(2)}</Text>
            </Row>
          </Section>

          {/* Fulfillment Details */}
          <Section style={content}>
            <Text style={sectionTitle}>
              {fulfillmentType === "pickup" ? "Pickup Details" : "Delivery Details"}
            </Text>
            {fulfillmentType === "pickup" ? (
              <>
                <Text style={paragraph}>
                  Your order will be ready in <strong>25–35 minutes</strong>.
                </Text>
                <Text style={addressBox}>
                  📍 {pickupAddress || "Ashburn, VA"}
                </Text>
              </>
            ) : (
              <>
                <Text style={paragraph}>
                  Your order will be delivered in <strong>{estimatedTime}</strong>.
                </Text>
                <Text style={addressBox}>
                  📍 {deliveryAddress || "Your delivery address"}
                </Text>
              </>
            )}
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Button style={button} href={`${baseUrl}/track/${orderId}`}>
              Track Your Order
            </Button>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Hr style={divider} />
            <Text style={footerText}>
              Questions? Reply to this email or call <Link href="tel:+17035550000">+1 (703) 555-0000</Link>
            </Text>
            <Text style={footerText}>
              Vishva Foods · The World on Your Plate
            </Text>
            <Text style={footerSubtext}>
              © 2026 Vishva Foods. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#FEF6E8",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const header = {
  backgroundColor: "#7B2D2D",
  borderRadius: "5px 5px 0 0",
  color: "#FEF6E8",
  padding: "20px 48px",
  textAlign: "center" as const,
};

const logo = {
  fontSize: "24px",
  fontWeight: "bold" as const,
  margin: "0",
};

const headerText = {
  fontSize: "20px",
  fontWeight: "600" as const,
  margin: "8px 0 0 0",
};

const content = {
  border: "1px solid #D4A017",
  borderRadius: "5px",
  overflow: "hidden" as const,
  padding: "40px 20px",
  marginBottom: "20px",
};

const greeting = {
  fontSize: "16px",
  fontWeight: "600" as const,
  margin: "0 0 12px 0",
  color: "#1A0A00",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0 0 12px 0",
  color: "#1A0A00",
};

const orderIdBox = {
  backgroundColor: "#FEF6E8",
  borderLeft: "4px solid #D4A017",
  padding: "16px",
  marginTop: "20px",
  marginBottom: "20px",
};

const orderIdLabel = {
  fontSize: "12px",
  fontWeight: "600" as const,
  color: "#1A0A00",
  margin: "0",
  textTransform: "uppercase" as const,
};

const orderIdValue = {
  fontSize: "24px",
  fontWeight: "bold" as const,
  color: "#7B2D2D",
  margin: "4px 0",
  fontFamily: "monospace",
};

const orderIdSubtext = {
  fontSize: "12px",
  color: "#1A0A00",
  margin: "0",
};

const sectionTitle = {
  fontSize: "16px",
  fontWeight: "600" as const,
  margin: "0 0 16px 0",
  color: "#1A0A00",
};

const itemRow = {
  display: "flex" as const,
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid #D4A017",
};

const itemName = {
  fontSize: "14px",
  color: "#1A0A00",
  margin: "0",
  flex: 1,
};

const itemQty = {
  fontSize: "14px",
  color: "#1A0A00",
  margin: "0",
  width: "40px",
  textAlign: "center" as const,
};

const itemPrice = {
  fontSize: "14px",
  fontWeight: "600" as const,
  color: "#7B2D2D",
  margin: "0",
  width: "80px",
  textAlign: "right" as const,
};

const divider = {
  borderColor: "#D4A017",
  margin: "16px 0",
};

const totalRow = {
  display: "flex" as const,
  justifyContent: "space-between",
  padding: "8px 0",
};

const totalLabel = {
  fontSize: "14px",
  color: "#1A0A00",
  margin: "0",
};

const totalValue = {
  fontSize: "14px",
  color: "#1A0A00",
  margin: "0",
  fontWeight: "600" as const,
};

const grandTotalRow = {
  display: "flex" as const,
  justifyContent: "space-between",
  padding: "12px 0",
  marginTop: "8px",
  borderTop: "2px solid #7B2D2D",
};

const grandTotalLabel = {
  fontSize: "16px",
  fontWeight: "bold" as const,
  color: "#1A0A00",
  margin: "0",
};

const grandTotalValue = {
  fontSize: "16px",
  fontWeight: "bold" as const,
  color: "#7B2D2D",
  margin: "0",
};

const addressBox = {
  backgroundColor: "#FEF6E8",
  padding: "12px",
  borderRadius: "4px",
  fontSize: "14px",
  color: "#1A0A00",
  margin: "12px 0",
};

const ctaSection = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#7B2D2D",
  borderRadius: "4px",
  color: "#FEF6E8",
  fontSize: "16px",
  fontWeight: "600" as const,
  padding: "12px 32px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
};

const footer = {
  color: "#1A0A00",
  fontSize: "12px",
  lineHeight: "16px",
};

const footerText = {
  margin: "0 0 8px 0",
  fontSize: "12px",
  color: "#1A0A00",
};

const footerSubtext = {
  margin: "0",
  fontSize: "11px",
  color: "#1A0A00",
  opacity: 0.5,
};
