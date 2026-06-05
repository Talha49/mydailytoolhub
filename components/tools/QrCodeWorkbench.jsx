'use client'

import { useState, useEffect, useRef } from 'react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import QRCode from 'qrcode'

export default function QrCodeWorkbench() {
   const [text, setText] = useState('https://devtools-pro.com')
   const [ecc, setEcc] = useState('M') // L, M, Q, H
   const [fgColor, setFgColor] = useState('#000000')
   const [bgColor, setBgColor] = useState('#ffffff')
   const [scale, setScale] = useState(8)
   const [error, setError] = useState(null)

   const canvasRef = useRef(null)

   // Draw to Canvas using library
   useEffect(() => {
      if (!text || !canvasRef.current) return

      const render = async () => {
         try {
            await QRCode.toCanvas(canvasRef.current, text, {
               errorCorrectionLevel: ecc,
               color: {
                  dark: fgColor,
                  light: bgColor
               },
               scale: scale,
               margin: 4 // Standard Quiet Zone
            })
            setError(null)
         } catch (err) {
            console.error(err)
            setError('Failed to generate QR Code. Text may be too long.')
         }
      }

      const timeout = setTimeout(render, 300) // Debounce color inputs
      return () => clearTimeout(timeout)
   }, [text, ecc, fgColor, bgColor, scale])

   const handleDownload = () => {
      if (canvasRef.current) {
         const url = canvasRef.current.toDataURL('image/png')
         const a = document.createElement('a')
         a.href = url
         a.download = `qrcode-${Date.now()}.png`
         a.click()
      }
   }

   return (
      <div className="flex flex-col gap-6 animate-slideUp [animation-delay:100ms]">

         <div className="grid lg:grid-cols-2 gap-6">

            {/* Left Panel: Configuration */}
            <div className="flex flex-col gap-2">
               <div className="flex justify-between px-1">
                  <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">Configuration</label>
               </div>
               <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-soft p-6 h-full flex flex-col gap-6">

                  {/* Text Input */}
                  <div className="flex flex-col gap-3">
                     <label className="text-sm font-medium text-text-muted-light">Content (URL or Text)</label>
                     <textarea
                        className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-border-card-light dark:border-border-card-dark rounded-lg focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm min-h-[100px] resize-none"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text to encode..."
                     />
                  </div>

                  {/* ECC Level */}
                  <div className="flex flex-col gap-3">
                     <span className="text-sm font-medium text-text-muted-light">Error Correction Level</span>
                     <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                        {['L', 'M', 'Q', 'H'].map(level => (
                           <button
                              key={level}
                              onClick={() => setEcc(level)}
                              className={cn(
                                 "flex-1 py-1.5 rounded-md text-sm font-bold transition-all",
                                 ecc === level ? "bg-white dark:bg-gray-600 shadow text-primary" : "text-text-muted-light hover:text-text-primary-light"
                              )}
                           >
                              {level}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Colors */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-text-muted-light">Foreground</span>
                        <div className="flex items-center gap-2">
                           <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-10 h-10 border rounded cursor-pointer" />
                           <span className="text-xs font-mono dark:text-gray-300">{fgColor}</span>
                        </div>
                     </div>
                     <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-text-muted-light">Background</span>
                        <div className="flex items-center gap-2">
                           <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 border rounded cursor-pointer" />
                           <span className="text-xs font-mono dark:text-gray-300">{bgColor}</span>
                        </div>
                     </div>
                  </div>

                  {/* Size (Scale) */}
                  <div className="flex flex-col gap-3">
                     <div className="flex justify-between">
                        <span className="text-sm font-medium text-text-muted-light">Image Size (Scale)</span>
                        <span className="text-sm font-bold text-primary">{scale}x</span>
                     </div>
                     <input
                        type="range"
                        min="2"
                        max="20"
                        value={scale}
                        onChange={(e) => setScale(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                     />
                  </div>

               </div>
            </div>

            {/* Right Panel: Output */}
            <div className="flex flex-col gap-2">
               <div className="flex justify-between px-1">
                  <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">QR Code Preview</label>
               </div>

               <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-soft overflow-hidden h-full flex flex-col items-center justify-center p-8 relative">
                  {/* Canvas */}
                  <div className="bg-transparent p-4 rounded-lg flex items-center justify-center overflow-auto max-w-full">
                     {error ? (
                        <div className="text-error font-medium">{error}</div>
                     ) : (
                        <canvas ref={canvasRef} className="max-w-full h-auto shadow-xl" />
                     )}
                  </div>

                  <div className="mt-8">
                     <Button size="lg" onClick={handleDownload} className="shadow-lg shadow-primary/25">
                        <span className="material-symbols-outlined text-[18px] mr-2">download</span>
                        Download PNG
                     </Button>
                  </div>
               </div>
            </div>

         </div>
      </div>
   )
}
