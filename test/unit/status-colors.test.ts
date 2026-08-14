import { describe, it, expect } from "vitest";
import { getStatusColor } from "@/lib/status-colors";

describe("getStatusColor", () => {
  it("is case-insensitive", () => {
    expect(getStatusColor("approved")).toEqual(getStatusColor("APPROVED"));
    expect(getStatusColor("Ready")).toEqual(getStatusColor("READY"));
  });

  it("returns distinct colors for distinct statuses", () => {
    // Token-backed statuses resolve through the theme variables so a palette
    // change in globals.css propagates without a grep-sweep.
    expect(getStatusColor("Approved").color).toBe("var(--color-success)");
    expect(getStatusColor("Rejected").color).toBe("var(--color-danger)");
    expect(getStatusColor("Collected").color).toBe("rgba(36,26,18,0.55)");
  });

  it("falls back to the brand color for unknown statuses", () => {
    expect(getStatusColor("nonsense").color).toBe("var(--color-accent)");
  });

  it("covers the shop order lifecycle", () => {
    expect(getStatusColor("CANCELLED").color).toBe("var(--color-danger)");
    expect(getStatusColor("Collected").color).toBe("rgba(36,26,18,0.55)");
  });
});
