'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * AdSlot Component for various placements
 * Renders real AdSense ads in production, and placeholders in development.
 */
export default function AdSlot({ variant = 'leaderboard', className }) {
    const [isDev, setIsDev] = useState(true)

    const variants = {
        leaderboard: 'w-full max-w-[728px] h-[90px]',
        rectangle: 'w-full max-w-[300px] h-[250px]',
        inline: 'w-full min-h-[120px]',
    }

    const titles = {
        leaderboard: 'Desktop Leaderboard',
        rectangle: 'Medium Rectangle',
        inline: 'In-Article Responsive',
    }

    const slotIds = {
        leaderboard: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD || '3514302818',
        rectangle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE || '2833748757',
        inline: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INLINE || '9972048341',
    }

    useEffect(() => {
        // Check if we are in production
        const devMode = process.env.NODE_ENV === 'development'
        setIsDev(devMode)

        if (!devMode && typeof window !== 'undefined') {
            try {
                // Ensure we only push if the ins tag hasn't been filled yet
                const insElem = document.querySelector(`ins[data-ad-slot="${slotIds[variant]}"]:not([data-adsbygoogle-status="done"])`)
                if (insElem) {
                    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
                }
            } catch (err) {
                console.error('AdSense error:', err)
            }
        }
    }, [variant])

    if (isDev) {
        return (
            <div className={cn(
                'bg-gray-100 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center mx-auto',
                className
            )}>
                <span className="text-[10px] font-black text-text-muted-light dark:text-text-muted-dark uppercase tracking-[0.2em] mb-3">
                    Advertisement Placeholder
                </span>
                <div className={cn(
                    'bg-gray-200 dark:bg-gray-700/50 rounded flex items-center justify-center text-center px-4',
                    variants[variant]
                )}>
                    <p className="text-text-muted-light dark:text-text-muted-dark text-xs font-medium italic">
                        {titles[variant]}
                    </p>
                </div>
            </div>
        )
    }

    // Production Ad Render
    return (
        <div className={cn('flex items-center justify-center overflow-hidden my-6', className)}>
            <ins 
                className={cn("adsbygoogle", variants[variant])}
                style={{ display: 'block', textAlign: variant === 'inline' ? 'center' : undefined }}
                data-ad-layout={variant === 'inline' ? 'in-article' : undefined}
                data-ad-format={variant === 'inline' ? 'fluid' : 'auto'}
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-3898517911471443'}
                data-ad-slot={slotIds[variant]}
                data-full-width-responsive="true"
            />
        </div>
    )
}
