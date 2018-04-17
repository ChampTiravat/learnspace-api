import mongoose, { Schema } from 'mongoose'

const DEFAULT_PROFILE_PICTURE = '/static/images/default/user-profile.jpg'
const DEFAULT_USER_ROLE = 'user'

const UserSchema = new Schema({
  fname: {
    type: String,
    lowercase: true,
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
  lname: { type: String, lowercase: true, required: true },
  username: { type: String, lowercase: true, unique: true, required: true },
  birthDate: Date,
  address: String,
  career: String,
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
})

UserSchema.set('redisCache', true)
UserSchema.set('expires', 60)

export default mongoose.model('users', UserSchema)
