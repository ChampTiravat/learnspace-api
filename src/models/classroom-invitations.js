import mongoose, { Schema } from 'mongoose'

const ClassroomInvitationsSchema = new Schema({
  candidate: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  classroom: {
    type: Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
})

export default mongoose.model(
  'classroom_invitations',
  ClassroomInvitationsSchema
)
