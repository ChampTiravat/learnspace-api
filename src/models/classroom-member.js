import mongoose, { Schema } from 'mongoose'

const ClassroomMemberSchema = new Schema({
  member: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  classroom: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Classroom'
    }
  ],
  role: {
    type: [String],
    required: true,
    default: 'member'
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
})

export default mongoose.model('classroom_members', ClassroomMemberSchema)
