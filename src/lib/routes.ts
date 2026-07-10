/**
 * Central route map. Pages that exist in the design but aren't built yet
 * resolve to "#" so links never 404 - swap them in when those pages land.
 */
export const routes = {
  home: "/",
  trainings: "/trainings",
  shop: "/shop",
  shopCart: "/shop/cart",
  shopCheckout: "/shop/checkout",
  shopTrack: "/shop/orders",
  gallery: "/gallery",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
} as const;

/** Detail route for a single shop product. */
export const shopProduct = (slug: string) => `/shop/${slug}`;

/** Detail page for a single training class. */
export const trainingDetail = (slug: string) => `/trainings/${slug}`;

/** Public tracking page for a placed order. */
export const shopOrder = (code: string) => `/shop/orders/${code}`;
