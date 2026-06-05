'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { PasswordGenerator } from '@/lib/tools/PasswordGenerator'
import { cn } from '@/lib/utils'

export default function PasswordGeneratorWorkbench() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false
  })
  const [strength, setStrength] = useState({ label: '', color: '' })

  // Generate on mount or change
  useEffect(() => {
    handleGenerate()
  }, [length, options])

  const handleGenerate = () => {
    // Validate at least one option is selected
    if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
      setPassword('')
      setStrength({ label: 'Error', color: 'bg-gray-300' })
      return
    }

    const pwd = PasswordGenerator.generate(length, options)
    setPassword(pwd)

    const entropy = PasswordGenerator.calculateEntropy(pwd)
    const label = PasswordGenerator.getStrength(entropy)

    let color = 'bg-error'
    if (label === 'Reasonable') color = 'bg-yellow-500'
    if (label === 'Strong') color = 'bg-success'
    if (label === 'Very Strong') color = 'bg-success'

    setStrength({ label, color })
  }

  const handleCopy = () => {
    if (password) {
      navigator.clipboard.writeText(password)
    }
  }

  const toggleOption = (key) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="flex flex-col gap-6 animate-slideUp [animation-delay:100ms]">

      {/* Main Grid Layout to match standard tools */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Left Panel: Configuration (Input) */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between px-1">
            <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">Configuration</label>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-soft p-6 h-full flex flex-col gap-6">
            {/* Length Slider */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-text-muted-light">Password Length</span>
                <span className="text-xl font-bold text-primary">{length}</span>
              </div>
              <input
                type="range"
                min="4"
                max="128"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-text-muted-light">
                <span>4</span>
                <span>128</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 dark:bg-gray-700" />

            {/* Options Grid */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input type="checkbox" checked={options.uppercase} onChange={() => toggleOption('uppercase')} className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300" />
                <span className="text-sm font-medium">Uppercase</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input type="checkbox" checked={options.lowercase} onChange={() => toggleOption('lowercase')} className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300" />
                <span className="text-sm font-medium">Lowercase</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input type="checkbox" checked={options.numbers} onChange={() => toggleOption('numbers')} className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300" />
                <span className="text-sm font-medium">Numbers</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input type="checkbox" checked={options.symbols} onChange={() => toggleOption('symbols')} className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300" />
                <span className="text-sm font-medium">Symbols</span>
              </label>
              <label className="col-span-2 flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input type="checkbox" checked={options.excludeSimilar} onChange={() => toggleOption('excludeSimilar')} className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300" />
                <span className="text-sm font-medium">Exclude Similar (i, l, 1, L, o, 0, O)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Panel: Output */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between px-1">
            <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">Generated Password</label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-muted-light">Strength:</span>
              <span className={cn("text-xs font-bold px-2 py-0.5 rounded text-white", strength.color)}>
                {strength.label || '...'}
              </span>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-soft overflow-hidden h-full flex flex-col relative justify-center p-8">
            {/* Password Display */}
            <div className="text-center">
              <div className="font-mono text-3xl md:text-4xl font-bold break-all tracking-wider text-white mb-6 min-h-[48px]">
                {password}
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  onClick={handleCopy}
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">content_copy</span> Copy
                </Button>
                <Button
                  size="lg"
                  onClick={handleGenerate}
                  variant="ghost"
                  className="text-white hover:text-white hover:bg-white/10"
                >
                  <span className="material-symbols-outlined">refresh</span>
                </Button>
              </div>
            </div>

            {/* Entropy Info (Subtle) */}
            <div className="absolute bottom-4 left-0 w-full text-center">
              <p className="text-xs text-gray-500">Secure Entropy Logic • CSPRNG</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
