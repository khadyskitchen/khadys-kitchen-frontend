/**
 * A published Bake School training (cohort), mirroring the backend
 * `toTrainingDTO`. The public class page renders entirely from this — hero copy,
 * stats, the fee table, and the items-to-bring list are all per-cohort.
 */
export interface IFeeItem {
  id: string;
  name: string;
  /** Minor units (pesewas). 0 for free / bring-your-own rows. */
  amount: number;
  kind: string;
  required: boolean;
  note: string | null;
  /** Unit label after the price, e.g. "for 2 months". */
  suffix: string | null;
  /** Overrides the formatted price, e.g. "Free", "—". */
  priceLabel: string | null;
  position: number;
}

export interface IRequirement {
  name: string;
  note: string | null;
}

export interface IStat {
  label: string;
  value: string;
}

export interface ITraining {
  id: string;
  name: string;
  slug: string;
  numeral: string | null;
  description: string;
  coverImage: string | null;
  currency: string;
  status: string;
  applicationsOpen: boolean;
  isPublished: boolean;
  capacity: number | null;
  hostelCapacity: number | null;
  startDate: string | null;
  endDate: string | null;
  tagline: string | null;
  heroHeading: string | null;
  heroSubtext: string | null;
  costsIntro: string | null;
  costsNote: string | null;
  bringIntro: string | null;
  stats: IStat[];
  requirements: IRequirement[];
  highlights: string[];
  feeItems?: IFeeItem[];
  counts?: { applications: number; students: number };
  createdAt: string;
  updatedAt: string;
}

export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** `GET /trainings` — published cohorts, newest first. */
export interface ITrainingListResponse {
  message: string;
  data: ITraining[];
  meta: IPaginationMeta;
}
