"use client";

import { Button } from "@/components/ui/button";

interface EllipsisPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function EllipsisPagination({
  currentPage,
  totalPages,
  onPageChange,
}: EllipsisPaginationProps) {
  const renderPageNumbers = () => {
    const pages = [];
    const delta = 1;

    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);

    for (const page of range) {
      if (page === "...") {
        pages.push(
          <span key={Math.random()} className="px-2 text-gray-500">
            ...
          </span>
        );
      } else {
        pages.push(
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            onClick={() => onPageChange(Number(page))}
            className="mx-1"
          >
            {page}
          </Button>
        );
      }
    }

    return pages;
  };

  return <div className="flex items-center justify-center">{renderPageNumbers()}</div>;
}
