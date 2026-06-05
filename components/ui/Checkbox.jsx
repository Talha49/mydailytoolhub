import { cn } from '@/lib/utils'

/**
 * Reusable Checkbox Component
 */
export default function Checkbox({
    label,
    error,
    className,
    checked,
    ...props
}) {
    return (
        <div className="space-y-1">
            <label className={cn(
                'flex items-center gap-2.5 cursor-pointer group select-none transition-all',
                className
            )}>
                <div className="relative flex items-center justify-center">
                    <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={checked}
                        {...props}
                    />

                    <div className={cn(
                        'size-5 rounded border border-border-card-light dark:border-border-card-dark bg-white dark:bg-gray-800 transition-all duration-200 peer-checked:bg-primary peer-checked:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20',
                        error && 'border-error'
                    )} />

                    <span className="material-symbols-outlined absolute text-white text-[16px] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                        check
                    </span>
                </div>

                {label && (
                    <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark group-hover:text-primary transition-colors">
                        {label}
                    </span>
                )}
            </label>

            {error && (
                <p className="text-[10px] font-bold text-error animate-slideUp pl-7">
                    {error}
                </p>
            )}
        </div>
    )
}
