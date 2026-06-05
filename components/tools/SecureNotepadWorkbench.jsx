'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { SecureNotepadEngine } from '@/lib/tools/SecureNotepadEngine'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'secure_notepad_data'

export default function SecureNotepadWorkbench() {
    const [isLocked, setIsLocked] = useState(true)
    const [hasData, setHasData] = useState(false)
    const [password, setPassword] = useState('')
    const [content, setContent] = useState('')
    const [error, setError] = useState(null)
    const [status, setStatus] = useState(null) // 'saving' | 'saved'

    // Check for existing data on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            setHasData(true)
        } else {
            setHasData(false)
            setIsLocked(false) // New user -> open editor
        }
    }, [])

    const handleUnlock = async () => {
        try {
            setError(null)
            setStatus('Decrypting...')
            const stored = localStorage.getItem(STORAGE_KEY)
            if (!stored) return

            const payload = JSON.parse(stored)
            const decrypted = await SecureNotepadEngine.decrypt(payload, password)

            setContent(decrypted)
            setIsLocked(false)
            setStatus(null)
        } catch (e) {
            setError('Incorrect password or corrupted data.')
            setStatus(null)
        }
    }

    const handleSave = async (newContent) => {
        setContent(newContent)
        setStatus('Saving...')
        try {
            // Need password to save. If we are unlocked, we assume 'password' state is still valid?
            // Ideally we keep the password in memory while unlocked.
            // If password is lost (e.g. state reset), we can't save without re-prompt.
            // But here 'password' state is preserved while component is mounted.

            if (!password) {
                // Should not happen if flow is correct, but fail-safe
                setError("Session expired. Please backup your text and reload.")
                return
            }

            const encrypted = await SecureNotepadEngine.encrypt(newContent, password)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(encrypted))
            setHasData(true)
            setTimeout(() => setStatus('Saved'), 500)
        } catch (e) {
            setError('Failed to save.')
        }
    }

    const handleLock = () => {
        setContent('') // Clear from memory
        setPassword('') // Clear from memory
        setIsLocked(true)
        setStatus(null)
        setError(null)
    }

    const handleReset = () => {
        if (confirm("Are you sure? This will delete your encrypted data permanently.")) {
            localStorage.removeItem(STORAGE_KEY)
            setHasData(false)
            setIsLocked(false)
            setContent('')
            setPassword('')
            setError(null)
        }
    }

    // New User Set Password Mode
    const [newPassword, setNewPassword] = useState('')

    if (!hasData && !isLocked) {
        // Setup Mode
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-soft animate-slideUp">
                <span className="material-symbols-outlined text-6xl text-primary mb-4">lock_open</span>
                <h2 className="text-2xl font-bold mb-2">Setup Secure Notepad</h2>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6 text-center max-w-md">
                    Create a password to encrypt your notes. <br />
                    <span className="text-error font-bold">Warning: If you forget this password, your data is lost forever.</span>
                </p>

                <div className="flex gap-2 w-full max-w-sm">
                    <input
                        type="password"
                        className="flex-1 p-3 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                        placeholder="Set a strong password..."
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && newPassword && (setPassword(newPassword), setHasData(true))}
                    />
                    <Button
                        disabled={!newPassword}
                        onClick={() => {
                            setPassword(newPassword)
                            setHasData(true) // Takes us to main editor logic?
                            // Slight state mismatch here. We need to transition to "Unlocked Editor" 
                            // but 'hasData' is used to determine "Locked vs Setup". 
                            // If we set hasData=true, it might flip to Locked if we don't manage states carefully.
                            // Let's rely on 'isLocked' = false.
                        }}
                    >
                        Start
                    </Button>
                </div>
            </div>
        )
    }

    if (isLocked) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-soft animate-slideUp">
                <span className="material-symbols-outlined text-6xl text-text-muted-light mb-4">lock</span>
                <h2 className="text-2xl font-bold mb-2">Notepad Locked</h2>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6 text-center">
                    Enter your password to decrypt your notes.
                </p>

                <div className="flex flex-col gap-4 w-full max-w-sm">
                    <div className="flex gap-2">
                        <input
                            type="password"
                            className="flex-1 p-3 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                            placeholder="Enter password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                        />
                        <Button onClick={handleUnlock}>Unlock</Button>
                    </div>
                    {error && <p className="text-error text-sm text-center">{error}</p>}

                    <div className="border-t dark:border-gray-700 my-2"></div>

                    <button onClick={handleReset} className="text-xs text-text-muted-light hover:text-error underline">
                        Reset / Delete Data
                    </button>
                </div>
            </div>
        )
    }

    // Unlocked Editor
    return (
        <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-border-card-light dark:border-border-card-dark shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-500">lock_open</span>
                    <span className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">Decrypted Session</span>
                    {status && (
                        <span className="text-xs text-text-muted-light bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full fade-in">
                            {status}
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-error hover:bg-error/10">Delete</Button>
                    <Button variant="outline" size="sm" onClick={handleLock}>Lock</Button>
                </div>
            </div>

            <textarea
                className="w-full h-[600px] p-6 bg-white dark:bg-gray-800 border border-border-card-light dark:border-border-card-dark rounded-xl resize-none focus:ring-2 focus:ring-primary/20 outline-none font-mono text-base leading-relaxed"
                value={content}
                onChange={(e) => handleSave(e.target.value)}
                placeholder="Write your secret notes here..."
            />

            {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-error rounded-lg">{error}</div>}
        </div>
    )
}
