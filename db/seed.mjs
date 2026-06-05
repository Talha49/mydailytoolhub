import { addDocument, loadSubmissions } from '../lib/vector-store.js'

const SAMPLES = [
  {
    filename: 'Wikipedia - JSON Structure.txt',
    text: 'JSON (JavaScript Object Notation) is a lightweight data-interchange format. It is easy for humans to read and write, and easy for machines to parse and generate. JSON is built on two structures: a collection of name/value pairs and an ordered list of values. It is the most common format used for transmitting data in web applications between server and client APIs.'
  },
  {
    filename: 'GitHub - Regex Tooling repos.txt',
    text: 'A regular expression (regex or regexp) is a sequence of characters that specifies a search pattern in text. Usually such patterns are used by string-searching algorithms for "find" or "find and replace" operations on strings, or for input validation. In modern software engineering, regular expressions are essential for parsing log files, scraping web data, and validating user inputs.'
  },
  {
    filename: 'W3Schools - JavaScript JSON Introduction.txt',
    text: 'JavaScript Object Notation (JSON) is a standard text-based format representing structured data based on JavaScript object syntax. It is commonly used for transmitting data in web applications (e.g., sending data from the server to the client, so it can be displayed on a web page, or vice versa). JSON files have a .json extension.'
  },
  {
    filename: 'University Guidelines - Academic Integrity.txt',
    text: 'Academic integrity is the moral code or ethical policy of academia. This includes values such as avoidance of plagiarism, maintenance of academic standards, honesty, and rigor in research. With the rise of generative artificial intelligence and large language models, universities are establishing new guidelines to define the acceptable boundary of AI-assisted writing and software generation in student submissions.'
  }
]

async function seed() {
  console.log('Connecting to MongoDB & checking vector database state...')
  const dbSubmissions = await loadSubmissions()
  
  if (dbSubmissions && dbSubmissions.length > 0) {
    console.log(`Database already has ${dbSubmissions.length} documents. Skipping seeding.`)
    process.exit(0)
  }

  console.log('Initializing seeder... Registering sample documents...')
  
  for (const sample of SAMPLES) {
    try {
      console.log(`Processing sample: ${sample.filename}`)
      
      const chunks = [
        {
          text: sample.text,
          embedding: []
        }
      ]
      
      await addDocument(sample.filename, sample.text, chunks)
      console.log(`Successfully added to MongoDB: ${sample.filename}`)
    } catch (e) {
      console.error(`Failed to process sample "${sample.filename}":`, e.message)
    }
  }

  console.log('Database seeding to MongoDB completed successfully!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seeding process failed:', err)
  process.exit(1)
})
