/**
 * A published Bake School training (cohort), mirroring the backend
 * `toTrainingDTO`. The hero on the class page is static; this drives the class
 * info below it — stats, the fee table, and the items-to-bring list.
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
  currency: string;
  status: string;
  applicationsOpen: boolean;
  isPublished: boolean;
  capacity: number | null;
  hostelCapacity: number | null;
  startDate: string | null;
  endDate: string | null;
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

export interface ITrainingResponse {
  message: string;
  data: ITraining;
}

export interface IFeeItemInput {
  name: string;
  amount: number;
  kind: string;
  required: boolean;
  note?: string;
  suffix?: string;
  priceLabel?: string;
  position?: number;
}

export interface IRequirementInput {
  name: string;
  note?: string;
}

/** Body for creating/updating a training (the admin form). */
export interface ITrainingInput {
  name: string;
  numeral?: string;
  description: string;
  status?: string;
  applicationsOpen?: boolean;
  isPublished?: boolean;
  startDate?: string;
  endDate?: string;
  capacity?: number;
  hostelCapacity?: number;
  costsIntro?: string;
  costsNote?: string;
  bringIntro?: string;
  stats?: IStat[];
  requirements?: IRequirementInput[];
  highlights?: string[];
  feeItems?: IFeeItemInput[];
}

export interface ITrainingListQuery {
  page?: number;
  limit?: number;
  status?: string;
  applicationsOpen?: boolean;
  search?: string;
}
