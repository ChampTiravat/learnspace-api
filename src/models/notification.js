import mongoose, { Schema } from 'mongoose'

/**
 * @name notificationschema
 * @type mongoose schema
 * @desc notification item, uses to notify user an important events which have been occured
 * @prop { issuer } string : "name" of the event creator(classroom or user). this name will be displayed on the notification message
 * @prop { message } string : notification message. this contain what event has been occured and who did it
 * @prop { type } string : type of the notification
 * @prop { isread } boolean : status of the notification. determining wether it has been read or not
 * @prop { creator } objectid : notification creator(might be a classroom or a particular user)
 * @prop { receiver } objectid : user who will received this notification(this receiver won't be displayed on the message)
 * @prop { createdat } date : date when the notification was created
 */
const NotificationSchema = new Schema({
  issuer: {
    type: String,
    required: true
  },
  message: {
    type: String,
    trim: true,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    required: true,
    default: false
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now() }
})

NotificationSchema.set('redisCache', true)
NotificationSchema.set('expires', 60)

export default mongoose.model('notifications', NotificationSchema)
