/**
 * Shop catalogue for Khady's Kitchen. Everything is made to order, so each
 * product carries a `leadDays` used to compute the earliest pickup date.
 * Mirrors the product data from the Shop design.
 */

export type Category = "bread" | "pastry" | "cake" | "doughnut" | "savoury";

export interface Product {
  id: string;
  name: string;
  price: number;
  cat: Category;
  catLabel: string;
  lead: string;
  leadDays: number;
  unit: string;
  shortDesc: string;
  desc: string;
  details: string[];
  img: string;
}

export const products: Product[] = [
  {
    id: "butter-croissant",
    name: "Butter Croissant",
    price: 25,
    cat: "pastry",
    catLabel: "Pastry",
    lead: "ready next morning",
    leadDays: 1,
    unit: "Baked to order · each",
    shortDesc: "27 layers of cultured butter, laminated over two days.",
    desc: "Our signature croissant - 27 layers of cultured butter, laminated over two days and baked the morning of your pickup. Shatters on cue, tender inside.",
    details: [
      "Laminated fresh for your order",
      "Best eaten within 24 hours",
      "Contains gluten, dairy",
    ],
    img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "country-sourdough",
    name: "Country Sourdough",
    price: 60,
    cat: "bread",
    catLabel: "Bread",
    lead: "needs 2 days",
    leadDays: 2,
    unit: "Per loaf · ~900g",
    shortDesc: "48-hour cold ferment, stone-milled flour, a singing crust.",
    desc: "A 48-hour cold-fermented loaf made with stone-milled flour and our seven-year-old starter. Your loaf starts fermenting the moment you order.",
    details: [
      "48-hour cold ferment - ordered, then started",
      "Keeps 3-4 days wrapped in cloth",
      "Naturally leavened - no commercial yeast",
    ],
    img: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "celebration-cake",
    name: "Celebration Cake",
    price: 350,
    cat: "cake",
    catLabel: "Cake",
    lead: "needs 3 days",
    leadDays: 3,
    unit: "Made to order · from",
    shortDesc:
      "Khady's layer cakes for birthdays, weddings and everything between.",
    desc: "Khady's made-to-order layer cakes - moist sponge, silky buttercream, finished by hand. Tell us the occasion and we'll design around it.",
    details: [
      "Order at least 3 days ahead",
      "Feeds 12-15 (base size)",
      "Custom flavors, colors and toppers available",
    ],
    img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "pastry-box",
    name: "Morning Pastry Box",
    price: 120,
    cat: "pastry",
    catLabel: "Pastry",
    lead: "ready next morning",
    leadDays: 1,
    unit: "Box of 6 · assorted",
    shortDesc:
      "Six assorted pastries baked fresh for your pickup - baker's choice.",
    desc: "Six assorted pastries baked fresh the morning you collect - croissants, pains au chocolat and whatever Khady bakes best that day. Baker's choice, made for you.",
    details: [
      "Assortment varies by day",
      "Perfect for meetings and gifting",
      "Contains gluten, dairy, may contain nuts",
    ],
    img: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "bofrot",
    name: "Bofrot",
    price: 30,
    cat: "doughnut",
    catLabel: "Bofrot",
    lead: "ready next morning",
    leadDays: 1,
    unit: "Half dozen · warm",
    shortDesc: "Golden, pillowy and lightly spiced - fried for your pickup time.",
    desc: "Golden, pillowy Ghanaian doughnuts with a hint of nutmeg - fried to be warm at your pickup time, not before.",
    details: [
      "Fried fresh for your pickup slot",
      "Lightly spiced with nutmeg",
      "Half dozen per order",
    ],
    img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "cupcake-box",
    name: "Vanilla Cupcakes",
    price: 90,
    cat: "cake",
    catLabel: "Cake",
    lead: "needs 2 days",
    leadDays: 2,
    unit: "Box of 6",
    shortDesc: "Light vanilla sponge with silky buttercream swirls.",
    desc: "Light vanilla sponge topped with silky buttercream swirls - frosted the day you collect so they arrive perfect.",
    details: [
      "Box of 6",
      "Buttercream made with real vanilla",
      "Custom colors on request",
    ],
    img: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "pain-au-chocolat",
    name: "Pain au Chocolat",
    price: 28,
    cat: "pastry",
    catLabel: "Pastry",
    lead: "ready next morning",
    leadDays: 1,
    unit: "Baked to order · each",
    shortDesc: "Two batons of dark chocolate wrapped in our croissant dough.",
    desc: "Two batons of dark chocolate wrapped in the same 27-layer croissant dough - laminated for your order and baked the morning you collect.",
    details: [
      "Baked fresh for your pickup",
      "Dark chocolate batons",
      "Contains gluten, dairy",
    ],
    img: "https://images.unsplash.com/photo-1626803775151-61d756612f97?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "cinnamon-rolls",
    name: "Cinnamon Rolls",
    price: 70,
    cat: "pastry",
    catLabel: "Pastry",
    lead: "ready next morning",
    leadDays: 1,
    unit: "Box of 4 · glazed",
    shortDesc: "Soft-swirled rolls with brown-sugar cinnamon and a warm glaze.",
    desc: "Soft-swirled rolls filled with brown-sugar cinnamon butter, glazed while still warm so it soaks in. Proofed overnight for your order.",
    details: [
      "Box of 4",
      "Glazed the morning of pickup",
      "Contains gluten, dairy",
    ],
    img: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "sugar-bread",
    name: "Sugar Bread",
    price: 30,
    cat: "bread",
    catLabel: "Bread",
    lead: "ready next morning",
    leadDays: 1,
    unit: "Per loaf · soft",
    shortDesc: "The soft, lightly sweet Ghanaian classic - pillowy inside.",
    desc: "The soft, lightly sweet Ghanaian classic - pillowy crumb, tender crust, baked fresh the morning you collect. Perfect with tea or an egg sandwich.",
    details: [
      "Baked the morning of pickup",
      "Softest eaten within 2 days",
      "Contains gluten",
    ],
    img: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "brioche-loaf",
    name: "Brioche Loaf",
    price: 65,
    cat: "bread",
    catLabel: "Bread",
    lead: "needs 2 days",
    leadDays: 2,
    unit: "Per loaf · enriched",
    shortDesc: "Butter-rich, golden and cloud-soft - proofed slow over two days.",
    desc: "Butter-rich, golden and cloud-soft. The enriched dough proofs slowly over two days, so your loaf starts the moment you order.",
    details: [
      "48-hour slow proof",
      "Makes exceptional French toast",
      "Contains gluten, dairy, egg",
    ],
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "banana-bread",
    name: "Banana Bread Loaf",
    price: 55,
    cat: "cake",
    catLabel: "Cake",
    lead: "ready next morning",
    leadDays: 1,
    unit: "Per loaf",
    shortDesc: "Dense, moist and deeply banana - made with overripe local bananas.",
    desc: "Dense, moist and deeply banana - made with overripe local bananas and brown butter, baked to order so it arrives at its peak.",
    details: [
      "Baked fresh for your order",
      "Keeps 4-5 days wrapped",
      "Contains gluten, dairy, egg",
    ],
    img: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "chocolate-fudge-cake",
    name: "Chocolate Fudge Cake",
    price: 280,
    cat: "cake",
    catLabel: "Cake",
    lead: "needs 3 days",
    leadDays: 3,
    unit: "Made to order · 8-inch",
    shortDesc: "Three dark layers under a silky fudge ganache.",
    desc: "Three dark chocolate layers under a silky fudge ganache - rich enough that a thin slice is plenty. Made entirely to order.",
    details: [
      "Order at least 3 days ahead",
      "Feeds 10-12",
      "Contains gluten, dairy, egg",
    ],
    img: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "queen-cakes",
    name: "Queen Cakes",
    price: 60,
    cat: "cake",
    catLabel: "Cake",
    lead: "needs 2 days",
    leadDays: 2,
    unit: "Box of 6",
    shortDesc: "The Ghanaian party staple - golden, buttery little cakes.",
    desc: "The Ghanaian party staple - golden, buttery little cakes with a light vanilla crumb, baked in paper cases for your order.",
    details: [
      "Box of 6",
      "A party and funeral-reception staple",
      "Contains gluten, dairy, egg",
    ],
    img: "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "meat-pies",
    name: "Meat Pies",
    price: 48,
    cat: "savoury",
    catLabel: "Savoury",
    lead: "ready next morning",
    leadDays: 1,
    unit: "Box of 4 · warm",
    shortDesc: "Flaky hand-crimped pies with spiced minced-beef filling.",
    desc: "Flaky, hand-crimped pies with a spiced minced-beef and onion filling - baked to be warm at your pickup time.",
    details: [
      "Box of 4",
      "Baked for your pickup slot",
      "Contains gluten, dairy, beef",
    ],
    img: "https://images.unsplash.com/photo-1601000938259-9e92002320b2?w=1200&q=80&auto=format&fit=crop",
  },
];

