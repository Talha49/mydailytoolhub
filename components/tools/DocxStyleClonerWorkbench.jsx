'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';
import { extractDocxMetadata, cloneDocxStyles } from '@/lib/tools/DocxStyleCloner';

export default function DocxStyleClonerWorkbench() {
  const [templateFile, setTemplateFile] = useState(null);
  const [targetFile, setTargetFile] = useState(null);
  const [templateMeta, setTemplateMeta] = useState(null);
  const [targetMeta, setTargetMeta] = useState(null);
  
  const [options, setOptions] = useState({
    copyStyles: true,
    copyLayout: true,
    stripDirectFormatting: true,
    copyHeadersFooters: false,
    cleanEmptyReturns: true,
    standardizeTables: true,
    normalizeSpacing: true,
    primaryBrandColor: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [outputFileName, setOutputFileName] = useState('');

  // Handle Template File Selection
  const handleTemplateUpload = async (e) => {
    setError(null);
    setSuccess(false);
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.docx')) {
      setError('Please upload a valid Word document (.docx) for the Template.');
      return;
    }

    setTemplateFile(file);
    try {
      const buffer = await file.arrayBuffer();
      const meta = await extractDocxMetadata(buffer);
      setTemplateMeta(meta);
      
      // Auto-initialize primary brand color to the first color found in template
      if (meta.colors && meta.colors.length > 0) {
        setOptions((prev) => ({
          ...prev,
          primaryBrandColor: meta.colors[0],
        }));
      }
    } catch (err) {
      console.error(err);
      setError('Failed to read the Template file. The file might be corrupted.');
    }
  };

  // Handle Target File Selection
  const handleTargetUpload = async (e) => {
    setError(null);
    setSuccess(false);
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.docx')) {
      setError('Please upload a valid Word document (.docx) for the Target.');
      return;
    }

    setTargetFile(file);
    try {
      const buffer = await file.arrayBuffer();
      const meta = await extractDocxMetadata(buffer);
      setTargetMeta(meta);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the Target file. The file might be corrupted.');
    }
  };

  const handleToggleOption = (key) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectBrandColor = (color) => {
    setOptions((prev) => ({
      ...prev,
      primaryBrandColor: color,
    }));
  };

  const handleCloneStyles = async () => {
    if (!templateFile || !targetFile) {
      setError('Please upload both a Template file and a Target file.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const templateBuffer = await templateFile.arrayBuffer();
      const targetBuffer = await targetFile.arrayBuffer();

      const outputBlob = await cloneDocxStyles(templateBuffer, targetBuffer, options);
      
      // Create download link
      const url = window.URL.createObjectURL(outputBlob);
      const a = document.createElement('a');
      a.href = url;
      
      // Generate output file name
      const nameWithoutExt = targetFile.name.substring(0, targetFile.name.lastIndexOf('.'));
      const generatedName = `${nameWithoutExt}_styled.docx`;
      a.download = generatedName;
      
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setOutputFileName(generatedName);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('An error occurred while matching formatting. Ensure both documents are valid Word files.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTemplateFile(null);
    setTargetFile(null);
    setTemplateMeta(null);
    setTargetMeta(null);
    setSuccess(false);
    setError(null);
    setOptions({
      copyStyles: true,
      copyLayout: true,
      stripDirectFormatting: true,
      copyHeadersFooters: false,
      cleanEmptyReturns: true,
      standardizeTables: true,
      normalizeSpacing: true,
      primaryBrandColor: '',
    });
  };

  return (
    <div className="flex flex-col gap-8 animate-slideUp [animation-delay:100ms]">
      {/* File Upload Section */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Template Upload */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
            1. Branding / Template Document (.docx)
          </label>
          <div className={cn(
            "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all min-h-[220px]",
            templateFile 
              ? "border-primary/50 bg-primary/5 dark:bg-primary/5" 
              : "border-border-card-light dark:border-border-card-dark hover:border-primary/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
          )}>
            <span className={cn(
              "material-symbols-outlined text-4xl mb-3",
              templateFile ? "text-primary" : "text-text-muted-light/60"
            )}>
              palette
            </span>
            {templateFile ? (
              <div className="space-y-1">
                <p className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark max-w-[280px] truncate">
                  {templateFile.name}
                </p>
                <p className="text-xs text-text-muted-light">
                  {(templateFile.size / 1024).toFixed(1)} KB • Style Template loaded
                </p>
                <label className="mt-3 block text-xs font-bold text-primary hover:underline cursor-pointer">
                  Choose another template
                  <input type="file" accept=".docx" className="hidden" onChange={handleTemplateUpload} />
                </label>
              </div>
            ) : (
              <div>
                <p className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark mb-1">
                  Drag & drop your style template
                </p>
                <p className="text-xs text-text-muted-light mb-4">
                  Word Document (.docx) containing fonts, colors, and margins
                </p>
                <label className="bg-primary hover:bg-primary/95 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer transition-all">
                  Browse Template
                  <input type="file" accept=".docx" className="hidden" onChange={handleTemplateUpload} />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Target Upload */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
            2. Target Document to Style (.docx)
          </label>
          <div className={cn(
            "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all min-h-[220px]",
            targetFile 
              ? "border-success/50 bg-success/5" 
              : "border-border-card-light dark:border-border-card-dark hover:border-success/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
          )}>
            <span className={cn(
              "material-symbols-outlined text-4xl mb-3",
              targetFile ? "text-success" : "text-text-muted-light/60"
            )}>
              description
            </span>
            {targetFile ? (
              <div className="space-y-1">
                <p className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark max-w-[280px] truncate">
                  {targetFile.name}
                </p>
                <p className="text-xs text-text-muted-light">
                  {(targetFile.size / 1024).toFixed(1)} KB • Target document loaded
                </p>
                <label className="mt-3 block text-xs font-bold text-success hover:underline cursor-pointer">
                  Choose another document
                  <input type="file" accept=".docx" className="hidden" onChange={handleTargetUpload} />
                </label>
              </div>
            ) : (
              <div>
                <p className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark mb-1">
                  Drag & drop your target file
                </p>
                <p className="text-xs text-text-muted-light mb-4">
                  Word Document (.docx) you want formatted
                </p>
                <label className="bg-success hover:bg-success/90 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer transition-all">
                  Browse Target File
                  <input type="file" accept=".docx" className="hidden" onChange={handleTargetUpload} />
                </label>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Brand Guideline Extracted Card */}
      {templateMeta && (
        <div className="bg-gray-50/50 dark:bg-gray-800/40 rounded-2xl p-6 border border-border-card-light dark:border-border-card-dark grid lg:grid-cols-3 gap-8 animate-fadeIn">
          
          {/* Typography info */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-text-muted-light tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-primary">text_fields</span>
              Extracted Fonts
            </h3>
            <div className="space-y-2">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-border-light dark:border-border-dark flex items-center justify-between">
                <span className="text-xs text-text-muted-light">Headings:</span>
                <span className="font-bold text-sm">{templateMeta.fonts.heading}</span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-border-light dark:border-border-dark flex items-center justify-between">
                <span className="text-xs text-text-muted-light">Body Text:</span>
                <span className="font-bold text-sm">{templateMeta.fonts.body}</span>
              </div>
            </div>
          </div>

          {/* Color palette info with active brand color selector */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-text-muted-light tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-primary">palette</span>
              Color Palette Scheme
            </h3>
            {templateMeta.colors && templateMeta.colors.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  {templateMeta.colors.map((color, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleSelectBrandColor(color)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 p-1 rounded-lg border transition-all",
                        options.primaryBrandColor === color 
                          ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm" 
                          : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                      )}
                    >
                      <div 
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm relative flex items-center justify-center"
                        style={{ backgroundColor: color }}
                        title={`Click to set table header shading to ${color}`}
                      >
                        {options.primaryBrandColor === color && (
                          <span className="material-symbols-outlined text-white text-[16px] font-black drop-shadow-md">check</span>
                        )}
                      </div>
                      <span className="text-[9px] font-mono text-text-muted-light">{color}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-text-muted-light italic">
                  💡 Select a color block above to use for table headers.
                </p>
              </div>
            ) : (
              <p className="text-xs text-text-muted-light italic">No explicit color scheme detected. Standard colors will apply.</p>
            )}
          </div>

          {/* Geometry margins info */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-text-muted-light tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-primary">grid_on</span>
              Page Geometry & Layout
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-border-light dark:border-border-dark">
                <div className="text-text-muted-light">Page Size:</div>
                <div className="font-bold truncate mt-0.5">{templateMeta.pageSize}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-border-light dark:border-border-dark">
                <div className="text-text-muted-light">Margins:</div>
                <div className="font-bold mt-0.5">
                  T: {templateMeta.margins.top}" • B: {templateMeta.margins.bottom}"
                  <br />
                  L: {templateMeta.margins.left}" • R: {templateMeta.margins.right}"
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Control Panel Toggles split into Standard and Advanced Layout Cleaning */}
      <div className="bg-white dark:bg-gray-800 border border-border-card-light dark:border-border-card-dark rounded-2xl p-6 space-y-6">
        
        {/* Section 1: Standard styling settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-text-primary-light dark:text-text-primary-dark border-b border-border-light dark:border-border-dark pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
            Standard Formatting Options
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Toggle Styles */}
            <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                checked={options.copyStyles} 
                onChange={() => handleToggleOption('copyStyles')}
                className="mt-1 accent-primary rounded"
              />
              <div>
                <span className="text-sm font-bold block">Copy Typography & Themes</span>
                <span className="text-xs text-text-muted-light">Applies the template fonts, headings scale, bullet listings, and document style-sheets.</span>
              </div>
            </label>

            {/* Toggle Layout */}
            <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                checked={options.copyLayout} 
                onChange={() => handleToggleOption('copyLayout')}
                className="mt-1 accent-primary rounded"
              />
              <div>
                <span className="text-sm font-bold block">Copy Page Geometry & Margins</span>
                <span className="text-xs text-text-muted-light">Syncs paper orientation, page width/height, and top/bottom/left/right margins.</span>
              </div>
            </label>

            {/* Toggle Direct Formatting Stripper */}
            <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                checked={options.stripDirectFormatting} 
                onChange={() => handleToggleOption('stripDirectFormatting')}
                className="mt-1 accent-primary rounded"
              />
              <div>
                <span className="text-sm font-bold block">Strip Direct Styling Overrides</span>
                <span className="text-xs text-text-muted-light">Wipes custom manual coloring, sizing, and spacing changes from target paragraphs/text runs.</span>
              </div>
            </label>

            {/* Toggle Headers & Footers */}
            <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                checked={options.copyHeadersFooters} 
                onChange={() => handleToggleOption('copyHeadersFooters')}
                className="mt-1 accent-primary rounded"
              />
              <div>
                <span className="text-sm font-bold block">Copy Headers, Footers & Media</span>
                <span className="text-xs text-text-muted-light">Clones running header bars, footer details, logo pictures, and page numbering components.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Section 2: Advanced Layout Sanitizing (Corporate Mode) */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-text-primary-light dark:text-text-primary-dark border-b border-border-light dark:border-border-dark pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-success text-[18px]">verified</span>
            Advanced Layout Sanitizer (Corporate Mode)
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Toggle Empty Returns */}
            <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                checked={options.cleanEmptyReturns} 
                onChange={() => handleToggleOption('cleanEmptyReturns')}
                className="mt-1 accent-success rounded"
              />
              <div>
                <span className="text-sm font-bold block text-success dark:text-green-400">Clean Consecutive Spacing Returns</span>
                <span className="text-xs text-text-muted-light">Deletes empty "Enter key" spacing blocks. Groups of 4+ lines become clean page breaks.</span>
              </div>
            </label>

            {/* Toggle Standardize Tables */}
            <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                checked={options.standardizeTables} 
                onChange={() => handleToggleOption('standardizeTables')}
                className="mt-1 accent-success rounded"
              />
              <div>
                <span className="text-sm font-bold block text-success dark:text-green-400">Standardize Tables & Aesthetics</span>
                <span className="text-xs text-text-muted-light">Syncs grid cell margins/borders. Automatically brands headers with primary color.</span>
              </div>
            </label>

            {/* Toggle Normalize spacing */}
            <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                checked={options.normalizeSpacing} 
                onChange={() => handleToggleOption('normalizeSpacing')}
                className="mt-1 accent-success rounded"
              />
              <div>
                <span className="text-sm font-bold block text-success dark:text-green-400">Fix Spacebar Alignments & Double Spaces</span>
                <span className="text-xs text-text-muted-light">Replaces multiple consecutive space gaps with single spacing for clean typography.</span>
              </div>
            </label>
          </div>
        </div>

      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-medium animate-shake flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 p-4 rounded-xl text-sm font-medium animate-fadeIn flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Layout & formatting matched successfully!
          </div>
          <p className="text-xs text-text-muted-light">
            Your file <strong>{outputFileName}</strong> has been structured, sanitized, and downloaded automatically.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Button
          size="lg"
          onClick={handleCloneStyles}
          disabled={isLoading || !templateFile || !targetFile}
          className="w-full sm:w-auto font-black shadow-lg shadow-primary/20 min-w-[200px]"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" /> Sanitizing & Formatting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">auto_fix</span>
              Match Formatting
            </span>
          )}
        </Button>

        {(templateFile || targetFile) && (
          <Button
            size="lg"
            variant="ghost"
            onClick={handleReset}
            disabled={isLoading}
            className="w-full sm:w-auto hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Clear Uploads
          </Button>
        )}
      </div>
    </div>
  );
}
