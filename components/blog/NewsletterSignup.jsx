'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

/**
 * NewsletterSignup Component
 * Sidebar widget for email capture.
 */
export default function NewsletterSignup() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('idle') // idle, loading, success

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!email) return
        setStatus('loading')

        // Simulate API call
        setTimeout(() => {
            setStatus('success')
            setEmail('')
        }, 1500)
    }

    return (
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <Card.Body className="p-6">
                <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                    <span className="material-symbols-outlined text-2xl">mail</span>
                </div>

                <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
                    Weekly Tech Insights
                </h3>

                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6 leading-relaxed">
                    Join 8,000+ developers receiving our best tools, tutorials, and productivity tips every Tuesday.
                </p>

                {status === 'success' ? (
                    <div className="bg-success/10 text-success px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2 animate-fadeIn">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Subscribed successfully!
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <Input
                            placeholder="name@example.com"
                            type="email"
                            icon="alternate_email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button
                            variant="primary"
                            className="w-full"
                            loading={status === 'loading'}
                            disabled={status === 'loading'}
                        >
                            Subscribe Free
                        </Button>
                        <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark text-center">
                            No spam. Unsubscribe anytime.
                        </p>
                    </form>
                )}
            </Card.Body>
        </Card>
    )
}
