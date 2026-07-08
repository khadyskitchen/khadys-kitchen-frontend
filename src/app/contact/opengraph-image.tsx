import { ImageResponse } from "next/og";

export const alt = "Contact Khady's Kitchen - Kumasi patisserie";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREAM = "#F6EFE4";
const INK = "#241A12";
const ACCENT = "#C2185B";
const LIGHT = "#FDFAF3";

export default function OpengraphImage() {
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
            Get in touch · Kumasi, Ghana
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
          <div style={{ fontSize: 116, lineHeight: 1.02, letterSpacing: -2 }}>
            Contact us
          </div>
          <div
            style={{
              fontSize: 42,
              marginTop: 20,
              color: "rgba(36,26,18,0.72)",
              fontFamily: "sans-serif",
            }}
          >
            WhatsApp, email, or drop by — orders and class enrolment reach a
            human.
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