export const categoryFilters: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "All bakes" },
  { id: "bread", label: "Breads" },
  { id: "pastry", label: "Pastries" },
  { id: "cake", label: "Cakes" },
  { id: "doughnut", label: "Bofrot" },
  { id: "savoury", label: "Savoury" },
];

export type SortKey =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "fastest"
  | "name";

export const sortOptions: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price · low to high" },
  { id: "price-desc", label: "Price · high to low" },
  { id: "fastest", label: "Fastest ready" },
  { id: "name", label: "Name · A-Z" },
];

export type PriceBand = "any" | "u50" | "50-150" | "150-400" | "400+";

export const priceBands: { id: PriceBand; label: string }[] = [
  { id: "any", label: "Any price" },
  { id: "u50", label: "Under 50" },
  { id: "50-150", label: "50 - 150" },
  { id: "150-400", label: "150 - 400" },
  { id: "400+", label: "400 +" },
];

/** Whether a product's price falls inside the given band. */
export const matchesPriceBand = (p: Product, band: PriceBand) => {
  switch (band) {
    case "any":
      return true;
    case "u50":
      return p.price < 50;
    case "50-150":
      return p.price >= 50 && p.price <= 150;
    case "150-400":
      return p.price > 150 && p.price <= 400;
    case "400+":
      return p.price > 400;
  }
};

/** ISO (yyyy-mm-dd) date `days` from now, used for lead-time maths. */
export const isoDaysFromNow = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

/**
 * Can this bake be ready on or before `byDate` (yyyy-mm-dd)? An empty date
 * means "no constraint", so everything qualifies.
 */
export const readyBy = (p: Product, byDate: string) =>
  !byDate || isoDaysFromNow(p.leadDays) <= byDate;

export const waitOptions: string[] = [
  "As soon as it's ready",
  "Within 2-3 days",
  "Within a week",
  "Flexible - bake it when it's best",
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const formatPrice = (n: number) => `GHS ${n.toLocaleString()}`;

/** "from GHS 350" for the celebration cake, plain price otherwise. */
export const listPriceLabel = (p: Product) =>
  (p.id === "celebration-cake" ? "from " : "") + formatPrice(p.price);

/** "GHS 350 (base)" for the celebration cake in the cart, plain otherwise. */
export const cartPriceLabel = (p: Product) =>
  formatPrice(p.price) + (p.id === "celebration-cake" ? " (base)" : "");
