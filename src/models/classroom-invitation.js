import mongoose, { Schema } from 'mongoose'

/**
 * @name ClassroomInvitationSchema
 * @type Mongoose Schema
 * @desc Invitation of a classroom. Uses to invite people to the classroom. Only the classroom creator
 *      who has a permission to send an invitation
 * @prop { candidate } [ObjectId] : A target user who will recieve the invitation
 * @prop { classroom } [ObjectId] : A classroom which sends invitations to people
 * @prop { status } [String] : Status of the invitaiton. Possible values are "waiting"(default), "accepted", "refused"
 * @prop { createdAt } [Date] : Created date of the invitation
 * @prop { updatedAt } [Date] : Lasted update of the invitation(the time when user respond to the invitation)
 */
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
    type: String,
    required: true,
    default: 'waiting'
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
})

ClassroomInvitationSchema.set('redisCache', true)
ClassroomInvitationSchema.set('expires', 60)

export default mongoose.model('classroom_invitations', ClassroomInvitationSchema)
