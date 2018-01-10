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

export default mongoose.model('chatrooms', ChatroomSchema)
