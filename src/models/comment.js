import mongoose, { Schema } from 'mongoose'

const CommentSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  parentPost: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  subComments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'SubComment'
    }
  ],
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
})

CommentSchema.set('redisCache', true)
CommentSchema.set('expires', 60)

export default mongoose.model('comments', CommentSchema)
