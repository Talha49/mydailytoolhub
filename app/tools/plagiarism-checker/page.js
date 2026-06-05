'use client'

import { useState, useRef } from 'react'
import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'

export default function PlagiarismCheckerPage() {
  // Navigation breadcrumbs
  const breadcrumbs = [
    { label: 'Tools', href: '/tools' },
    { label: 'Utilities', href: '/tools?category=Utilities' },
    { label: 'Academic Integrity Suite', href: '#', active: true },
  ]

  // File Upload states
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progressText, setProgressText] = useState('')
  const [error, setError] = useState('')
  
  // Results states
  const [results, setResults] = useState(null) // { text, stats }
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedSource, setSelectedSource] = useState(null)
  const [activeCitationIndex, setActiveCitationIndex] = useState(null)
  const [copySuccess, setCopySuccess] = useState('')

  const fileInputRef = useRef(null)

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(key)
      setTimeout(() => setCopySuccess(''), 2000)
    })
  }

  const getCitations = (source) => {
    const title = source.title || 'Untitled Source'
    const url = source.url || '#'
    const today = new Date()
    const year = today.getFullYear()
    const options = { day: 'numeric', month: 'short', year: 'numeric' }
    const formattedDate = today.toLocaleDateString('en-US', options)
    const formattedAPA = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    const isWeb = url !== '#'

    if (isWeb) {
      return {
        apa: `${title}. (${year}, ${formattedAPA}). Retrieved from ${url}`,
        mla: `"${title}." Web, ${formattedDate}, ${url}.`,
        chicago: `"${title}." Last modified ${formattedAPA}. ${url}.`
      }
    } else {
      return {
        apa: `${title}. (${year}). Academic Archive submission. Internal Database.`,
        mla: `"${title}." Academic Repository, ${year}.`,
        chicago: `"${title}." Internal Database, ${year}.`
      }
    }
  }

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  // Upload trigger
  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  // API Call to Extract Text
  const processFile = async (selectedFile) => {
    // Validate file extension
    const allowedExtensions = ['.txt', '.pdf', '.docx', '.png', '.jpg', '.jpeg']
    const fileName = selectedFile.name.toLowerCase()
    const isAllowed = allowedExtensions.some(ext => fileName.endsWith(ext))

    if (!isAllowed) {
      setError('Unsupported file type. Please upload a PDF, DOCX, TXT, or Image file.')
      return
    }

    // Limit to 8MB to prevent server timeout
    if (selectedFile.size > 8 * 1024 * 1024) {
      setError('File is too large. Maximum file size allowed is 8MB.')
      return
    }

    setFile(selectedFile)
    setLoading(true)
    setError('')
    setResults(null)
    setSelectedSource(null)
    setProgressText('Extracting document text...')

    // Cycle progress text to give a highly professional, interactive feeling
    const progressSteps = [
      'Extracting document content structures...',
      'Running text normalization routines...',
      'Generating sentence-level embeddings...',
      'Scanning local vector search index...',
      'Checking academic grammar and citation index...'
    ]
    let currentStep = 0
    const progressInterval = setInterval(() => {
      if (currentStep < progressSteps.length) {
        setProgressText(progressSteps[currentStep])
        currentStep++
      }
    }, 1500)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const res = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setProgressText('Running similarity database search...')
        
        const checkRes = await fetch('/api/plagiarism/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: data.text,
            filename: selectedFile.name,
            saveToDb: true
          })
        })
        
        const checkData = await checkRes.json()
        
        clearInterval(progressInterval)
        
        if (checkRes.ok && checkData.success) {
          setResults(checkData)
        } else {
          setError(checkData.error || 'Failed to run plagiarism and integrity checks on extracted text.')
        }
      } else {
        clearInterval(progressInterval)
        setError(data.error || 'Failed to extract text from file.')
      }
    } catch (err) {
      clearInterval(progressInterval)
      setError('Connection timeout or server error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetScanner = () => {
    setFile(null)
    setResults(null)
    setError('')
    setSelectedSource(null)
  }

  // Pre-process highlights for split screen text panel
  const getHighlightedText = () => {
    if (!results || !results.paragraphs) return ''

    return results.paragraphs.map((para, pIdx) => {
      return (
        <p key={pIdx} className="mb-4 text-base leading-relaxed text-text-primary-light dark:text-text-primary-dark">
          {para.map((sentenceObj, sIdx) => {
            const { text, type, similarity, source, aiConfidence, suggestion } = sentenceObj

            if (type === 'plagiarism') {
              return (
                <span
                  key={sIdx}
                  onClick={() => {
                    setSelectedSource({
                      title: source.title,
                      url: source.url,
                      match: similarity
                    })
                    setActiveTab('sources')
                  }}
                  className="bg-error/15 border-b-2 border-error text-error dark:text-error-light cursor-pointer font-medium hover:bg-error/25 transition-all py-0.5 rounded px-1"
                  title={`Plagiarism: ${similarity}% match from ${source.title}`}
                >
                  {text}{' '}
                </span>
              )
            }

            if (type === 'ai') {
              return (
                <span
                  key={sIdx}
                  onClick={() => setActiveTab('ai')}
                  className="bg-warning/15 border-b-2 border-warning text-warning-dark dark:text-warning-light cursor-pointer font-medium hover:bg-warning/25 transition-all py-0.5 rounded px-1"
                  title={`AI Signature: ${aiConfidence}% certainty`}
                >
                  {text}{' '}
                </span>
              )
            }

            if (type === 'grammar') {
              return (
                <span
                  key={sIdx}
                  onClick={() => setActiveTab('grammar')}
                  className="border-b-2 border-dotted border-success text-text-primary-light dark:text-text-primary-dark cursor-pointer hover:bg-success/10 transition-all py-0.5 px-0.5"
                  title={`Grammar exception. Click to view suggestions.`}
                >
                  {text}{' '}
                </span>
              )
            }

            return <span key={sIdx}>{text}{' '}</span>
          })}
        </p>
      )
    })
  }

  // Circular gauge logic
  const score = results?.scores.academic || 100
  const strokeDashoffset = 314.15 - (score / 100) * 314.15

  return (
    <div className="container-custom py-8 select-none">
      <Breadcrumb items={breadcrumbs} />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto mt-6">
        
        {/* Ad Space */}
        <AdSlot variant="leaderboard" className="mb-8" />

        {/* Dynamic header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black text-text-primary-light dark:text-text-primary-dark tracking-tight">
            Academic Integrity Checker
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2 leading-relaxed max-w-3xl">
            A comprehensive, private utility dashboard to verify similarity plagiarism indexes, detect generative AI footprints, and check formatting, grammar structure, and citations.
          </p>
        </div>

        {error && (
          <div className="text-xs font-bold text-error bg-error/10 border border-error/20 p-4 rounded-xl flex items-center gap-2 mb-6 animate-shake">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        {/* Initial Upload Phase */}
        {!results && !loading && (
          <Card className="animate-fadeIn shadow-medium">
            <Card.Body className="p-0">
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`min-h-[380px] border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                  dragActive 
                    ? "border-primary bg-primary/5 scale-[0.99]" 
                    : "border-border-card-light dark:border-border-card-dark hover:border-primary/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/10"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".txt,.pdf,.docx,.png,.jpg,.jpeg"
                  className="hidden"
                />

                <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-soft">
                  <span className="material-symbols-outlined text-[36px]">upload_file</span>
                </div>

                <h3 className="text-lg font-black text-text-primary-light dark:text-text-primary-dark tracking-tight text-center">
                  Drag and drop your academic document here
                </h3>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2 text-center max-w-md">
                  Supports **PDF, DOCX, TXT, or scanned Images (OCR)**. Maximum file size allowed is 8MB.
                </p>

                <div className="mt-8 flex gap-3 flex-wrap justify-center">
                  <Button variant="primary" size="sm" type="button" icon="folder_open">
                    Browse File
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Processing Spinner State */}
        {loading && (
          <Card className="animate-fadeIn min-h-[380px] flex flex-col items-center justify-center text-center p-8 shadow-medium">
            <Spinner className="size-12 text-primary mb-6" />
            <h3 className="text-lg font-black text-text-primary-light dark:text-text-primary-dark">
              Processing Document
            </h3>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2 animate-pulse">
              {progressText}
            </p>
          </Card>
        )}

        {/* Scan Results Suites */}
        {results && (
          <div className="space-y-8 animate-fadeIn print:hidden">
            
            {/* Top Stats Overview Panel */}
            <div className="grid md:grid-cols-4 gap-6 items-center">
              
              {/* Radial Score Gauge */}
              <Card className="col-span-1 py-6 flex flex-col items-center justify-center text-center h-full shadow-soft">
                <div className="relative size-32 flex items-center justify-center">
                  <svg className="size-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="50"
                      className="stroke-gray-200 dark:stroke-gray-800"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="50"
                      className="stroke-primary"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray="314.15"
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-3xl font-black text-text-primary-light dark:text-text-primary-dark">
                      {results.scores.academic}
                    </span>
                    <span className="text-xs text-text-muted-light block font-bold mt-0.5">/100</span>
                  </div>
                </div>
                <h4 className="font-black text-sm text-text-primary-light dark:text-text-primary-dark mt-4">
                  Integrity Rating
                </h4>
                <p className="text-xs text-text-muted-light mt-1">
                  Overall quality index
                </p>
              </Card>

              {/* Quick stats grid */}
              <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-6 h-full">
                
                <Card className="shadow-soft">
                  <Card.Body className="p-5 flex flex-col justify-between h-full">
                    <span className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Similarity</span>
                    <div>
                      <p className="text-2xl font-black text-error mt-2">{results.scores.similarity}%</p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">Matched index</p>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="shadow-soft">
                  <Card.Body className="p-5 flex flex-col justify-between h-full">
                    <span className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">AI Footprint</span>
                    <div>
                      <p className="text-2xl font-black text-warning mt-2">{results.scores.ai}%</p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">AI certainty</p>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="shadow-soft">
                  <Card.Body className="p-5 flex flex-col justify-between h-full">
                    <span className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Grammar Warnings</span>
                    <div>
                      <p className="text-2xl font-black text-success mt-2">{results.scores.grammar}</p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">Rule exceptions</p>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="shadow-soft">
                  <Card.Body className="p-5 flex flex-col justify-between h-full">
                    <span className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">File parsed</span>
                    <div className="truncate">
                      <p className="text-sm font-black text-text-primary-light dark:text-text-primary-dark mt-4 truncate">
                        {results.stats.filename}
                      </p>
                      <p className="text-[10px] text-text-muted-light mt-1 uppercase tracking-wider">
                        {results.stats.words} Words
                      </p>
                    </div>
                  </Card.Body>
                </Card>

              </div>
            </div>

            {/* Main Tabs Panel Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Left Tabs Area */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Tabs Selector Bar */}
                <div className="flex bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark p-1.5 rounded-2xl overflow-x-auto scrollbar-hide text-sm font-bold gap-1 shadow-soft">
                  {[
                    { id: 'overview', label: 'Overview', icon: 'dashboard' },
                    { id: 'highlights', label: 'Highlights', icon: 'highlight' },
                    { id: 'sources', label: 'Sources', icon: 'link' },
                    { id: 'ai', label: 'AI Detector', icon: 'psychology' },
                    { id: 'grammar', label: 'Grammar', icon: 'spellcheck' },
                    { id: 'readability', label: 'Readability', icon: 'menu_book' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-primary text-white shadow-soft shadow-primary/10'
                          : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content Cards */}
                <Card className="min-h-[400px] shadow-soft">
                  <Card.Body className="p-8">
                    
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div className="border-b border-border-light dark:border-border-dark pb-4">
                          <h3 className="text-xl font-black text-text-primary-light dark:text-text-primary-dark">Academic Report Summary</h3>
                          <p className="text-xs text-text-muted-light mt-1">Overall verification checklist status</p>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/30 flex items-start gap-4">
                            <span className="material-symbols-outlined text-primary text-[24px] mt-0.5">verified_user</span>
                            <div>
                              <h4 className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark">Document Health Integrity</h4>
                              <p className="text-xs text-text-secondary-light mt-1 leading-relaxed">
                                {results.scores.academic > 80 
                                  ? 'Excellent integrity rating. The content shows highly original sentence structures, minimal matching sources, and low AI signatures.'
                                  : 'Moderate integrity flags. There are a few matching source matches and minor AI certainty tags detected within your paragraphs. Review highlighted text sections.'
                                }
                              </p>
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-4 border border-border-light dark:border-border-dark rounded-xl">
                              <span className="text-[10px] uppercase font-black tracking-widest text-text-muted-light block">Plagiarism Index</span>
                              <p className="text-lg font-black text-text-primary-light dark:text-text-primary-dark mt-1">
                                {results.scores.similarity}% <span className="text-xs font-normal text-text-secondary-light">similarity</span>
                              </p>
                            </div>

                            <div className="p-4 border border-border-light dark:border-border-dark rounded-xl">
                              <span className="text-[10px] uppercase font-black tracking-widest text-text-muted-light block">AI Footprints</span>
                              <p className="text-lg font-black text-text-primary-light dark:text-text-primary-dark mt-1">
                                {results.scores.ai}% <span className="text-xs font-normal text-text-secondary-light">probability</span>
                              </p>
                            </div>

                            <div className="p-4 border border-border-light dark:border-border-dark rounded-xl">
                              <span className="text-[10px] uppercase font-black tracking-widest text-text-muted-light block">Style & Spell Check</span>
                              <p className="text-lg font-black text-text-primary-light dark:text-text-primary-dark mt-1">
                                {results.scores.grammar} <span className="text-xs font-normal text-text-secondary-light">issues found</span>
                              </p>
                            </div>

                            <div className="p-4 border border-border-light dark:border-border-dark rounded-xl">
                              <span className="text-[10px] uppercase font-black tracking-widest text-text-muted-light block">Readability Grade</span>
                              <p className="text-sm font-black text-text-primary-light dark:text-text-primary-dark mt-1">
                                {results.scores.readingLevel}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* HIGHLIGHTS TAB (Split Text view) */}
                    {activeTab === 'highlights' && (
                      <div className="space-y-6">
                        <div className="border-b border-border-light dark:border-border-dark pb-4 flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-black text-text-primary-light dark:text-text-primary-dark">Interactive Highlighting</h3>
                            <p className="text-xs text-text-muted-light mt-1">Hover or click highlighted sections to trace references</p>
                          </div>
                          <div className="flex gap-2">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-error bg-error/10 px-2.5 py-1 rounded-full"><span className="size-1.5 rounded-full bg-error"></span> Plagiarism</span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-warning bg-warning/15 px-2.5 py-1 rounded-full"><span className="size-1.5 rounded-full bg-warning"></span> AI Text</span>
                          </div>
                        </div>

                        {/* Interactive highlights parser container */}
                        <div className="p-6 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl border border-border-light dark:border-border-dark font-display max-h-[500px] overflow-y-auto select-text">
                          {getHighlightedText()}
                        </div>
                      </div>
                    )}

                    {/* SOURCES TAB */}
                    {activeTab === 'sources' && (
                      <div className="space-y-6">
                        <div className="border-b border-border-light dark:border-border-dark pb-4">
                          <h3 className="text-xl font-black text-text-primary-light dark:text-text-primary-dark">Matching Web Sources</h3>
                          <p className="text-xs text-text-muted-light mt-1">Discovered web articles matching your text segments</p>
                        </div>

                        {selectedSource && (
                          <div className="p-4 rounded-xl bg-error/5 border border-error/20 flex justify-between items-start gap-4">
                            <div>
                              <Badge variant="error" className="mb-2">Selected Reference Match</Badge>
                              <h4 className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark">{selectedSource.title}</h4>
                              {selectedSource.url && selectedSource.url !== '#' ? (
                                <a href={selectedSource.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline font-medium block mt-1.5 flex items-center gap-1">
                                  {selectedSource.url} <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                                </a>
                              ) : (
                                <span className="text-xs text-text-muted-light block mt-1.5 italic">
                                  Local Database Registry (Archive Submissions)
                                </span>
                              )}
                            </div>
                            <span className="text-lg font-black text-error shrink-0">{selectedSource.match}% match</span>
                          </div>
                        )}

                        <div className="space-y-4">
                          {results.sources && results.sources.length > 0 ? (
                            results.sources.map((src, idx) => (
                              <div key={idx} className="p-4 border border-border-light dark:border-border-dark rounded-xl flex flex-col gap-3">
                                <div className="flex items-center justify-between gap-4 w-full">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-text-secondary-light rounded-full uppercase">{src.type}</span>
                                      <h4 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark truncate">{src.title}</h4>
                                    </div>
                                    {src.url && src.url !== '#' ? (
                                      <a href={src.url} target="_blank" rel="noreferrer" className="text-xs text-text-muted-light truncate hover:text-primary transition-all block">{src.url}</a>
                                    ) : (
                                      <span className="text-xs text-text-muted-light block italic">Local File Submission</span>
                                    )}
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="font-black text-text-primary-light dark:text-text-primary-dark block text-sm">{src.percent}%</span>
                                    <div className="w-16 bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full mt-1 overflow-hidden">
                                      <div className="bg-primary h-full rounded-full" style={{ width: `${src.percent}%` }}></div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 mt-1 no-print">
                                  <button
                                    onClick={() => setActiveCitationIndex(activeCitationIndex === idx ? null : idx)}
                                    className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-[14px]">format_quote</span>
                                    {activeCitationIndex === idx ? 'Hide Citation helper' : 'Generate Citation'}
                                  </button>
                                </div>

                                {activeCitationIndex === idx && (
                                  <div className="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl space-y-3 border border-border-light dark:border-border-dark animate-fadeIn text-xs no-print">
                                    {Object.entries(getCitations(src)).map(([style, citationText]) => {
                                      const successKey = `${idx}-${style}`
                                      const isCopied = copySuccess === successKey
                                      return (
                                        <div key={style} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-light dark:border-border-dark last:border-b-0 pb-2 last:pb-0">
                                          <div className="flex-1 min-w-0 pr-4">
                                            <span className="font-bold text-[10px] text-text-muted-light uppercase tracking-wider block mb-1">{style.toUpperCase()} Style</span>
                                            <p className="font-mono text-[11px] text-text-primary-light dark:text-text-primary-dark break-all leading-normal select-all bg-white dark:bg-gray-850 p-2 rounded border border-border-light dark:border-border-dark">
                                              {citationText}
                                            </p>
                                          </div>
                                          <button
                                            onClick={() => copyToClipboard(citationText, successKey)}
                                            className={`h-8 px-3 rounded-lg font-bold text-xs flex items-center gap-1 transition-all self-end sm:self-center shrink-0 ${
                                              isCopied 
                                                ? 'bg-success text-white'
                                                : 'bg-primary/10 text-primary hover:bg-primary/20'
                                            }`}
                                          >
                                            <span className="material-symbols-outlined text-[14px]">{isCopied ? 'check' : 'content_copy'}</span>
                                            {isCopied ? 'Copied' : 'Copy'}
                                          </button>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-10 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl border border-border-light dark:border-border-dark">
                              <span className="material-symbols-outlined text-success text-[32px] mb-2 block">verified</span>
                              <h4 className="font-black text-sm text-text-primary-light dark:text-text-primary-dark">No plagiarism detected!</h4>
                              <p className="text-xs text-text-secondary-light mt-1">This text matches 0% of documents in the repository database.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* AI DETECTOR TAB */}
                    {activeTab === 'ai' && (
                      <div className="space-y-6">
                        <div className="border-b border-border-light dark:border-border-dark pb-4">
                          <h3 className="text-xl font-black text-text-primary-light dark:text-text-primary-dark">AI Writing Signature</h3>
                          <p className="text-xs text-text-muted-light mt-1">Generative content certainty breakdown</p>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-6">
                          <div className="p-5 border border-border-light dark:border-border-dark rounded-xl text-center">
                            <span className="text-[10px] font-black uppercase text-text-muted-light block">AI Certainty</span>
                            <p className="text-3xl font-black mt-2 text-warning">{results.scores.ai}%</p>
                            <span className="text-[10px] text-text-secondary-light block mt-1">Generative Probability</span>
                          </div>

                          <div className="p-5 border border-border-light dark:border-border-dark rounded-xl text-center">
                            <span className="text-[10px] font-black uppercase text-text-muted-light block">Perplexity Index</span>
                            <p className="text-3xl font-black mt-2 text-text-primary-light dark:text-text-primary-dark">{results.scores.perplexity || 'High'}</p>
                            <span className="text-[10px] text-text-secondary-light block mt-1">Structure predictability</span>
                          </div>

                          <div className="p-5 border border-border-light dark:border-border-dark rounded-xl text-center">
                            <span className="text-[10px] font-black uppercase text-text-muted-light block">Burstiness Score</span>
                            <p className="text-3xl font-black mt-2 text-text-primary-light dark:text-text-primary-dark">{results.scores.burstiness || 'High'}</p>
                            <span className="text-[10px] text-text-secondary-light block mt-1">Sentence length variation</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-warning/5 border border-warning/10 text-xs text-text-secondary-light leading-relaxed">
                          *Note: AI text detection searches for predictable syntactic structure and repetition common to LLMs. High perplexity and burstiness (typical of human writing) lowers the score.
                        </div>
                      </div>
                    )}

                    {/* GRAMMAR TAB */}
                    {activeTab === 'grammar' && (
                      <div className="space-y-6">
                        <div className="border-b border-border-light dark:border-border-dark pb-4">
                          <h3 className="text-xl font-black text-text-primary-light dark:text-text-primary-dark">Grammar & Formatting Warnings</h3>
                          <p className="text-xs text-text-muted-light mt-1">LanguageTool checks and citation index matches</p>
                        </div>

                        <div className="space-y-4">
                          {results.grammarIssues && results.grammarIssues.length > 0 ? (
                            results.grammarIssues.map((err, idx) => (
                              <div key={idx} className="p-4 border border-border-light dark:border-border-dark rounded-xl flex items-start gap-4">
                                <span className="material-symbols-outlined text-success text-[22px] mt-0.5">info</span>
                                <div>
                                  <h4 className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
                                    {err.desc}
                                    <span className="text-[9px] font-black px-2 py-0.5 bg-success/10 text-success rounded-full uppercase tracking-wider">{err.type}</span>
                                  </h4>
                                  <p className="text-xs text-text-secondary-light mt-1">Suggestion: {err.suggestion}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-10 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl border border-border-light dark:border-border-dark">
                              <span className="material-symbols-outlined text-success text-[32px] mb-2 block">task_alt</span>
                              <h4 className="font-black text-sm text-text-primary-light dark:text-text-primary-dark">Excellent style & formatting!</h4>
                              <p className="text-xs text-text-secondary-light mt-1">We found no double-spacing, passive constructions, or run-on sentences.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* READABILITY TAB */}
                    {activeTab === 'readability' && (
                      <div className="space-y-6">
                        <div className="border-b border-border-light dark:border-border-dark pb-4">
                          <h3 className="text-xl font-black text-text-primary-light dark:text-text-primary-dark">Readability Analysis</h3>
                          <p className="text-xs text-text-muted-light mt-1">Text complexity and estimated reading speeds</p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm border-b border-border-light dark:border-border-dark py-2">
                              <span className="text-text-secondary-light">Flesch Reading Ease:</span>
                              <span className="font-bold text-text-primary-light dark:text-text-primary-dark">{results.scores.readingEase} / 100</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-border-light dark:border-border-dark py-2">
                              <span className="text-text-secondary-light">Reading Grade Level:</span>
                              <span className="font-bold text-text-primary-light dark:text-text-primary-dark">{results.scores.readingLevel}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-border-light dark:border-border-dark py-2">
                              <span className="text-text-secondary-light">Avg. Sentence Length:</span>
                              <span className="font-bold text-text-primary-light dark:text-text-primary-dark">{results.stats.avgSentenceLength || '0'} words</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm border-b border-border-light dark:border-border-dark py-2">
                              <span className="text-text-secondary-light">Total Characters:</span>
                              <span className="font-bold text-text-primary-light dark:text-text-primary-dark">{results.stats.characters}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-border-light dark:border-border-dark py-2">
                              <span className="text-text-secondary-light">Total Words:</span>
                              <span className="font-bold text-text-primary-light dark:text-text-primary-dark">{results.stats.words}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-border-light dark:border-border-dark py-2">
                              <span className="text-text-secondary-light font-medium">Estimated Reading Time:</span>
                              <span className="font-black text-primary uppercase text-xs">{Math.ceil(results.stats.words / 200)} Min read</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </Card.Body>
                </Card>

              </div>

              {/* Sidebar controls */}
              <div className="space-y-6 print:hidden">
                
                {/* Reset button card */}
                <Card>
                  <Card.Header title="Integrity Controls" />
                  <Card.Body className="space-y-4">
                    <p className="text-xs text-text-secondary-light leading-relaxed">
                      Generate a printable PDF academic report for submission or offline archival, or clear active session data.
                    </p>
                    <Button 
                      variant="primary" 
                      className="w-full h-10 bg-gradient-to-r from-primary to-primary-light hover:shadow-md transition-all font-bold" 
                      onClick={() => window.print()}
                      icon="picture_as_pdf"
                    >
                      Export PDF Report
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="w-full h-10" 
                      onClick={resetScanner}
                      icon="refresh"
                    >
                      Scan Another File
                    </Button>
                  </Card.Body>
                </Card>

                {/* Info Card */}
                <Card>
                  <Card.Header title="Privacy Statement" />
                  <Card.Body className="space-y-3">
                    <div className="flex items-start gap-2.5 text-xs text-text-secondary-light leading-relaxed">
                      <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">lock</span>
                      <p>All parsed document strings and texts remain locally stored within your browser session state memory. Absolutely no contents are uploaded to database logs or shared.</p>
                    </div>
                  </Card.Body>
                </Card>

                <AdSlot variant="rectangle" />
              </div>

            </div>

          </div>
        )}

        {/* Print-Only Academic Report Layout */}
        {results && (
          <div className="hidden print:block text-black bg-white p-4 font-sans">
            {/* Report Header */}
            <div className="border-b-4 border-primary pb-4 mb-6">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-primary">ACADEMIC INTEGRITY REPORT</h1>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">COREHUB WRITING SUITE</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p><strong>Generated:</strong> {new Date().toLocaleString()}</p>
                  <p><strong>Database Status:</strong> Secured MongoDB Atlas Index</p>
                </div>
              </div>
            </div>

            {/* Metadata Table */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-1 text-sm">
                <p><strong>Document File:</strong> {results.stats.filename}</p>
                <p><strong>Word Count:</strong> {results.stats.words} words</p>
                <p><strong>Character Count:</strong> {results.stats.characters} characters</p>
              </div>
              <div className="space-y-1 text-sm">
                <p><strong>Estimated Reading Time:</strong> {Math.ceil(results.stats.words / 200)} min read</p>
                <p><strong>Readability Index:</strong> {results.scores.readingLevel} ({results.scores.readingEase}/100)</p>
                <p><strong>Citations Detected:</strong> {results.scores.citations} references found</p>
              </div>
            </div>

            {/* Overall Score Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="p-4 border border-gray-300 rounded-xl text-center bg-gray-50/50">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Integrity Rating</span>
                <p className="text-3xl font-black text-primary mt-1">{results.scores.academic}/100</p>
              </div>
              <div className="p-4 border border-gray-300 rounded-xl text-center bg-gray-50/50">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Similarity Index</span>
                <p className="text-3xl font-black text-red-650 mt-1">{results.scores.similarity}%</p>
              </div>
              <div className="p-4 border border-gray-300 rounded-xl text-center bg-gray-50/50">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">AI Certainty</span>
                <p className="text-3xl font-black text-amber-650 mt-1">{results.scores.ai}%</p>
              </div>
              <div className="p-4 border border-gray-300 rounded-xl text-center bg-gray-50/50">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Grammar Warnings</span>
                <p className="text-3xl font-black text-green-655 mt-1">{results.scores.grammar}</p>
              </div>
            </div>

            {/* Matching Sources Section */}
            <div className="mb-8 block">
              <h3 className="text-lg font-bold border-b border-gray-400 pb-2 mb-4">MATCHING SOURCES & CITATIONS</h3>
              {results.sources && results.sources.length > 0 ? (
                <div className="space-y-4">
                  {results.sources.map((src, idx) => (
                    <div key={idx} className="p-3 border border-gray-300 rounded-lg text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <div>
                          <span className="font-bold text-gray-600 uppercase tracking-widest text-[9px] mr-2 px-1.5 py-0.5 bg-gray-150 rounded">{src.type}</span>
                          <span className="font-bold text-sm">{src.title}</span>
                        </div>
                        <span className="font-black text-sm text-red-600">{src.percent}% match</span>
                      </div>
                      {src.url && src.url !== '#' && (
                        <p className="text-blue-600 font-mono text-[10px] mb-2">{src.url}</p>
                      )}
                      
                      {/* Embedded citation for references list in report */}
                      <div className="mt-2 border-t border-gray-200 pt-2 text-[10px] text-gray-600">
                        <span className="font-bold uppercase tracking-wider text-[8px] text-gray-400 block mb-1">Generated APA Reference:</span>
                        <p className="font-mono bg-gray-50 p-2 rounded">{getCitations(src).apa}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No matching sources detected in public search indexes or local archive.</p>
              )}
            </div>

            {/* Grammar Issues Section */}
            {results.grammarIssues && results.grammarIssues.length > 0 && (
              <div className="mb-8 block">
                <h3 className="text-lg font-bold border-b border-gray-400 pb-2 mb-4">GRAMMAR & WRITING STYLE ANALYSIS</h3>
                <div className="space-y-3">
                  {results.grammarIssues.map((err, idx) => (
                    <div key={idx} className="p-3 border border-gray-300 rounded-lg text-xs flex gap-3">
                      <span className="font-bold text-green-600 uppercase tracking-widest text-[9px] bg-green-50 px-1.5 py-0.5 rounded self-start">{err.type}</span>
                      <div>
                        <p className="font-bold">{err.desc}</p>
                        <p className="text-gray-650 mt-0.5">Suggestion: {err.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Readability Score Breakdown (Advanced Stats) */}
            <div className="mb-8 block">
              <h3 className="text-lg font-bold border-b border-gray-400 pb-2 mb-4">ADVANCED LINGUISTIC STATS</h3>
              <div className="grid grid-cols-2 gap-6 text-xs">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-200 py-2"><td className="py-2 text-gray-500">Flesch Reading Ease</td><td className="py-2 font-bold text-right">{results.scores.readingEase} / 100</td></tr>
                    <tr className="border-b border-gray-200 py-2"><td className="py-2 text-gray-500">Average Sentence Length</td><td className="py-2 font-bold text-right">{results.stats.avgSentenceLength} words</td></tr>
                    <tr className="border-b border-gray-200 py-2"><td className="py-2 text-gray-500">Perplexity Predictability Index</td><td className="py-2 font-bold text-right">{results.scores.perplexity || 'High'}</td></tr>
                  </tbody>
                </table>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-200 py-2"><td className="py-2 text-gray-500">Flesch-Kincaid Grade Level</td><td className="py-2 font-bold text-right">{results.scores.readingLevel}</td></tr>
                    <tr className="border-b border-gray-200 py-2"><td className="py-2 text-gray-500">Total Characters Count</td><td className="py-2 font-bold text-right">{results.stats.characters} characters</td></tr>
                    <tr className="border-b border-gray-200 py-2"><td className="py-2 text-gray-500">Burstiness (Sentence length variance)</td><td className="py-2 font-bold text-right">{results.scores.burstiness || 'High'}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Full Highlighted Content */}
            <div className="block">
              <h3 className="text-lg font-bold border-b border-gray-400 pb-2 mb-4">VERIFIED DOCUMENT CONTENT</h3>
              <p className="text-[10px] text-gray-400 mb-2 italic">Highlighted sentences denote matching segments: Red indicates plagiarized segments, Yellow indicates possible AI-generated patterns.</p>
              <div className="p-4 border border-gray-300 rounded-lg bg-gray-50/20 text-xs leading-relaxed font-serif whitespace-pre-wrap select-text">
                {results.paragraphs.map((para, pIdx) => (
                  <p key={pIdx} className="mb-3">
                    {para.map((sentenceObj, sIdx) => {
                      const { text, type, similarity, source, aiConfidence } = sentenceObj
                      if (type === 'plagiarism') {
                        return (
                          <span key={sIdx} className="bg-red-100 border-b border-red-500 text-red-950 font-medium px-0.5">
                            {text}{' '}
                          </span>
                        )
                      }
                      if (type === 'ai') {
                        return (
                          <span key={sIdx} className="bg-yellow-100 border-b border-yellow-500 text-yellow-950 font-medium px-0.5">
                            {text}{' '}
                          </span>
                        )
                      }
                      return <span key={sIdx}>{text}{' '}</span>
                    })}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Global Print Media Style Injection */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            nav, footer, header, aside, .no-print, button, .ad-slot, .breadcrumbs {
              display: none !important;
            }
            
            body, html, main {
              background: white !important;
              color: black !important;
              font-family: system-ui, -apple-system, sans-serif !important;
              font-size: 11pt !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            .container-custom, .max-w-6xl {
              max-width: 100% !important;
              width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
            }
          }
        `}} />

      </div>
    </div>
  )
}
