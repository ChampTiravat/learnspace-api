import mongoose, { Schema } from 'mongoose'

const ClassroomMemberSchema = new Schema({
  member: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  classroom: {
    type: Schema.Types.ObjectId,
    ref: 'classrooms'
  },
  role: {
    type: String,
    required: true,
    default: 'member' // Possible values ['member', 'admin']
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
})

ClassroomMemberSchema.set('redisCache', true)
ClassroomMemberSchema.set('expires', 60)

export default mongoose.model('classroom_members', ClassroomMemberSchema)
