import { cn } from '@/lib/utils'

/**
 * Reusable Card Component
 * 
 * Includes slots for Header, Body, and Footer
 */
export function Card({ children, className, variant = 'default', ...props }) {
    const variants = {
        default: 'bg-white dark:bg-card-dark border-border-light dark:border-border-dark',
        hover: 'bg-white dark:bg-card-dark border-border-light dark:border-border-dark hover:shadow-lg hover:border-primary dark:hover:border-primary transition-all duration-300',
        clickable: 'bg-white dark:bg-card-dark border-border-light dark:border-border-dark hover:shadow-lg hover:border-primary dark:hover:border-primary cursor-pointer active:scale-[0.98] transition-all duration-200',
    }

    return (
        <div
            className={cn(
                'card overflow-hidden shadow-soft',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

Card.Header = function CardHeader({ children, className, ...props }) {
    return (
        <div
            className={cn(
                'px-5 py-4 border-b border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

Card.Title = function CardTitle({ children, className, icon: Icon, ...props }) {
    return (
        <h3
            className={cn(
                'text-sm font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2',
                className
            )}
            {...props}
        >
            {Icon && (
                <span className="material-symbols-outlined text-primary text-[20px]">
                    {Icon}
                </span>
            )}
            {children}
        </h3>
    )
}

Card.Body = function CardBody({ children, className, ...props }) {
    return (
        <div className={cn('p-5', className)} {...props}>
            {children}
        </div>
    )
}

Card.Footer = function CardFooter({ children, className, ...props }) {
    return (
        <div
            className={cn(
                'px-5 py-4 border-t border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/50',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}
