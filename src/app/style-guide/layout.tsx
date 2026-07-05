import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UI states & components",
  description: "Living style guide — the reusable UI-state components.",
  robots: { index: false, follow: false },
};

export default function StyleGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
