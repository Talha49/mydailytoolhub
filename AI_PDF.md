# CoreHubTools — AI Academic Integrity Checker (0-Cost Architecture)

## Vision

Build a completely free-to-run Academic Integrity Checker that supports:

- PDF Upload
- DOCX Upload
- TXT Upload
- OCR Image Upload
- Similarity Detection
- Web Source Discovery
- AI Content Detection
- Grammar Checking
- Citation Checking
- Readability Analysis
- Academic Score Generation

Unlike traditional plagiarism checkers, this tool should become an:

# Academic Integrity Suite

---

# Tech Stack

## Frontend

### Framework

```bash
Next.js 15
```

### Styling

```bash
Tailwind CSS
Shadcn UI
```

### Upload

```bash
react-dropzone
```

### Charts

```bash
recharts
```

---

## Backend

Use Next.js Route Handlers

```bash
app/api/*
```

No separate backend required.

---

## Database

### PostgreSQL

Recommended:

```bash
Supabase Free Tier
```

or

```bash
Neon Free Tier
```

---

## Vector Database

Use:

```bash
pgvector
```

inside PostgreSQL.

No Pinecone.
No Weaviate.
No paid services.

---

# File Extraction System

## PDF Extraction

Library:

```bash
pdf-parse
```

Install:

```bash
npm install pdf-parse
```

---

## DOCX Extraction

Library:

```bash
mammoth
```

Install:

```bash
npm install mammoth
```

---

## OCR Image Extraction

Library:

```bash
tesseract.js
```

Install:

```bash
npm install tesseract.js
```

Supports:

- PNG
- JPG
- JPEG
- Screenshots
- Scanned documents

---

# Text Processing Pipeline

## Step 1

User uploads file.

```text
PDF
DOCX
TXT
Image
```

---

## Step 2

Extract text.

Output:

```json
{
  "text":"..."
}
```

---

## Step 3

Normalize text.

Remove:

- extra spaces
- duplicated newlines
- hidden characters

Libraries:

```bash
natural
```

Install:

```bash
npm install natural
```

---

## Step 4

Split into chunks.

Chunk Size:

```text
300-500 words
```

Store:

```json
[
  {
    "id":"chunk1",
    "text":"..."
  }
]
```

---

# Similarity Detection Engine

## Goal

Detect:

- copied content
- paraphrased content
- duplicated content

---

## Embedding Model

Use:

# BAAI/bge-small-en-v1.5

Advantages:

- Free
- Fast
- Excellent similarity performance
- Small size

Model:

```text
BAAI/bge-small-en-v1.5
```

---

## Alternative

```text
intfloat/e5-small-v2
```

---

# Embedding Runtime

Use:

```bash
@xenova/transformers
```

Install:

```bash
npm install @xenova/transformers
```

No OpenAI required.

Runs locally.

---

# Similarity Workflow

```text
Upload
   ↓
Extract
   ↓
Chunk
   ↓
Generate Embeddings
   ↓
Store in pgvector
   ↓
Similarity Search
   ↓
Score
```

---

# Vector Search

Store:

```sql
vector(384)
```

in PostgreSQL.

Example:

```sql
SELECT *
FROM chunks
ORDER BY embedding <=> query_embedding
LIMIT 10;
```

---

# Similarity Score Formula

```text
95%+  = Likely Copied

80-95 = Strong Match

60-80 = Possible Paraphrase

40-60 = Related Content

0-40  = Original
```

---

# Internal Plagiarism Detection

Check:

- paragraph duplication
- repeated sections
- copied chapters

Inside uploaded document.

No internet required.

---

# Web Source Detection

## Goal

Find potential original sources.

---

## Method

Take suspicious sentences.

Example:

```text
The quick brown fox jumps over the lazy dog.
```

Search exact phrase.

---

## Search APIs

Free options:

### Brave Search

```text
1000 free queries/day
```

---

### DuckDuckGo

Open scraping approach.

---

### SearXNG

Self-hosted search engine.

Recommended.

---

# Source Matching

For each discovered page:

1. Download content
2. Extract text
3. Compare embeddings

Output:

```json
[
  {
    "url":"...",
    "similarity":92
  }
]
```

---

# AI Content Detection

## Reality

No detector is 100% accurate.

---

## Recommended Method

Use hybrid scoring.

Features:

- Perplexity
- Burstiness
- Repetition
- Sentence variation

---

## Local Model

Use:

# Qwen3 8B

or

# Gemma 3 4B

Run via:

```bash
Ollama
```

Install:

```bash
https://ollama.com
```

Models:

```bash
ollama pull qwen3:8b
```

or

```bash
ollama pull gemma3:4b
```

---

# AI Detection Prompt

```text
Analyze this text.

Determine:

- Human probability
- AI probability

Return JSON only.
```

Output:

```json
{
  "human":25,
  "ai":75
}
```

---

# Grammar Checker

Use:

# LanguageTool

Website:

https://languagetool.org

Open Source.

---

## Self Host

Docker:

```bash
docker run \
-p 8010:8010 \
languagetool/languagetool
```

---

## Checks

- Grammar
- Spelling
- Punctuation
- Style

---

# Citation Checker

Supported:

- APA
- MLA
- Chicago
- Harvard

---

## Detection

Regex patterns.

Libraries:

```bash
citation-js
```

Install:

```bash
npm install citation-js
```

---

## Checks

- Missing references
- Broken references
- Duplicate references

---

# Readability Analysis

Library:

```bash
text-readability
```

Install:

```bash
npm install text-readability
```

---

## Metrics

Generate:

- Flesch Reading Ease
- Reading Grade Level
- Gunning Fog Index

---

# Academic Score Engine

Generate score:

```text
100
```

Based on:

| Factor | Weight |
|----------|----------|
| Grammar | 20 |
| Citations | 20 |
| Similarity | 30 |
| AI Score | 20 |
| Readability | 10 |

---

# Final Report

Output:

```json
{
  "overallScore":88,
  "similarity":22,
  "aiProbability":14,
  "grammarIssues":3,
  "citationIssues":1,
  "readability":"College Level"
}
```

---

# Dashboard UI

Tabs:

```text
Overview
Similarity
Sources
AI Detection
Grammar
Citations
Readability
```

---

# SEO Pages

Create:

```text
/plagiarism-checker
/ai-detector
/pdf-plagiarism-checker
/docx-plagiarism-checker
/citation-checker
/grammar-checker
/readability-checker
```

Each page:

- 1500+ words
- FAQ schema
- Tool schema
- Examples

---

# Hosting

Frontend:

```text
Vercel
```

Database:

```text
Supabase
```

Vector Search:

```text
pgvector
```

Models:

```text
Local Ollama
```

---

# Total Cost

Frontend:

```text
£0
```

Database:

```text
£0
```

Vector Search:

```text
£0
```

Embeddings:

```text
£0
```

AI Models:

```text
£0
```

Grammar Engine:

```text
£0
```

OCR:

```text
£0
```

---

# Build Order

## Week 1

- PDF extraction
- DOCX extraction
- OCR extraction

## Week 2

- Similarity engine
- Embeddings
- pgvector

## Week 3

- Source discovery
- Web matching

## Week 4

- AI detection
- Ollama integration

## Week 5

- Grammar checker
- Citation checker

## Week 6

- Readability engine
- Academic score engine

## Week 7

- Dashboard UI
- Report export

## Week 8

- SEO pages
- Analytics
- Search Console