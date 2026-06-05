import mongoose from 'mongoose'

const ChunkSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  embedding: { 
    type: [Number], 
    required: true 
  }
})

const AcademicSubmissionSchema = new mongoose.Schema({
  filename: { 
    type: String, 
    required: true 
  },
  uploadedAt: { 
    type: Date, 
    default: Date.now 
  },
  text: { 
    type: String, 
    required: true 
  },
  chunks: [ChunkSchema]
}, {
  timestamps: true
})

// Prevent compilation errors on Next.js dev server hot-reloads
export default mongoose.models.AcademicSubmission || mongoose.model('AcademicSubmission', AcademicSubmissionSchema)
