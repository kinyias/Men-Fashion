import { useState } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  initialLimit?: number;
}

export function usePagination({ initialPage = 1, initialLimit = 10 }: UsePaginationProps = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const updatePaginationData = (data: { 
    page: number; 
    limit: number; 
    totalItems: number; 
    totalPages: number 
  }) => {
    setTotalItems(data.totalItems);
    setTotalPages(data.totalPages);
  };

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  const changeLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  return {
    page,
    limit,
    totalItems,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    updatePaginationData,
  };
}