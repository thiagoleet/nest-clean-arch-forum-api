export interface PaginationParams {
  page: number;
}

export const ITEMS_PER_PAGE = 20;

export function calculateOffset(page: number, itemsPerPage: number): number[] {
  const offset = (page - 1) * itemsPerPage;
  const limit = page * itemsPerPage;
  return [offset, limit];
}
