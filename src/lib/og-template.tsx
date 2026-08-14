import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

/**
 * Shared brand template for every Open Graph card (home, shop, trainings,
 * contact, legal): cream field, accent top rule, the real logo from public/,
 * page-specific text, and a call-to-action pill so shares invite a click.
 *
 * Satori (behind `ImageResponse`) supports only flexbox + a CSS subset - no
 * grid - so the layout stays flex-based. OG file conventions run on the Node
 * runtime, so the logo is read from disk and embedded as a data URI.
 */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const CREAM = "#F6EFE4";
const INK = "#241A12";
const ACCENT = "#C2185B";
const LIGHT = "#FDFAF3";

const DEFAULT_CTA = "Order fresh bakes at khadyskitchen.com →";

export async function brandOgImage({
  eyebrow,
  title,
  subtitle,
  cta = DEFAULT_CTA,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** The conversion line on the card - tailor it per page. */
  cta?: string;
}) {
  const logo = await readFile(path.join(process.cwd(), "public", "logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  // Scale the headline down as it gets longer so a long product/class name
  // still fits the card without overflowing.
  const titleSize = title.length > 30 ? 62 : title.length > 18 ? 84 : 104;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CREAM,
          color: INK,
          padding: "64px 80px",
          borderTop: `18px solid ${ACCENT}`,
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 24,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: ACCENT,
              fontWeight: 600,
            }}
          >
            {eyebrow}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt=""
            width={96}
            height={96}
            style={{
              width: 96,
              height: 96,
              borderRadius: 96,
              objectFit: "cover",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{ fontSize: titleSize, lineHeight: 1.04, letterSpacing: -1 }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 38,
              marginTop: 18,
              color: "rgba(36,26,18,0.72)",
              fontFamily: "sans-serif",
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              marginTop: 32,
              background: ACCENT,
              color: LIGHT,
              borderRadius: 999,
              padding: "16px 36px",
              fontSize: 30,
              fontFamily: "sans-serif",
              fontWeight: 600,
            }}
          >
            {cta}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            fontFamily: "sans-serif",
            color: "rgba(36,26,18,0.7)",
            borderTop: "1px solid rgba(36,26,18,0.18)",
            paddingTop: 24,
          }}
        >
          <span>khadyskitchen.com</span>
          <span>Khady&rsquo;s Kitchen · Kumasi, Ghana</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
