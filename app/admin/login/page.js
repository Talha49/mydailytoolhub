'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        // Force full router refresh to ensure middleware registers session
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.message || 'Incorrect password. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 size-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-border-light dark:border-border-dark rounded-3xl p-8 md:p-10 shadow-strong">
          
          {/* Logo / Title */}
          <div className="text-center mb-8">
            <div className="size-14 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-primary/20">
              <span className="material-symbols-outlined text-[30px]">terminal</span>
            </div>
            <h1 className="text-2xl font-black text-text-primary-light dark:text-text-primary-dark tracking-tight">
              Admin Portal
            </h1>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
              Enter password to access the content management system.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              type="password"
              label="Admin Password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
              autoFocus
            />

            {error && (
              <div className="text-xs font-bold text-error bg-error/10 border border-error/20 p-3.5 rounded-xl flex items-center gap-2 animate-shake">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full h-11 flex justify-center items-center font-bold text-sm"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
