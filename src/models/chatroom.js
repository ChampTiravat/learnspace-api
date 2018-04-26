import mongoose, { Schema } from 'mongoose'

/**
 * @name ChatroomSchema
 * @type Mongoose Schema
 * @desc Chatroom. Holding messages of the members of a particular classroom
 * @prop { classroom } [ObjectId] : A classroom which the chatroom belongs to
 */
const ChatroomSchema = new Schema({
  classroom: {
    type: Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  }
})

ChatroomSchema.set('redisCache', true)
ChatroomSchema.set('expires', 60)

export default mongoose.model('chatrooms', ChatroomSchema)
