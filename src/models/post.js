import mongoose, { Schema } from 'mongoose'

/**
 * @name PostSchema
 * @type mongoose schema
 * @desc Post, by deafult can be created only by classroom creator.
 *       Uses as a major medium for teaching and learning inside the classroom
 * @prop { title } string : Post title text. This text will be displayed on each post item in a list of posts
 * @prop { recipe } string : Post's contents, structured as JSON text. We have to parse this
 *                          into Javascript array of objects in order to display them visually
 * @prop { isPublic } boolean : By default, every post is only restricted and available for classroom members
 * @prop { creator } objectid : User who created the post
 * @prop { classroom } objectid : Classroom which the post belongs to
 * @prop { comments } [objectid] : Comments which belong to a particular post. Represented as an array of Comment Schemas
 * @prop { createdAt } date : Date when the post was created
 * @prop { updatedAt } date : Date when the post's information have beend updated
 */
const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  recipe: String,
  isPublic: {
    type: Boolean,
    default: false
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  classroom: {
    type: Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'comments',
      required: true
    }
  ],

  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
})

PostSchema.set('redisCache', true)
PostSchema.set('expires', 60)

export default mongoose.model('posts', PostSchema)
