import mongoose, { Schema } from 'mongoose'

const DEFAULT_CLASSROOM_THUMBNAIL =
  '/static/images/background/login-background.jpg'

const CourseOutlineSchema = new Schema({
  passed: Boolean,
  title: String
})

const ClassroomSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  outline: [CourseOutlineSchema],
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  joinRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  subject: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: DEFAULT_CLASSROOM_THUMBNAIL
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
})

mongoose.model('course-outline', CourseOutlineSchema)

export default mongoose.model('classrooms', ClassroomSchema)
