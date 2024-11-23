import { Student } from '../types';

export interface PaginationOptions {
  page: number;
  pageSize: number;
  sortField?: keyof Student;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const paginateData = <T>(
  data: T[],
  options: PaginationOptions
): PaginatedResult<T> => {
  const { page, pageSize, sortField, sortOrder } = options;
  
  // Calculate start and end indices
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  // Sort data if needed
  let sortedData = [...data];
  if (sortField) {
    sortedData.sort((a: any, b: any) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }
  
  // Get page data
  const paginatedData = sortedData.slice(startIndex, endIndex);
  const total = data.length;
  const totalPages = Math.ceil(total / pageSize);
  
  return {
    data: paginatedData,
    total,
    currentPage: page,
    totalPages,
    hasNext: endIndex < total,
    hasPrevious: page > 1
  };
}; 