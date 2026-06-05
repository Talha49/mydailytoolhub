import { cn } from '@/lib/utils'

/**
 * Reusable Spinner Component
 */
export default function Spinner({
    size = 'md',
    className,
    variant = 'primary',
}) {
    const sizes = {
        sm: 'size-4 border-2',
        md: 'size-8 border-3',
        lg: 'size-12 border-4',
    }

    const variants = {
        primary: 'border-primary/20 border-t-primary',
        white: 'border-white/20 border-t-white',
        secondary: 'border-gray-200 dark:border-gray-700 border-t-gray-500',
    }

    return (
        <div
            className={cn(
                'rounded-full animate-spin',
                sizes[size],
                variants[variant],
                className
            )}
            role="status"
            aria-label="loading"
        />
    )
}
