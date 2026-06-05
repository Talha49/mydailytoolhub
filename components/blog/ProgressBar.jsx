'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * ProgressBar Component
 * Shows reading progress at the top of the screen.
 */
export default function ProgressBar() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight
            const scrollTop = window.scrollY

            const totalScroll = documentHeight - windowHeight
            const currentProgress = (scrollTop / totalScroll) * 100

            setProgress(currentProgress)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-transparent">
            <div
                className="h-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    )
}
