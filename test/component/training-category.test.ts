import { describe, it, expect } from "vitest";
import {
  TRAINING_CATEGORIES,
  TRAINING_CATEGORY_LABELS,
  trainingSchema,
} from "@/validations/training-schema";

const baseValues = {
  name: "Bakery Class",
  summary: "Two-month intake",
  learnOutcomes: [],
  whatToBring: [],
  included: [],
  forWho: [],
  hasCertificate: false,
  applicationsOpen: false,
  isPublished: false,
  isFeatured: false,
  feeItems: [],
};

describe("training category", () => {
  it("has the two expected values with human labels", () => {
    expect([...TRAINING_CATEGORIES]).toEqual(["IN_PERSON", "ONLINE"]);
    expect(TRAINING_CATEGORY_LABELS.IN_PERSON).toBe("In-person");
    expect(TRAINING_CATEGORY_LABELS.ONLINE).toBe("Online");
  });

  it("gives every category a label", () => {
    for (const c of TRAINING_CATEGORIES) {
      expect(TRAINING_CATEGORY_LABELS[c]).toBeTruthy();
    }
  });

  it("accepts a valid category in the form schema", () => {
    const parsed = trainingSchema.safeParse({ ...baseValues, category: "ONLINE" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.category).toBe("ONLINE");
  });

  it("rejects an unknown or missing category", () => {
    expect(
      trainingSchema.safeParse({ ...baseValues, category: "HYBRID" }).success,
    ).toBe(false);
    expect(trainingSchema.safeParse(baseValues).success).toBe(false);
  });
});
