'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { TextAnalyzer } from '@/lib/tools/TextAnalyzer'

/**
 * WordCounterWorkbench Component
 * Text analysis tool with real-time stats
 */
export default function WordCounterWorkbench() {
   const [text, setText] = useState('')
   const [statsObj, setStatsObj] = useState({ words: 0, chars: 0, sentences: 0, paragraphs: 0, readingTime: 0, speakingTime: 0 })

   useEffect(() => {
       setStatsObj(TextAnalyzer.analyze(text))
   }, [text])

   const stats = [
      { label: 'Words', value: statsObj.words },
      { label: 'Characters', value: statsObj.chars },
      { label: 'Sentences', value: statsObj.sentences },
      { label: 'Paragraphs', value: statsObj.paragraphs },
   ]

   const handleClear = () => setText('')
   const handleCopy = () => navigator.clipboard.writeText(text)

   return (
      <div className="flex flex-col gap-6 animate-slideUp [animation-delay:100ms]">

         {/* Stats Bar */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
               <div key={stat.label} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-sm text-center transition-all hover:border-primary">
                  <div className="text-3xl font-black text-primary mb-1">{stat.value}</div>
                  <div className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">{stat.label}</div>
               </div>
            ))}
         </div>

         {/* Editor Area */}
         <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-soft flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-700/50">
               <div className="flex gap-1">
                  <Button variant="ghost" size="sm" icon="format_bold" className="text-text-secondary-light" />
                  <Button variant="ghost" size="sm" icon="format_italic" className="text-text-secondary-light" />
                  <Button variant="ghost" size="sm" icon="format_underlined" className="text-text-secondary-light" />
               </div>
               <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleClear} className="text-text-secondary-light hover:text-error">Clear</Button>
                  <Button variant="ghost" size="sm" onClick={handleCopy} className="text-text-secondary-light hover:text-primary">Copy</Button>
               </div>
            </div>
            <textarea
               className="flex-1 w-full p-6 bg-transparent border-none resize-none focus:ring-0 text-lg leading-relaxed text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light custom-scrollbar"
               placeholder="Start typing or paste your text here to see real-time statistics..."
               value={text}
               onChange={(e) => setText(e.target.value)}
               autoFocus
            />
            <div className="border-t border-border-light dark:border-border-dark p-3 px-6 flex justify-between items-center text-xs font-medium text-text-secondary-light bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
               <span>Reading Time: {statsObj.readingTime} min</span>
               <span>Speaking Time: {statsObj.speakingTime} min</span>
            </div>
         </div>

      </div>
   )
}
