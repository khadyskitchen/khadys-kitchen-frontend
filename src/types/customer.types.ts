import type { IPaginationMeta } from "./training.types";

/** A shop customer (guest checkout, keyed by phone), mirroring `toCustomerDTO`.
 * `totalSpent` is money actually received (pesewas), cancelled orders excluded. */
export interface ICustomer {
  id: string;
  phone: string;
  fullName: string;
  email: string | null;
  notes: string | null;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICustomerResponse {
  message: string;
  data: ICustomer;
}

export interface ICustomerListResponse {
  message: string;
  data: ICustomer[];
  meta: IPaginationMeta;
}

export interface ICustomerListQuery {
  /** Created-date window, YYYY-MM-DD (inclusive). */
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  search?: string;
}
