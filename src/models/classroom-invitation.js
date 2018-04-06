import mongoose, { Schema } from 'mongoose'

const ClassroomInvitationSchema = new Schema({
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
  status: {
    // Possible values are => ["waiting", "accepted", "refused"]
    type: String,
    required: true,
    default: "waiting"
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
})

export default mongoose.model(
  'classroom_invitations',
  ClassroomInvitationSchema
)
