export const ROUTES = {
  home: '/',
  login: '/login',
  pos: '/pos',
  tables: '/tables',
  menu: '/menu',
  orders: '/orders',
  reservations: '/reservations',
  inventory: '/inventory',
  prep: '/prep',
  reports: '/reports',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
