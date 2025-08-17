export interface IPaginationParams {
  before?: string;
  cursor?: string;
  limit: number;
}

export type TPaginationResponse<T> = { data: T[]; hasNext: true; nextCursor: string } | { data: T[]; hasNext: false; nextCursor: undefined };

export const encodeCursor = (cursor: string): string => {
  return Buffer.from(cursor).toString('base64');
};

export const decodeCursor = (cursor: string): string => {
  return Buffer.from(cursor, 'base64').toString('utf8');
};
