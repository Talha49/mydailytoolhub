'use client'

import Button from '@/components/ui/Button'

/**
 * ShareButtons Component
 * Social sharing buttons for articles.
 */
export default function ShareButtons({ title, url }) {
    const encodedTitle = encodeURIComponent(title || '')
    const encodedUrl = encodeURIComponent(url || '')

    const shareLinks = [
        { label: 'Twitter', icon: 'flutter_dash', href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, color: 'bg-black text-white' },
        { label: 'Facebook', icon: 'facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: 'bg-blue-600 text-white' },
        { label: 'LinkedIn', icon: 'business_center', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, color: 'bg-blue-700 text-white' },
    ]

    return (
        <div className="flex items-center gap-2 animate-slideUp">
            <span className="text-sm font-bold text-text-muted-light dark:text-text-muted-dark mr-2">Share:</span>
            {shareLinks.map((link) => (
                <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`size-9 rounded-full flex items-center justify-center hover:scale-110 transition-transform ${link.color}`}
                    aria-label={`Share on ${link.label}`}
                >
                    <span className="material-symbols-outlined text-[16px]">{link.icon}</span>
                </a>
            ))}
            <button
                className="size-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark hover:bg-primary hover:text-white transition-all ml-2"
                title="Copy Link"
                onClick={() => {
                    // Mock Copy Interaction
                    alert('Link copied to clipboard!')
                }}
            >
                <span className="material-symbols-outlined text-[18px]">link</span>
            </button>
        </div>
    )
}
