/** The home page's editable "About" (Our Story) content - the only editable
 * website content. Fields are null when an admin has cleared them; the whole
 * payload is null when nothing has ever been saved (static defaults apply). */
import type { ApiEnvelope } from "./api";

export interface IAboutContent {
  storyBody: string | null;
  storyEyebrow: string | null;
  storyFounder: string | null;
  storyHeading: string | null;
  storyImage: string | null;
  storyPullQuote: string | null;
  updatedAt: string;
}

export type IAboutResponse = ApiEnvelope<IAboutContent | null>;

export interface IAboutUpdateInput {
  storyBody?: string | null;
  storyEyebrow?: string | null;
  storyFounder?: string | null;
  storyHeading?: string | null;
  /** null clears the saved image; a new file travels separately (multipart). */
  storyImage?: string | null;
  storyPullQuote?: string | null;
}
