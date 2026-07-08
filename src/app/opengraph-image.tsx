import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

export const alt =
  "Khady's Kitchen - Kumasi patisserie, the authentic taste";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREAM = "#F6EFE4";
const INK = "#241A12";
const ACCENT = "#C2185B";
const LIGHT = "#FDFAF3";

export default async function OpengraphImage() {
  // The real brand logo from public/ — file conventions run on the Node
  // runtime, so it's read straight from disk and embedded as a data URI.
  const logo = await readFile(path.join(process.cwd(), "public", "logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

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
            Kumasi patisserie · The authentic taste
          </div>
          { }
          <img
            src={logoSrc}
            alt=""
            width={96}
            height={96}
            style={{ width: 96, height: 96, borderRadius: 96, objectFit: "cover" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 128, lineHeight: 1.02, letterSpacing: -2 }}>
            Khady&rsquo;s Kitchen
          </div>
          <div
            style={{
              fontSize: 42,
              marginTop: 20,
              color: "rgba(36,26,18,0.72)",
              fontFamily: "sans-serif",
            }}
          >
            Baked before sunrise, gone by noon.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 36,
              alignSelf: "flex-start",
              background: ACCENT,
              color: LIGHT,
              borderRadius: 999,
              padding: "18px 40px",
              fontSize: 32,
              fontFamily: "sans-serif",
              fontWeight: 600,
            }}
          >
            Order fresh bakes at khadyskitchen.com →
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
          <span>Kumasi, Ghana · @khadyskitchen</span>
        </div>
      </div>
    ),
    size,
  );
}
