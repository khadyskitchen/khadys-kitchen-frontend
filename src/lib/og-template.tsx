import { ImageResponse } from "next/og";

/**
 * Shared brand template for the shop/trainings Open Graph cards, mirroring the
 * site-wide `app/opengraph-image.tsx` (cream field, accent top rule, KK badge)
 * with page-specific text. Keeps the four route OG files down to one line.
 *
 * Satori (behind `ImageResponse`) supports only flexbox + a CSS subset — no
 * grid — so the layout stays flex-based.
 */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const CREAM = "#F6EFE4";
const INK = "#241A12";
const ACCENT = "#C2185B";
const LIGHT = "#FDFAF3";

export function brandOgImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
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
          padding: "72px 80px",
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 96,
              background: ACCENT,
              color: LIGHT,
              fontSize: 44,
            }}
          >
            KK
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: titleSize, lineHeight: 1.04, letterSpacing: -1 }}>
            {title}
          </div>
          <div
            style={{
              fontSize: 38,
              marginTop: 20,
              color: "rgba(36,26,18,0.72)",
              fontFamily: "sans-serif",
            }}
          >
            {subtitle}
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
            paddingTop: 28,
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
