import mongoose, { Schema } from 'mongoose'

const DEFAULT_CLASSROOM_THUMBNAIL = 'http://some-url.com/some-image.jpg'

const CourseOutlineSchema = new Schema({
  isPassed: Boolean,
  name: String
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
  }
})

export default mongoose.model('classrooms', ClassroomSchema)
