import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * CategoryCard Component for explore section
 */
export default function CategoryCard({ label, icon, href }) {
    return (
        <Link
            href={href}
            className="group flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-2xl hover:bg-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 h-full min-h-[140px]"
        >
            <div className="size-12 bg-primary/5 dark:bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-[28px] transition-colors">
                    {icon}
                </span>
            </div>

            <span className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark group-hover:text-white transition-colors text-center">
                {label}
            </span>
        </Link>
    )
}
