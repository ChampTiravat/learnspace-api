import mongoose, { Schema } from 'mongoose'

/**
 * @name ClassroomMemberSchema
 * @type Mongoose Schema
 * @desc A mapping of user who participated to a specific classroom
 * @prop { member } [ObjectId] : A user who participated to specific classrooms
 * @prop { classroom } [ObjectId] : A classroom which the member participated
 * @prop { role } [String] : Member's permission in the classroom Possible values are "member"(default), "admin"
 * @prop { createdAt } [Date] : Date when member join the classroom(got accpeted from classroom creator or accepts the invitation)
 * @prop { updatedAt } [Date] : Date when user's permission have changed to a higher/lower level
 */
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
    default: 'member'
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
})

ClassroomMemberSchema.set('redisCache', true)
ClassroomMemberSchema.set('expires', 60)

export default mongoose.model('classroom_members', ClassroomMemberSchema)
