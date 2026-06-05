import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Dynamic Breadcrumb Component
 */
export default function Breadcrumb({ items = [], className }) {
    return (
        <nav className={cn('flex items-center flex-wrap gap-2 mb-8', className)} aria-label="Breadcrumb">
            {/* Home Link */}
            <Link
                href="/"
                className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium hover:text-primary flex items-center gap-1 transition-colors"
            >
                <span className="material-symbols-outlined text-[18px]">home</span>
                Home
            </Link>

            {/* Path Items */}
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-[18px]">
                        chevron_right
                    </span>

                    {item.active ? (
                        <span className="text-text-primary-light dark:text-text-primary-dark text-sm font-black animate-fadeIn">
                            {item.label}
                        </span>
                    ) : (
                        <Link
                            href={item.href}
                            className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium hover:text-primary transition-colors"
                        >
                            {item.label}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    )
}
