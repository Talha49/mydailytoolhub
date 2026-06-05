'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { CronEngine } from '@/lib/tools/CronEngine'

/**
 * CronJobWorkbench Component
 * Visual scheduler for cron expressions
 */
export default function CronJobWorkbench() {
    
    // State shape for 5 columns
    const initialColumnState = { type: 'every', value: [] }
    const [state, setState] = useState({
        Minute: { type: 'step', value: '5' },
        Hour: { ...initialColumnState },
        Day: { ...initialColumnState },
        Month: { ...initialColumnState },
        Weekday: { ...initialColumnState }
    })

    const [expression, setExpression] = useState('*/5 * * * *')
    const [description, setDescription] = useState('At every 5 minutes.')

    useEffect(() => {
        const expr = CronEngine.build(state)
        setExpression(expr)
        setDescription(CronEngine.describe(expr))
    }, [state])

    const handleTypeChange = (unit, newType) => {
        setState(prev => ({
            ...prev,
            [unit]: { ...prev[unit], type: newType, value: newType === 'specific' ? [] : (newType === 'step' ? '1' : null) }
        }))
    }

    const handleValueClick = (unit, valStr) => {
        setState(prev => {
            const current = prev[unit]
            if (current.type !== 'specific') return prev
            
            let newValue = [...current.value]
            if (newValue.includes(valStr)) {
                newValue = newValue.filter(v => v !== valStr)
            } else {
                newValue.push(valStr)
                // sort numerically
                newValue.sort((a, b) => parseInt(a) - parseInt(b))
            }
            
            return {
                ...prev,
                [unit]: { ...current, value: newValue }
            }
        })
    }

    const copyExpression = () => {
        navigator.clipboard.writeText(expression)
    }

    const getLimits = (unit) => {
        switch(unit) {
            case 'Minute': return 60;
            case 'Hour': return 24;
            case 'Day': return 31;
            case 'Month': return 12;
            case 'Weekday': return 7;
            default: return 12;
        }
    }
    
    const getOffset = (unit) => {
        // Day and Month start at 1 usually in UI
        if (unit === 'Day' || unit === 'Month') return 1;
        return 0; // Minute, Hour, Weekday(0-6) start at 0
    }

    return (
        <div className="flex flex-col gap-8 animate-slideUp [animation-delay:100ms]">

            {/* Result Display */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
                <div className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest mb-2">Cron Expression</div>
                <div className="text-4xl md:text-5xl font-black text-primary font-mono tracking-wider">{expression}</div>
                <div className="mt-4 flex justify-center text-sm font-medium text-text-secondary-light bg-white/50 dark:bg-gray-800/50 inline-block px-4 py-1 rounded-full">
                    {description}
                </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Editors */}
                {Object.keys(state).map((unit) => {
                    const limit = getLimits(unit)
                    const offset = getOffset(unit)
                    const currentType = state[unit].type
                    const selectedValues = state[unit].value || []

                    return (
                        <div key={unit} className="bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-soft p-4 flex flex-col h-[300px]">
                            <div className="text-center font-bold text-text-primary-light dark:text-text-primary-dark border-b border-border-light dark:border-border-dark pb-3 mb-3">{unit}</div>
                            <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                                <label className="flex items-center gap-2 p-1 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded cursor-pointer">
                                    <input type="radio" checked={currentType === 'every'} onChange={() => handleTypeChange(unit, 'every')} className="accent-primary" />
                                    <span className="text-xs font-medium">Every {unit}</span>
                                </label>
                                <label className="flex items-center gap-2 p-1 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded cursor-pointer">
                                    <input type="radio" checked={currentType === 'specific'} onChange={() => handleTypeChange(unit, 'specific')} className="accent-primary" />
                                    <span className="text-xs font-medium">Specific...</span>
                                </label>

                                {currentType === 'specific' && (
                                    <div className="grid grid-cols-4 gap-1 mt-2">
                                        {Array.from({ length: limit }).map((_, j) => {
                                            const val = (j + offset).toString()
                                            const isSelected = selectedValues.includes(val)
                                            return (
                                                <div 
                                                    key={j} 
                                                    onClick={() => handleValueClick(unit, val)}
                                                    className={cn(
                                                        "text-[10px] text-center rounded py-1 cursor-pointer transition-colors border",
                                                        isSelected 
                                                            ? "bg-primary text-white border-primary" 
                                                            : "bg-gray-50 dark:bg-gray-700 hover:bg-primary/20 border-transparent text-text-primary-light dark:text-text-primary-dark"
                                                    )}
                                                >
                                                    {val}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="flex justify-center gap-4">
                <Button size="lg" icon="content_copy" onClick={copyExpression}>Copy Expression</Button>
            </div>

        </div>
    )
}
