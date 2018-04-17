import mongoose, { Schema } from 'mongoose'

const ChatroomSchema = new Schema({
  parentClassroom: {
    type: Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  },
  message: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ChatMessage'
    }
  ]
})

ChatroomSchema.set('redisCache', true)
ChatroomSchema.set('expires', 60)

export default mongoose.model('chatrooms', ChatroomSchema)
