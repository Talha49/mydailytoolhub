'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

/**
 * MetaTagWorkbench Component
 * Form-based SEO tag generator
 */
export default function MetaTagWorkbench() {
    const [activeTab, setActiveTab] = useState('basic') // basic | social
    const [inputs, setInputs] = useState({
        title: '',
        description: '',
        keywords: '',
        author: '',
        language: 'English (en)'
    })
    const [socialInputs, setSocialInputs] = useState({
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        ogUrl: '',
        twitterHandle: ''
    })

    const [output, setOutput] = useState('')

    useEffect(() => {
        generateTags()
    }, [inputs, socialInputs, activeTab])

    const generateTags = () => {
        let code = ''
        
        if (activeTab === 'basic') {
            const { title, description, keywords, author, language } = inputs
            if (title) code += `<title>${title}</title>\n`
            if (description) code += `<meta name="description" content="${description}">\n`
            if (keywords) code += `<meta name="keywords" content="${keywords}">\n`
            if (author) code += `<meta name="author" content="${author}">\n`
            const langCode = language.match(/\(([^)]+)\)/)?.[1] || 'en'
            code += `<meta name="language" content="${langCode}">\n`
            code += `<meta name="viewport" content="width=device-width, initial-scale=1.0">\n`
        } else {
            const { ogTitle, ogDescription, ogImage, ogUrl, twitterHandle } = socialInputs
            if (ogTitle) code += `<meta property="og:title" content="${ogTitle}">\n`
            if (ogDescription) code += `<meta property="og:description" content="${ogDescription}">\n`
            if (ogImage) code += `<meta property="og:image" content="${ogImage}">\n`
            if (ogUrl) code += `<meta property="og:url" content="${ogUrl}">\n`
            code += `<meta property="og:type" content="website">\n`
            
            if (twitterHandle) code += `\n<meta name="twitter:card" content="summary_large_image">\n`
            if (twitterHandle) code += `<meta name="twitter:site" content="@${twitterHandle.replace('@', '')}">\n`
            if (ogTitle) code += `<meta name="twitter:title" content="${ogTitle}">\n`
            if (ogDescription) code += `<meta name="twitter:description" content="${ogDescription}">\n`
            if (ogImage) code += `<meta name="twitter:image" content="${ogImage}">\n`
        }

        setOutput(code.trim() || '<!-- Start typing to generate tags -->')
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        if (activeTab === 'basic') {
            setInputs(prev => ({ ...prev, [name]: value }))
        } else {
            setSocialInputs(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(output)
    }

    return (
        <div className="grid lg:grid-cols-2 gap-8 animate-slideUp [animation-delay:100ms]">

            {/* Form Input */}
            <div className="space-y-6">

                {/* Method Selection */}
                <div className="flex gap-4 border-b border-border-light dark:border-border-dark">
                    {['basic', 'social'].map(t => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={cn(
                                "px-4 py-2 text-sm font-bold border-b-2 transition-all capitalize",
                                activeTab === t ? "border-primary text-primary" : "border-transparent text-text-secondary-light hover:text-text-primary-light"
                            )}
                        >
                            {t} SEO
                        </button>
                    ))}
                </div>

                {activeTab === 'basic' ? (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-text-muted-light uppercase mb-1 block">Title Tag</label>
                            <div className="relative">
                                <input name="title" value={inputs.title} onChange={handleChange} type="text" className="w-full bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg px-4 py-2 text-sm pr-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="My Awesome Website" />
                                <span className={cn("absolute right-3 top-2.5 text-xs font-bold", inputs.title.length > 60 ? "text-error" : "text-success")}>{inputs.title.length}/60</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-text-muted-light uppercase mb-1 block">Description</label>
                            <textarea name="description" value={inputs.description} onChange={handleChange} className="w-full bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg px-4 py-2 text-sm min-h-[100px] resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none custom-scrollbar" placeholder="A brief description of my website..." />
                            <div className={cn("text-right text-xs font-bold mt-1", inputs.description.length > 160 ? "text-error" : "text-warning")}>{inputs.description.length}/160</div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-text-muted-light uppercase mb-1 block">Keywords (Comma separated)</label>
                            <input name="keywords" value={inputs.keywords} onChange={handleChange} type="text" className="w-full bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="website, awesome, cool" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-text-muted-light uppercase mb-1 block">Author</label>
                                <input name="author" value={inputs.author} onChange={handleChange} type="text" className="w-full bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg px-4 py-2 text-sm" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-text-muted-light uppercase mb-1 block">Language</label>
                                <select name="language" value={inputs.language} onChange={handleChange} className="w-full bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg px-4 py-2 text-sm">
                                    <option>English (en)</option>
                                    <option>Spanish (es)</option>
                                    <option>French (fr)</option>
                                    <option>German (de)</option>
                                    <option>Turkish (tr)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-text-muted-light uppercase mb-1 block">Social Title (OG Title)</label>
                            <input name="ogTitle" value={socialInputs.ogTitle} onChange={handleChange} type="text" className="w-full bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Catchy title for social media" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-text-muted-light uppercase mb-1 block">Social Description</label>
                            <textarea name="ogDescription" value={socialInputs.ogDescription} onChange={handleChange} className="w-full bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg px-4 py-2 text-sm min-h-[80px] resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none custom-scrollbar" placeholder="Description when shared..." />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-text-muted-light uppercase mb-1 block">Image URL</label>
                            <input name="ogImage" value={socialInputs.ogImage} onChange={handleChange} type="text" className="w-full bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="https://example.com/image.jpg" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-text-muted-light uppercase mb-1 block">Page URL</label>
                            <input name="ogUrl" value={socialInputs.ogUrl} onChange={handleChange} type="text" className="w-full bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="https://example.com" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-text-muted-light uppercase mb-1 block">Twitter Handle</label>
                            <input name="twitterHandle" value={socialInputs.twitterHandle} onChange={handleChange} type="text" className="w-full bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="@johndoe" />
                        </div>
                    </div>
                )}
                
            </div>

            {/* Preview Output */}
            <div className="flex flex-col gap-4">
                <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-soft overflow-hidden flex flex-col h-full min-h-[500px]">
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                        <span className="text-sm font-bold text-white">Generated Code</span>
                        <Button onClick={handleCopy} size="sm" variant="ghost" className="text-white hover:bg-white/10">Copy Code</Button>
                    </div>
                    <pre className="p-4 overflow-auto font-mono text-sm text-blue-300 custom-scrollbar">
                        {output}
                    </pre>
                </div>
            </div>

        </div>
    )
}
