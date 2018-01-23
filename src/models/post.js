import mongoose, { Schema } from 'mongoose'

const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  receipe: [
    {
      type: String
    }
  ],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
  }
})

export default mongoose.model('posts', PostSchema)
