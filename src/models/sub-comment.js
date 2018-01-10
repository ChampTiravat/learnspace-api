import mongoose, { Schema } from 'mongoose'

const SubCommentSchema = new Schema({
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
	parentComment: {
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}
})

export default mongoose.model('sub_comments', SubCommentSchema)
