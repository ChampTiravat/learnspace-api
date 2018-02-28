import mongoose, { Schema } from 'mongoose'

const NotificationSchema = new Schema({
  issuer: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reciever: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    trim: true,
    required: true
  },
  isRead: {
    type: Boolean,
    required: true,
    default: false
  },
  type: {
    type: String,
    required: true
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
})

export default mongoose.model('notifications', NotificationSchema)
