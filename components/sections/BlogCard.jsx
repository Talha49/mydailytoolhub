import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

/**
 * BlogCard Component for Homepage and listing
 */
export default function BlogCard({ title, description, category, date, readTime, image, href }) {
    return (
        <Card variant="hover" className="flex flex-col h-full">
            {/* Article Image Container */}
            <div className="aspect-video relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/20 to-transparent" />
            </div>

            <Card.Body className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <Badge variant={category === 'SEO' ? 'success' : ''} size="sm">
                        {category}
                    </Badge>
                    <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                        {readTime}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-3 line-clamp-2 hover:text-primary cursor-pointer transition-colors leading-snug">
                    {title}
                </h3>

                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6 line-clamp-3">
                    {description}
                </p>

                <div className="mt-auto pt-6 border-t border-border-light dark:border-border-dark flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        {formatDate(date)}
                    </div>

                    <Link
                        href={href}
                        className="text-xs font-black text-primary flex items-center gap-1 hover:gap-2 transition-all"
                    >
                        Read Guide <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </Link>
                </div>
            </Card.Body>
        </Card>
    )
}
