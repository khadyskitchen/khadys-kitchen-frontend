import { ShopHero } from "@/components/shop/shop-hero";
import { ShopBrowser } from "@/components/shop/shop-browser";
import { fetchPublicProductList } from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Shop · Order custom bakes",
  description:
    "Croissants, sourdough and celebration cakes - every order baked to order for pickup in Kumasi. Order online, pay your way.",
  path: "/shop",
  keywords: [
    "order bread Kumasi",
    "custom cakes Kumasi",
    "croissant order Ghana",
    "sourdough Kumasi",
    "celebration cake order",
  ],
});

export default async function ShopPage() {
  // Fetch the catalogue server-side so the list is real HTML for crawlers; the
  // client browser hydrates over it and keeps filtering/cart behaviour intact.
  const initialProducts = await fetchPublicProductList();
  return (
    <section className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,48px)] py-[clamp(48px,7vw,80px)]">
      <ShopHero />
      <ShopBrowser initialProducts={initialProducts} />
    </section>
  );
}
