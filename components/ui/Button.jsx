import { cn } from '@/lib/utils'

/**
 * Reusable Button Component
 * 
 * Variants: , secondary, ghost, danger
 * Sizes: sm, md, lg
 */
export default function Button({
    variant = 'primary',
    size = 'md',
    className,
    disabled = false,
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    children,
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-200 rounded-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none'

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20',
        secondary: 'bg-white dark:bg-gray-800 border border-border-card-light dark:border-border-card-dark text-text-primary-light dark:text-text-primary-dark hover:bg-gray-50 dark:hover:bg-gray-700',
        ghost: 'bg-transparent text-text-primary-light dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800',
        danger: 'bg-error text-white hover:bg-error-dark shadow-lg shadow-error/20',
    }

    const sizes = {
        sm: 'h-8 px-3 text-xs gap-1.5',
        md: 'h-10 px-6 text-sm gap-2',
        lg: 'h-12 px-8 text-base gap-2.5',
    }

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <span className="material-symbols-outlined animate-spin text-[1.2rem]">
                    progress_activity
                </span>
            )}

            {!loading && Icon && iconPosition === 'left' && (
                <span className="material-symbols-outlined text-[1.2rem]">{Icon}</span>
            )}

            {children}

            {!loading && Icon && iconPosition === 'right' && (
                <span className="material-symbols-outlined text-[1.2rem]">{Icon}</span>
            )}
        </button>
    )
}
