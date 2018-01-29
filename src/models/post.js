import mongoose, { Schema } from 'mongoose'

const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  recipe: String,
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  classroom: {
    type: Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  isPublic: {
    type: Boolean,
    default: false
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
})

export default mongoose.model('posts', PostSchema)
