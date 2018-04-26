import mongoose, { Schema } from 'mongoose'

/**
 * @name CommentSchema
 * @type Mongoose Schema
 * @desc Post's comment message
 * @prop { creator } ObjectId: Creator of the comment message
 * @prop { message } String : Body of the comment message
 * @prop { post } ObjectI : Parent post which the comment message belongs to
 * @prop { createdAt } Date : Date when this comment message was created
 * @prop { updatedAt } Date : Lasted date when the message of the comment message has been updated
 */
const CommentSchema = new Schema({
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
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
})

CommentSchema.set('redisCache', true)
CommentSchema.set('expires', 60)

export default mongoose.model('comments', CommentSchema)
