import { cn } from '@/lib/utils'

/**
 * Reusable wrapper for Homepage sections
 */
export default function HomeSection({ title, subtitle, children, className, id, viewAllHref }) {
    return (
        <section id={id} className={cn('py-20', className)}>
            <div className="container-custom">
                {(title || subtitle) && (
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            {title && (
                                <h2 className="text-3xl font-black text-text-primary-light dark:text-text-primary-dark tracking-tight">
                                    {title}
                                </h2>
                            )}
                            {subtitle && (
                                <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2 font-medium">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        {viewAllHref && (
                            <a
                                href={viewAllHref}
                                className="text-primary font-black flex items-center gap-2 text-sm group hover:gap-3 transition-all"
                            >
                                View Selection
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </a>
                        )}
                    </div>
                )}

                {children}
            </div>
        </section>
    )
}
