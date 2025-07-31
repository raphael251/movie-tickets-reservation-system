export const rolesAndPermissions: Record<string, Set<string>> = {
  admin: new Set(['movies:create', 'movies:read', 'movies:update', 'movies:delete']),
  regular: new Set(),
};
