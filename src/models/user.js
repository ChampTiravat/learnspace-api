import mongoose, { Schema } from 'mongoose'

const DEFAULT_PROFILE_PICTURE = '/static/images/default/user-profile.jpg'
const DEFAULT_USER_ROLE = 'user'

/**
 * @name UserSchema
 * @type mongoose schema
 * @desc User's information
 * @prop { fname } string : Firstname
 * @prop { lname } string : Lastname
 * @prop { email } string : Email
 * @prop { password } string : Password
 * @prop { username } string : Username
 * @prop { address } string : Address(Not required)
 * @prop { career } string : Career(Not required)
 * @prop { profilePicture } string : User's profile picture(default picture will be set after registation)
 * @prop { role } string : User's role in the system("user" is the defualt)
 * @prop { birthDate } date : Date of birth of the user
 * @prop { createdAt } date : Date when user is registered for an account
 * @prop { updatedAt } date : Lasted date when user updated/edited the information
 */
const UserSchema = new Schema({
  fname: {
    type: String,
    lowercase: true,
    required: true
  },
  lname: {
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
    required: true,
    lowercase: true
  },
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  address: {
    type: String,
    required: false,
    lowercase: true
  },
  career: {
    type: String,
    required: false,
    lowercase: true
  },
  profilePicture: {
    type: String,
    default: DEFAULT_PROFILE_PICTURE
  },
  role: {
    type: String,
    default: DEFAULT_USER_ROLE
  },
  birthDate: {
    type: Date,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
})

UserSchema.set('redisCache', true)
UserSchema.set('expires', 60)

export default mongoose.model('users', UserSchema)
