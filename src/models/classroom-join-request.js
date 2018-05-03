import mongoose, { Schema } from 'mongoose'

/**
 * @name ClassroomJoinRequestSchema
 * @type Mongoose Schema
 * @desc A mapping of user who wish to be participated to a specific classroom
 * @prop { candidate } [ObjectId] : A user who wish to be participated to a specific classroom
 * @prop { classroom } [ObjectId] : A classroom which the candidate wish to be participated with
 * @prop { createdAt } [Date] : Date when member join the classroom(got accpeted from classroom creator or accepts the invitation)
 * @prop { updatedAt } [Date] : Date when user's permission have changed to a higher/lower level
 */
const ClassroomJoinRequestSchema = new Schema({
  candidate: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  classroom: {
    type: Schema.Types.ObjectId,
    ref: 'classrooms',
    required: true
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
})

ClassroomJoinRequestSchema.set('redisCache', false)

export default mongoose.model('classroom_join_request', ClassroomJoinRequestSchema)
