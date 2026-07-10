import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { TitlePriceRow } from "@/components/ui/title-price-row";
import { shopProduct } from "@/lib/routes";
import { FALLBACK_PRODUCT_IMG, listPriceLabel } from "@/lib/shop-data";
import type { IProduct } from "@/types/product.types";

// Fixed tracks (not auto-fit): max three across on lg, and one or two
// featured bakes keep the same card width as a full row.
const GRID_CLASS =
  "grid grid-cols-1 gap-[clamp(20px,3vw,32px)] sm:grid-cols-2 lg:grid-cols-3";

/**
 * "This morning's bakes" — the home page's featured shop items (admin picks
 * them with the "Featured on the home page" toggle). Rendered on the server
 * from the page's cached fetch so a reload never shows a loading shelf; when
 * nothing is featured (or the shop couldn't be reached at revalidation time)
 * the section simply disappears rather than rendering empty.
 */
export function FeaturedBakes({ products }: { products: IProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section
      id="bakes"
      className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,48px)] py-[clamp(56px,8vw,100px)]"
    >
      <Reveal className="mb-[clamp(32px,5vw,52px)] flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
        <h2 className="font-serif text-[clamp(32px,4vw,52px)] font-normal">
          This morning&rsquo;s bakes
        </h2>
        <p className="text-[13px] uppercase tracking-[0.1em] text-ink/55">
          Menu changes daily
        </p>
      </Reveal>

      <div className={GRID_CLASS}>
        {products.map((product) => (
          <Reveal key={product.id} variant="zoom" className="flex">
            <Link
              href={shopProduct(product.slug)}
              className="group flex w-full flex-col overflow-hidden rounded-[18px] border border-ink/10 bg-card no-underline transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-accent/55"
            >
              <div className="relative h-[250px] overflow-hidden">
                <Image
                  src={product.image ?? FALLBACK_PRODUCT_IMG}
                  alt={product.name}
                  fill
                  sizes="(max-width: 700px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(.16,.84,.28,1)] group-hover:scale-[1.06]"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2.5 px-[26px] pb-7 pt-6">
                <TitlePriceRow
                  name={product.name}
                  price={listPriceLabel(product)}
                  nameClassName="font-serif text-[23px] font-normal"
                  priceClassName="text-[16px] font-semibold text-accent"
                />
                {product.description ? (
                  <p className="line-clamp-3 text-[15px] leading-[1.6] text-ink/70">
                    {product.description}
                  </p>
                ) : null}
                <span className="mt-auto pt-1.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-accent">
                  Order in the shop →
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
