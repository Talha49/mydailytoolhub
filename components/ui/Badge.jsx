import { cn } from '@/lib/utils'

/**
 * Reusable Badge Component
 */
export default function Badge({
    children,
    className,
    variant = 'primary',
    size = 'md',
    ...props
}) {
    const variants = {
        primary: 'bg-primary/10 text-primary-dark dark:text-primary-light',
        secondary: 'bg-gray-100 dark:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark',
        success: 'bg-success/10 text-success-dark dark:text-success-light',
        error: 'bg-error/10 text-error-dark dark:text-error-light',
        warning: 'bg-warning/10 text-warning-dark dark:text-warning-light',
        info: 'bg-info/10 text-info-dark dark:text-info-light',
    }

const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-[11px]',
    lg: 'px-3.5 py-1.5 text-xs',
}

return (
    <span
        className={cn(
            'inline-flex items-center font-bold uppercase tracking-wider rounded-full',
            variants[variant],
            sizes[size],
            className
        )}
        {...props}
    >
        {children}
    </span>
)
}
