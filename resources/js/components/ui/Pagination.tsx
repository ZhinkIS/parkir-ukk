import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { Fragment } from 'react';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  total?: number;
  perPage?: number;
}

export function Pagination({ currentPage, lastPage, onPageChange, total, perPage }: PaginationProps) {
  if (lastPage <= 1) return null;

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);
  const visiblePages = pages.filter(page => {
    if (page === 1 || page === lastPage) return true;
    if (page >= currentPage - 1 && page <= currentPage + 1) return true;
    return false;
  });

  return (
    <nav className="flex items-center justify-between" aria-label="Pagination">
      <div className="text-sm text-slate-600">
        {total !== undefined && perPage !== undefined && (
          <span>
            Menampilkan {(currentPage - 1) * perPage + 1} - {Math.min(currentPage * perPage, total)} dari {total} data
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {visiblePages.map((page, index) => {
          const prevPage = visiblePages[index - 1];
          const showEllipsis = prevPage !== undefined && page - prevPage > 1;
          
          return (
            <Fragment key={page}>
              {showEllipsis && (
                <span className="px-2 text-slate-400">...</span>
              )}
              <Button
                variant={currentPage === page ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(page)}
                className="min-w-[40px]"
              >
                {page}
              </Button>
            </Fragment>
          );
        })}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          aria-label="Halaman selanjutnya"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </nav>
  );
}