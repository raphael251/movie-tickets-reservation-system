export interface IPaginationParams {
  before?: string;
  cursor?: string;
  limit?: number;
}

export type TPaginationResponse<T> = { data: T[]; hasNext: true; nextCursor: string } | { data: T[]; hasNext: false; nextCursor: undefined };
