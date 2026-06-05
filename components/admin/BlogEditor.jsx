'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { marked } from 'marked'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ALL_TOOLS } from '@/lib/tools-data'

export default function BlogEditor({ id }) {
  const router = useRouter()
  const isEditMode = !!id

  // Editor states
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [markdown, setMarkdown] = useState('')
  const [category, setCategory] = useState('Developer')
  const [image, setImage] = useState('')
  const [tags, setTags] = useState('')
  const [status, setStatus] = useState('draft')

  // UI state
  const [editorMode, setEditorMode] = useState('split') // 'edit' | 'split' | 'preview'
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load post details in edit mode
  useEffect(() => {
    if (!isEditMode) return

    async function fetchPost() {
      try {
        const res = await fetch(`/api/admin/posts/${id}`)
        const data = await res.json()
        if (data.success) {
          const post = data.data
          setTitle(post.title || '')
          setSlug(post.slug || '')
          setDescription(post.description || '')
          setMarkdown(post.markdown || '')
          setCategory(post.category || 'Developer')
          setImage(post.image || '')
          setTags(post.tags ? post.tags.join(', ') : '')
          setStatus(post.status || 'draft')
        } else {
          setError(data.error || 'Failed to fetch article details')
        }
      } catch (err) {
        setError('Network error. Failed to load article.')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id, isEditMode])

  // Automatically generate slug from title (only if not manually modified in create mode)
  const handleTitleChange = (e) => {
    const val = e.target.value
    setTitle(val)
    if (!isEditMode) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      setSlug(generatedSlug)
    }
  }

  // Insert markdown tag helper at current cursor position
  const insertMarkdown = (prefix, suffix = '') => {
    const textarea = document.getElementById('blog-markdown-textarea')
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selectedText = text.substring(start, end)
    const replacement = prefix + (selectedText || 'text') + suffix
    const newValue = text.substring(0, start) + replacement + text.substring(end)
    
    setMarkdown(newValue)
    
    // Maintain cursor focus and select newly styled block
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + prefix.length, 
        start + prefix.length + (selectedText || 'text').length
      )
    }, 5)
  }

  const insertLink = () => {
    const url = prompt('Enter the link URL (e.g. https://example.com):')
    if (url) {
      insertMarkdown('[', `](${url})`)
    }
  }

  const insertImage = () => {
    const url = prompt('Enter the image URL (e.g. https://images.unsplash.com/...):')
    if (!url) return
    const alt = prompt('Enter the image alternative text (alt text):') || 'image description'
    
    const textarea = document.getElementById('blog-markdown-textarea')
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const replacement = `![${alt}](${url})`
    const newValue = text.substring(0, start) + replacement + text.substring(end)
    setMarkdown(newValue)
    setTimeout(() => textarea.focus(), 5)
  }

  const insertTool = () => {
    const slug = prompt('Enter the tool slug to embed (e.g. json-formatter, regex-tester, qr-generator, password-generator):')
    if (!slug) return
    
    const textarea = document.getElementById('blog-markdown-textarea')
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const replacement = `[[tool:${slug}]]`
    const newValue = text.substring(0, start) + replacement + text.substring(end)
    setMarkdown(newValue)
    setTimeout(() => textarea.focus(), 5)
  }

  const renderMarkdownPreview = (text) => {
    if (!text) return ''
    
    // Replace [[tool:slug]] shortcode with a highly professional HTML tool card
    const processedText = text.replace(/\[\[tool:([a-zA-Z0-9-]+)\]\]/g, (match, slug) => {
      const tool = ALL_TOOLS.find(t => t.id === slug)
      if (!tool) return `<a href="/tools/${slug}" class="text-primary font-bold hover:underline">Open Tool (${slug})</a>`
      
      return `
<div class="not-prose my-6 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/30 rounded-xl hover:shadow-soft hover:border-primary/20 transition-all duration-300">
  <div class="space-y-1 text-left">
    <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black bg-primary/10 text-primary uppercase tracking-wider select-none">
      <span class="size-1.5 rounded-full bg-primary"></span>
      Interactive Tool Preview
    </span>
    <h4 class="text-base font-black text-text-primary-light dark:text-text-primary-dark mt-1">
      ${tool.title}
    </h4>
    <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed max-w-md">
      ${tool.description}
    </p>
  </div>
  <div class="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold flex items-center gap-1 select-none pointer-events-none self-start sm:self-center shrink-0">
    Open Tool
    <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
  </div>
</div>
`
    })

    return marked.parse(processedText)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    const tagsArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    const payload = {
      title,
      slug,
      description,
      markdown,
      category,
      image,
      status,
      tags: tagsArray,
    }

    try {
      const url = isEditMode ? `/api/admin/posts/${id}` : '/api/admin/posts'
      const method = isEditMode ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSuccess(`Article ${isEditMode ? 'updated' : 'created'} successfully! Redirecting...`)
        setTimeout(() => {
          router.push('/admin/posts')
          router.refresh()
        }, 1500)
      } else {
        setError(data.error || 'Failed to save article.')
      }
    } catch (err) {
      setError('A connection error occurred. Could not reach server.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-secondary-light">
        <span className="material-symbols-outlined text-4xl animate-spin mb-4">progress_activity</span>
        <p className="font-bold">Loading article data...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      
      {/* Notifications */}
      {error && (
        <div className="text-xs font-bold text-error bg-error/10 border border-error/20 p-4 rounded-xl flex items-center gap-2 animate-shake">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </div>
      )}

      {success && (
        <div className="text-xs font-bold text-success bg-success/10 border border-success/20 p-4 rounded-xl flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {success}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Editor Section */}
        <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
          
          <Input
            label="Post Title"
            placeholder="e.g. How to optimize JSON for large scale performance"
            className="text-lg font-bold"
            value={title}
            onChange={handleTitleChange}
            required
          />

          <Card className="flex-1 flex flex-col min-h-[600px] shadow-soft">
            {/* Toolbar & Mode Selectors */}
            <div className="border-b border-border-light dark:border-border-dark p-2 flex flex-wrap items-center justify-between gap-2 bg-gray-50/50 dark:bg-gray-800/50">
              
              {/* Insert Tags Toolbar */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="Bold"
                  onClick={() => insertMarkdown('**', '**')}
                  className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">format_bold</span>
                </button>
                <button
                  type="button"
                  title="Italic"
                  onClick={() => insertMarkdown('*', '*')}
                  className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">format_italic</span>
                </button>
                <button
                  type="button"
                  title="Link"
                  onClick={insertLink}
                  className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">link</span>
                </button>
                <button
                  type="button"
                  title="Insert Image"
                  onClick={insertImage}
                  className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">image</span>
                </button>
                <button
                  type="button"
                  title="Insert Tool Card"
                  onClick={insertTool}
                  className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">construction</span>
                </button>
                <button
                  type="button"
                  title="Code Block"
                  onClick={() => insertMarkdown('```javascript\n', '\n```')}
                  className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">code</span>
                </button>
                <button
                  type="button"
                  title="Unordered List"
                  onClick={() => insertMarkdown('- ')}
                  className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
                </button>
                <button
                  type="button"
                  title="Blockquote"
                  onClick={() => insertMarkdown('> ')}
                  className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">format_quote</span>
                </button>
              </div>

              {/* View Modes */}
              <div className="flex bg-gray-200 dark:bg-gray-700 p-0.5 rounded-lg text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setEditorMode('edit')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    editorMode === 'edit'
                      ? 'bg-white dark:bg-gray-800 text-primary shadow-soft'
                      : 'text-text-secondary-light dark:text-text-secondary-dark'
                  }`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('split')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    editorMode === 'split'
                      ? 'bg-white dark:bg-gray-800 text-primary shadow-soft'
                      : 'text-text-secondary-light dark:text-text-secondary-dark'
                  }`}
                >
                  Split Live
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('preview')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    editorMode === 'preview'
                      ? 'bg-white dark:bg-gray-800 text-primary shadow-soft'
                      : 'text-text-secondary-light dark:text-text-secondary-dark'
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>

            {/* Editor Workspace */}
            <div className="flex-1 flex min-h-[500px]">
              
              {/* Markdown Input Textarea */}
              {(editorMode === 'edit' || editorMode === 'split') && (
                <textarea
                  id="blog-markdown-textarea"
                  className={`w-full p-6 bg-transparent border-none resize-none focus:ring-0 focus:outline-none font-mono text-sm leading-relaxed ${
                    editorMode === 'split' ? 'w-1/2 border-r border-border-light dark:border-border-dark' : 'w-full'
                  }`}
                  placeholder="# Start writing your article in Markdown..."
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  required
                />
              )}

              {/* Rendered Live HTML Preview */}
              {(editorMode === 'preview' || editorMode === 'split') && (
                <div
                  className={`p-6 overflow-y-auto max-h-[600px] select-text ${
                    editorMode === 'split' ? 'w-1/2' : 'w-full'
                  }`}
                >
                  {markdown ? (
                    <div
                      className="prose dark:prose-invert max-w-none text-text-primary-light dark:text-text-primary-dark"
                      dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(markdown) }}
                    />
                  ) : (
                    <p className="text-text-muted-light dark:text-text-muted-dark italic text-sm">
                      Nothing to preview yet. Write some markdown content.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-border-light dark:border-border-dark p-2.5 text-xs text-text-muted-light text-right px-4">
              Markdown & HTML Rendering Active
            </div>
          </Card>
        </div>

        {/* Sidebar Settings Section */}
        <div className="space-y-6">
          
          {/* Action Card */}
          <Card>
            <Card.Header title="Publishing Status" />
            <Card.Body className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary-light dark:text-text-secondary-dark">Visibility:</span>
                <span className="font-bold text-text-primary-light dark:text-text-primary-dark">Public</span>
              </div>
              
              <Select
                label="Article Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { label: 'Draft Mode', value: 'draft' },
                  { label: 'Published / Active', value: 'published' },
                ]}
              />

              <div className="pt-4 flex flex-col gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-10 flex justify-center items-center font-bold"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : isEditMode ? 'Update Article' : 'Publish Article'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full h-10"
                  onClick={() => router.push('/admin/posts')}
                >
                  Cancel
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Metadata settings */}
          <Card>
            <Card.Header title="SEO Meta Parameters" />
            <Card.Body className="space-y-4">
              <Input
                label="URL Slug"
                placeholder="slug-url-string"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                required
                prefix="/"
              />
              
              <Select
                label="Article Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { label: 'Developer', value: 'Developer' },
                  { label: 'Writing', value: 'Writing' },
                  { label: 'SEO', value: 'SEO' },
                  { label: 'Security', value: 'Security' },
                  { label: 'Design', value: 'Design' },
                  { label: 'Tutorial', value: 'Tutorial' },
                  { label: 'Tech News', value: 'Tech News' },
                ]}
              />

              <Textarea
                label="SEO Description"
                placeholder="Write a search snippet (150-160 characters)..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <Input
                label="Tags (Comma separated)"
                placeholder="JSON, Javascript, SEO, Optimization"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </Card.Body>
          </Card>

          {/* Featured Image */}
          <Card>
            <Card.Header title="Featured Image" />
            <Card.Body className="space-y-4">
              <Input
                label="Image URL"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              {image ? (
                <div className="aspect-video w-full rounded-lg overflow-hidden border border-border-light dark:border-border-dark bg-gray-50">
                  <img src={image} alt="Featured Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-text-muted-light">
                  <span className="material-symbols-outlined text-3xl mb-2">add_photo_alternate</span>
                  <span className="text-xs font-bold">Image URL preview will show here</span>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

      </div>
    </form>
  )
}
