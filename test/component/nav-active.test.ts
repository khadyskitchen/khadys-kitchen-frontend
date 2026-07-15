import { describe, it, expect } from "vitest";
import { isNavActive } from "@/components/layout/header-nav";

describe("isNavActive", () => {
  it("matches the home route only exactly", () => {
    expect(isNavActive("/", "/")).toBe(true);
    expect(isNavActive("/trainings", "/")).toBe(false);
  });

  it("matches a route and its sub-paths", () => {
    expect(isNavActive("/trainings", "/trainings")).toBe(true);
    // Stays active on a detail page under the section.
    expect(isNavActive("/trainings/wedding-cakes", "/trainings")).toBe(true);
    expect(isNavActive("/gallery", "/trainings")).toBe(false);
  });

  it("never marks an on-page anchor link active", () => {
    expect(isNavActive("/", "#about")).toBe(false);
    expect(isNavActive("/about", "#about")).toBe(false);
  });

  it("does not treat a prefix collision as a sub-path", () => {
    // "/training" is not a sub-path of "/trainings".
    expect(isNavActive("/training", "/trainings")).toBe(false);
  });
});
