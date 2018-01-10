import mongoose, { Schema } from 'mongoose'

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
	parentPost: {
		type: Schema.Types.ObjectId,
		ref: 'Post'
	},
	subComments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'SubComment'
		}
	]
})

export default mongoose.model('comments', CommentSchema)
