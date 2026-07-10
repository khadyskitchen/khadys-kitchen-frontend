import { afterEach, beforeAll, beforeEach, describe, it, expect, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GalleryShowcase } from "@/components/gallery/gallery-showcase";
import type { IGalleryImage } from "@/types/gallery.types";

// Mock the data layer so the showcase's rendering + navigation are tested in
// isolation; each test hands the hook exactly the query state it needs.
const { query } = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock("@/redux/gallery/gallery-api", () => ({
  useGetPublicGalleryImagesQuery: () => query(),
}));

const photo = (n: number, caption?: string): IGalleryImage => ({
  id: `photo-${n}`,
  image: `https://res.cloudinary.com/test/image/upload/kitchen-${n}.jpg`,
  caption: caption ?? null,
  isPublished: true,
  createdAt: "2026-07-01T00:00:00.000Z",
  updatedAt: "2026-07-01T00:00:00.000Z",
});

const photos = (count: number) =>
  Array.from({ length: count }, (_, i) => photo(i + 1));

const idle = { data: undefined, isLoading: false, isError: false };

beforeAll(() => {
  // jsdom implements neither; the showcase calls both for the filmstrip and
  // the mobile pager scroll.
  Element.prototype.scrollIntoView = vi.fn();
});

beforeEach(() => {
  query.mockReset();
  query.mockReturnValue(idle);
});
afterEach(() => cleanup());

describe("GalleryShowcase", () => {
  it("renders the server-fetched photos and the slide counter", () => {
    render(<GalleryShowcase initialImages={photos(3)} />);
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Photo 2" }),
    ).toBeInTheDocument();
  });

  it("moves through slides with next/prev, wrapping at the ends", async () => {
    const user = userEvent.setup();
    render(<GalleryShowcase initialImages={photos(3)} />);

    await user.click(screen.getByRole("button", { name: "Next photo" }));
    expect(screen.getByText("2 / 3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous photo" }));
    await user.click(screen.getByRole("button", { name: "Previous photo" }));
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
  });

  it("jumps to a slide from its filmstrip thumbnail and can pause", async () => {
    const user = userEvent.setup();
    render(<GalleryShowcase initialImages={[photo(1), photo(2, "Bench work")]} />);

    await user.click(screen.getByRole("button", { name: "Photo 2: Bench work" }));
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    // The caption renders in both the carousel overlay and the mobile grid
    // (the two views are toggled by CSS, so both live in the DOM).
    expect(screen.getAllByText("Bench work").length).toBeGreaterThan(0);

    const pause = screen.getByRole("button", { name: "Pause the slideshow" });
    expect(pause).toHaveAttribute("aria-pressed", "false");
    await user.click(pause);
    expect(
      screen.getByRole("button", { name: "Resume the slideshow" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("paginates the mobile grid at 12 per page", async () => {
    const user = userEvent.setup();
    render(<GalleryShowcase initialImages={photos(13)} />);

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next page" }),
    ).toBeDisabled();
  });

  it("prefers fresh RTK Query data over the initial list", () => {
    query.mockReturnValue({
      data: {
        message: "Gallery photos",
        data: photos(5),
        meta: { total: 5, page: 1, limit: 100, totalPages: 1 },
      },
      isLoading: false,
      isError: false,
    });
    render(<GalleryShowcase initialImages={photos(2)} />);
    expect(screen.getByText("1 / 5")).toBeInTheDocument();
  });

  it("shows the empty state when there are no published photos", () => {
    render(<GalleryShowcase initialImages={[]} />);
    expect(screen.getByText("The gallery is warming up.")).toBeInTheDocument();
  });
});
