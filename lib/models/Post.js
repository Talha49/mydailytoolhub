import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title.'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug.'],
    unique: true,
    index: true,
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide an SEO description.'],
    trim: true,
  },
  markdown: {
    type: String,
    required: [true, 'Please provide markdown content.'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category.'],
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  tags: {
    type: [String],
    default: [],
  },
  readTime: {
    type: String,
    default: '5 min read',
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
}, {
  timestamps: true,
})

// Prevent compilation errors on Next.js hot-reloads
export default mongoose.models.Post || mongoose.model('Post', PostSchema)
