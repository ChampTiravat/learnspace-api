import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema({
	creator: {
		type: String,
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
	}
})

export default mongoose.model('notifications', NotificationSchema)
