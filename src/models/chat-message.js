import mongoose, { Schema } from 'mongoose'

const ChatMessageSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  parentChatroom: {
    type: Schema.Types.ObjectId,
    ref: 'Chatroom',
    required: true
  }
})

ChatMessageSchema.set('redisCache', true)
ChatMessageSchema.set('expires', 60)

export default mongoose.model('chat_messages', ChatMessageSchema)
