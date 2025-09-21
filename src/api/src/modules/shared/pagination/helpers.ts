export const encodeCursor = (cursor: string): string => {
  return Buffer.from(cursor).toString('base64');
};

export const decodeCursor = (cursor: string): string => {
  return Buffer.from(cursor, 'base64').toString('utf8');
};
