import mongoose, { Schema } from 'mongoose'

/**
 * @name SubCommentSchema
 * @type mongoose schema
 * @desc Like regular comments but sub-comment will be display as a child of a regular comment in a particular post
 * @prop { message } string : Body message of the comment
 * @prop { creator } objectId : User who creates the comment
 * @prop { parentComment } objectId : Comment which the sub-comment belongs to
 * @prop { createdAt } date : Date when the sub-comment was created
 * @prop { updatedAt } date : Lasted date when sub-comment's message was updated
 */
const SubCommentSchema = new Schema({
  message: {
    type: String,
    required: true,
    trim: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
})

SubCommentSchema.set('redisCache', true)
SubCommentSchema.set('expires', 60)

export default mongoose.model('sub_comments', SubCommentSchema)
