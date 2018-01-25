import mongoose, { Schema } from 'mongoose'

const DEFAULT_PROFILE_PICTURE = 'some picture url'
const DEFAULT_USER_ROLE = 'user'

const UserSchema = new Schema({
  fname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: DEFAULT_PROFILE_PICTURE
  },
  role: {
    type: String,
    default: DEFAULT_USER_ROLE
  },
  lname: String,
  username: String,
  birthData: Date,
  address: String,
  career: String,
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
})

export default mongoose.model('users', UserSchema)
