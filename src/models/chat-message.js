import mongoose, { Schema } from 'mongoose'

/**
 * @name ChatMessageSchema
 * @type Mongoose Schema
 * @desc Chat Message
 * @prop { creator } [ObjectId] : Creator of a particular chat-message
 * @prop { message } [String] : Body of the message
 * @prop { chatroom } [ObjectId] : Chatroom which the chat-message belongs to
 */
const ChatMessageSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    trim: true,
    required: true
  },
  chatroom: {
    type: Schema.Types.ObjectId,
    ref: 'Chatroom',
    required: true
  }
})

ChatMessageSchema.set('redisCache', true)
ChatMessageSchema.set('expires', 20)

export default mongoose.model('chat_messages', ChatMessageSchema)
