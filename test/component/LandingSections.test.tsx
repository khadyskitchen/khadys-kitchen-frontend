// The landing sections are server-rendered from the page's cached fetches:
// they render straight from props (no loading states) and disappear entirely
// when there's nothing to show, so the home page never shows an empty shelf.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { FeaturedTrainings } from "@/components/landing/featured-trainings";
import { Story } from "@/components/landing/story";
import type { IAboutContent } from "@/types/about.types";
import type { ITraining } from "@/types/training.types";

// The card is the trainings catalogue's concern — the section test only cares
// that one renders per class.
vi.mock("@/components/trainings/training-card", () => ({
  TrainingCard: ({ training }: { training: ITraining }) => (
    <div>{training.name}</div>
  ),
}));

const training = (n: number) =>
  ({ id: `t${n}`, name: `Class ${n}` }) as ITraining;

afterEach(() => cleanup());

describe("FeaturedTrainings", () => {
  it("renders a card per featured class", () => {
    render(<FeaturedTrainings trainings={[training(1)]} />);
    expect(screen.getByText("Learn to bake it")).toBeInTheDocument();
    expect(screen.getByText("Class 1")).toBeInTheDocument();
  });

  it("disappears when nothing is featured", () => {
    const { container } = render(<FeaturedTrainings trainings={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

describe("Story", () => {
  it("falls back to the static defaults when nothing has been saved", () => {
    render(<Story about={null} />);
    expect(
      screen.getByText("Nine years of cake artistry in Kumasi."),
    ).toBeInTheDocument();
  });

  it("renders the admin's saved content, defaulting blank fields", () => {
    const about: IAboutContent = {
      storyEyebrow: null,
      storyHeading: "Baked with love since 2017.",
      storyBody: "One paragraph.",
      storyPullQuote: null,
      storyFounder: "Khady",
      storyImage: null,
      updatedAt: "2026-07-01T00:00:00.000Z",
    };
    render(<Story about={about} />);
    expect(screen.getByText("Baked with love since 2017.")).toBeInTheDocument();
    expect(screen.getByText("One paragraph.")).toBeInTheDocument();
    // Blank eyebrow falls back to the default so the band reads complete.
    expect(screen.getByText("Our story")).toBeInTheDocument();
  });
});
