export const rolesAndPermissions: Record<string, Set<string>> = {
  admin: new Set([
    // movies
    'movies:create',
    'movies:read',
    'movies:update',
    'movies:delete',
    // screenings
    'screenings:create',
    'screenings:read',
    'screenings:update',
    'screenings:delete',
  ]),
  regular: new Set(['reservations:create', 'reservations:read', 'reservations:cancel', 'screenings:read']),
};
