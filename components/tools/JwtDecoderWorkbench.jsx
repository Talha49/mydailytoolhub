'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { JwtProcessor } from '@/lib/tools/JwtProcessor'
import Button from '@/components/ui/Button'

/**
 * JwtDecoderWorkbench Component
 * Visual breakdown of JWT tokens + Encyclopedia Mode (Encode)
 */
export default function JwtDecoderWorkbench() {
    const [mode, setMode] = useState('decode') // decode | encode

    // Decode State
    const [token, setToken] = useState('')
    const [decoded, setDecoded] = useState(null)
    const [decodeError, setDecodeError] = useState(null)

    // Encode State
    const [headerInput, setHeaderInput] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}')
    const [payloadInput, setPayloadInput] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}')
    const [encodedToken, setEncodedToken] = useState('')
    const [encodeError, setEncodeError] = useState(null)

    // Decode Effect
    useEffect(() => {
        if (!token) {
            setDecoded(null)
            setDecodeError(null)
            return
        }
        const result = JwtProcessor.decode(token)
        if (result.error) {
            setDecodeError(result.error)
            setDecoded(null)
        } else {
            setDecodeError(null)
            setDecoded(result)
        }
    }, [token])

    // Encode Effect
    useEffect(() => {
        try {
            const h = JSON.parse(headerInput)
            const p = JSON.parse(payloadInput)
            const newToken = JwtProcessor.encode(h, p)
            setEncodedToken(newToken)
            setEncodeError(null)
        } catch (e) {
            setEncodeError(e.message) // Likely JSON parse error
            setEncodedToken('')
        }
    }, [headerInput, payloadInput])

    return (
        <div className="flex flex-col gap-6 animate-slideUp [animation-delay:100ms]">

            {/* Mode Toggle */}
            <div className="flex justify-center md:justify-start">
                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    <button
                        onClick={() => setMode('decode')}
                        className={cn("px-6 py-2 text-sm font-bold rounded-md transition-all", mode === 'decode' ? "bg-white dark:bg-gray-600 shadow text-primary" : "text-text-secondary-light dark:text-text-secondary-dark hover:text-primary")}
                    >
                        Decode
                    </button>
                    <button
                        onClick={() => setMode('encode')}
                        className={cn("px-6 py-2 text-sm font-bold rounded-md transition-all", mode === 'encode' ? "bg-white dark:bg-gray-600 shadow text-primary" : "text-text-secondary-light dark:text-text-secondary-dark hover:text-primary")}
                    >
                        Encode
                    </button>
                </div>
            </div>

            {mode === 'decode' ? (
                /* DECODE LAYOUT relative to previous version */
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Input Column */}
                    <div className="lg:col-span-1 flex flex-col gap-4">
                        <div className={cn(
                            "bg-white dark:bg-gray-800 rounded-xl border shadow-soft overflow-hidden h-full min-h-[500px] flex flex-col transition-colors",
                            decodeError ? "border-red-500/50" : "border-border-card-light dark:border-border-card-dark"
                        )}>
                            <div className="px-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                                <span className="font-bold text-text-primary-light dark:text-text-primary-dark text-sm">Encoded Token</span>
                                {decodeError && <span className="text-xs text-red-500 font-bold">Invalid</span>}
                            </div>
                            <textarea
                                className="flex-1 w-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm leading-relaxed text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light break-all"
                                placeholder="Paste JWT here..."
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                spellCheck="false"
                            />
                        </div>
                    </div>

                    {/* Output Columns */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-error/20 shadow-soft overflow-hidden">
                            <div className="px-4 py-2 bg-error/5 border-b border-error/10 flex justify-between items-center">
                                <span className="text-xs font-bold text-error uppercase tracking-wider">Header</span>
                            </div>
                            <pre className="p-4 text-sm font-mono text-text-primary-light dark:text-text-primary-dark overflow-auto max-h-[200px] scrollbar-thin">
                                {decoded?.header ? JSON.stringify(decoded.header, null, 2) : <span className="text-gray-400 italic">Header data...</span>}
                            </pre>
                        </div>
                        {/* Payload */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-primary/20 shadow-soft overflow-hidden">
                            <div className="px-4 py-2 bg-primary/5 border-b border-primary/10 flex justify-between items-center">
                                <span className="text-xs font-bold text-primary uppercase tracking-wider">Payload</span>
                            </div>
                            <pre className="p-4 text-sm font-mono text-text-primary-light dark:text-text-primary-dark overflow-auto max-h-[300px] scrollbar-thin">
                                {decoded?.payload ? JSON.stringify(decoded.payload, null, 2) : <span className="text-gray-400 italic">Payload data...</span>}
                            </pre>
                        </div>
                        {/* Signature */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-success/20 shadow-soft overflow-hidden">
                            <div className="px-4 py-2 bg-success/5 border-b border-success/10 flex justify-between items-center">
                                <span className="text-xs font-bold text-success uppercase tracking-wider">Signature</span>
                            </div>
                            <div className="p-4 space-y-4">
                                {decoded?.signature ? (
                                    <div className="font-mono text-sm text-text-muted-light break-all bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-100 dark:border-gray-700">
                                        {decoded.signature}
                                    </div>
                                ) : <div className="text-gray-400 italic text-sm">Signature...</div>}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* ENCODE LAYOUT */
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Inputs Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header Input */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-error/20 shadow-soft overflow-hidden flex flex-col h-[200px]">
                            <div className="px-4 py-2 bg-error/5 border-b border-error/10 flex justify-between items-center">
                                <span className="text-xs font-bold text-error uppercase tracking-wider">Header (JSON)</span>
                            </div>
                            <textarea
                                className="flex-1 w-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm leading-relaxed text-text-primary-light dark:text-text-primary-dark"
                                value={headerInput}
                                onChange={(e) => setHeaderInput(e.target.value)}
                            />
                        </div>

                        {/* Payload Input */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-primary/20 shadow-soft overflow-hidden flex flex-col h-[300px]">
                            <div className="px-4 py-2 bg-primary/5 border-b border-primary/10 flex justify-between items-center">
                                <span className="text-xs font-bold text-primary uppercase tracking-wider">Payload (JSON)</span>
                            </div>
                            <textarea
                                className="flex-1 w-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm leading-relaxed text-text-primary-light dark:text-text-primary-dark"
                                value={payloadInput}
                                onChange={(e) => setPayloadInput(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Output Column */}
                    <div className="lg:col-span-1 flex flex-col gap-4">
                        <div className={cn(
                            "bg-white dark:bg-gray-800 rounded-xl border shadow-soft overflow-hidden h-full min-h-[500px] flex flex-col transition-colors",
                            encodeError ? "border-red-500/50" : "border-border-card-light dark:border-border-card-dark"
                        )}>
                            <div className="px-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                                <span className="font-bold text-text-primary-light dark:text-text-primary-dark text-sm">Generated Token</span>
                                {encodeError && <span className="text-xs text-red-500 font-bold">Invalid JSON</span>}
                            </div>
                            <textarea
                                readOnly
                                className="flex-1 w-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm leading-relaxed text-primary break-all"
                                placeholder="Generated token will appear here..."
                                value={encodedToken}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
