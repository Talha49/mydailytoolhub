'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { ColorConverter } from '@/lib/tools/ColorConverter'
import { cn } from '@/lib/utils'

export default function ColorConverterWorkbench() {
    const [input, setInput] = useState('#3B82F6')
    const [colorData, setColorData] = useState({ hex: '#3B82F6', rgb: 'rgb(59, 130, 246)', hsl: 'hsl(217, 91%, 60%)', valid: true })
    const [error, setError] = useState(null)

    // Handle text input change
    const handleInputChange = (val) => {
        setInput(val)
        const res = ColorConverter.parse(val)
        if (res && res.valid) {
            setColorData(res)
            setError(null)
        } else {
            setError('Invalid Color Format')
        }
    }

    // Handle picker change
    const handlePickerChange = (e) => {
        const hex = e.target.value
        setInput(hex) // Sync text input
        const res = ColorConverter.parse(hex)
        if (res && res.valid) {
            setColorData(res)
            setError(null)
        }
    }

    // Initial load
    useEffect(() => {
        handleInputChange(input)
    }, [])

    const handleCopy = (text) => {
        if (text) navigator.clipboard.writeText(text)
    }

    return (
        <div className="flex flex-col gap-6 animate-slideUp [animation-delay:100ms]">

            <div className="grid lg:grid-cols-2 gap-6">

                {/* Left Panel: Input */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between px-1">
                        <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">Input Color</label>
                        {error && <span className="text-xs font-bold text-error">{error}</span>}
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-soft p-6 h-full flex flex-col gap-6 justify-center">

                        {/* Text Input */}
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium text-text-muted-light">Value (Hex, RGB, or HSL)</label>
                            <input
                                type="text"
                                className={cn(
                                    "w-full p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg focus:ring-2 outline-none font-mono text-lg transition-all",
                                    error ? "border-error focus:ring-error/20" : "border-gray-200 dark:border-gray-700 focus:ring-primary/20 focus:border-primary"
                                )}
                                placeholder="#FFFFFF or rgb(255, 255, 255)"
                                value={input}
                                onChange={(e) => handleInputChange(e.target.value)}
                            />
                        </div>

                        {/* Color Picker Native */}
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium text-text-muted-light">Color Picker</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="color"
                                    className="w-16 h-16 p-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer"
                                    value={colorData.hex || '#000000'}
                                    onChange={handlePickerChange}
                                />
                                <span className="text-sm text-text-muted-light">Click the square to choose a color visually.</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Panel: Output */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between px-1">
                        <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">Converted Values</label>
                    </div>

                    <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-soft overflow-hidden h-full flex flex-col relative">
                        {/* Large Preview Header */}
                        <div
                            className="h-32 w-full transition-colors duration-300 flex items-center justify-center relative"
                            style={{ backgroundColor: colorData.hex || '#000' }}
                        >
                            <span className="bg-black/20 backdrop-blur px-4 py-1 rounded-full text-white font-mono font-bold text-lg shadow-sm">
                                {colorData.hex}
                            </span>
                        </div>

                        {/* Output Fields */}
                        <div className="p-6 flex flex-col gap-4 flex-1 bg-white dark:bg-gray-800">

                            {['HEX', 'RGB', 'HSL'].map((label) => {
                                const key = label.toLowerCase()
                                const val = colorData[key]

                                return (
                                    <div key={label} className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-text-muted-light">{label}</span>
                                        <div className="flex gap-2">
                                            <input
                                                readOnly
                                                value={val}
                                                className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-text-primary-light dark:text-text-primary-dark"
                                            />
                                            <Button variant="ghost" size="sm" onClick={() => handleCopy(val)}>
                                                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
