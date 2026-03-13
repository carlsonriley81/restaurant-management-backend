export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export function buildPaginationParams(page: number, perPage = 20): Record<string, string> {
  return { page: String(page), perPage: String(perPage) };
}

export function getTotalPages(total: number, perPage: number): number {
  return Math.ceil(total / perPage);
}

export function hasPrevPage(page: number): boolean {
  return page > 1;
}

export function hasNextPage(page: number, totalPages: number): boolean {
  return page < totalPages;
}
