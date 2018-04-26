import mongoose, { Schema } from 'mongoose'

const DEFAULT_CLASSROOM_THUMBNAIL = '/static/images/default/user-profile.jpg'

/**
 * @name ClassroomMemberSchema
 * @type Mongoose Schema
 * @desc A online classroom which providing a tools supporting online and interactive learning process
 * @prop { name } String : Classroom's name
 * @prop { subject } String : Major subject teaching in this classroom
 * @prop { thumbnail } String : Classroom's thumbnail(Classroom's profile picture)
 * @prop { description } String : Short and concise text to describe the classroom
 * @prop { outlines } [ObjectId] : List of classroom's course outlines
 * @prop { creator } ObjectId : Classroom's creator
 * @prop { createdAt } Date : Date when the classroom was created
 * @prop { updatedAt } Date : Lasted date when the classroom's information have been edited
 */
const ClassroomSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true,
    default: DEFAULT_CLASSROOM_THUMBNAIL
  },
  description: {
    type: String,
    required: true
  },
  outlines: [
    {
      type: Schema.Types.ObjectId,
      ref: 'CourseOutline',
      required: true
    }
  ],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
})

ClassroomSchema.set('redisCache', true)
ClassroomSchema.set('expires', 60)

export default mongoose.model('classrooms', ClassroomSchema)
