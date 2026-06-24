// =============================================================
// VISHVA FOODS — SEO Hook
// Manages meta tags, structured data, and Open Graph tags
// =============================================================
import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "business.business";
  structuredData?: Record<string, any>;
}

export function useSEO({
  title = "Vishva Foods - Homemade Indian Food, Cloud-Delivered",
  description = "100% vegetarian ghost kitchen in Ashburn, VA. Fresh Indian food made from scratch, delivered or picked up. Order now.",
  image = "https://d2xsxph8kpxj0f.cloudfront.net/310519663781663397/2jwpwjr5nv5QBSxpW7CDxW/vishva-hero-bg-S9TouKLPBghCFb6aWsadN3.webp",
  url = "https://vishvaindianfoods.com",
  type = "business.business",
  structuredData,
}: SEOProps = {}) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      let element = document.querySelector(`meta[${isProperty ? "property" : "name"}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(isProperty ? "property" : "name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Standard meta tags
    updateMeta("description", description);
    updateMeta("viewport", "width=device-width, initial-scale=1.0");
    updateMeta("theme-color", "#7B2D2D");

    // Open Graph tags
    updateMeta("og:title", title, true);
    updateMeta("og:description", description, true);
    updateMeta("og:image", image, true);
    updateMeta("og:url", url, true);
    updateMeta("og:type", type, true);
    updateMeta("og:site_name", "Vishva Foods", true);

    // Twitter Card tags
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", image);

    // Canonical URL
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    // Structured data (JSON-LD)
    if (structuredData) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.setAttribute("type", "application/ld+json");
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    }

    return () => {
      // Cleanup is optional — meta tags persist across navigation
    };
  }, [title, description, image, url, type, structuredData]);
}

// Structured data templates
export const RESTAURANT_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Vishva Foods",
  description: "100% vegetarian Indian ghost kitchen. Handpicked ingredients, no preservatives.",
  image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663781663397/2jwpwjr5nv5QBSxpW7CDxW/vishva-logo-icon-fj3kq3SjByybTaphnhZVoA.webp",
  url: "https://vishvaindianfoods.com",
  telephone: "+1-703-555-0000",
  address: {
    "@type": "PostalAddress",
    streetAddress: "23372 Longollen Woods Terrace",
    addressLocality: "Ashburn",
    addressRegion: "VA",
    postalCode: "20147",
    addressCountry: "US",
  },
  priceRange: "$$",
  servesCuisine: "Indian",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "11:00",
      closes: "21:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Monday",
      opens: "CLOSED",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "200",
  },
  sameAs: ["https://instagram.com/vishvaindianfoods", "https://ubereats.com", "https://grubhub.com"],
};

export const MENU_ITEM_STRUCTURED_DATA = (item: any) => ({
  "@context": "https://schema.org",
  "@type": "MenuItem",
  name: item.name,
  description: item.description,
  image: item.image_url,
  offers: {
    "@type": "Offer",
    price: item.price,
    priceCurrency: "USD",
  },
});
