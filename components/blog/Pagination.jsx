import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

/**
 * Pagination Component
 * Standard previous/next navigation with page numbers.
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
        <div className="flex items-center justify-center gap-2 mt-16 animate-slideUp [animation-delay:200ms]">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="size-10 flex items-center justify-center rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 text-text-muted-light dark:text-text-muted-dark hover:border-primary hover:text-primary disabled:opacity-50 disabled:pointer-events-none transition-all"
                aria-label="Previous page"
            >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={cn(
                            'size-10 flex items-center justify-center rounded-lg font-bold text-sm transition-all',
                            currentPage === page
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:border-primary hover:text-primary'
                        )}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="size-10 flex items-center justify-center rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 text-text-muted-light dark:text-text-muted-dark hover:border-primary hover:text-primary disabled:opacity-50 disabled:pointer-events-none transition-all"
                aria-label="Next page"
            >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
        </div>
    )
}
