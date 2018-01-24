import bcrypt from 'bcrypt'

import { generateToken } from '../helpers/security-helpers'

const EMAIL_REGEX = /.+@([a-zA-Z0-9-]+)\.[a-zA-Z0-9-]+$/
const USER_ID_REGEX = /^([0-9a-f]{24})$/i
const USERNAME_REGEX = /[a-zA-Z0-9_]+/
const TEXT_REGEX = /^([\w]*)$/u
const NAME_REGEX = /([\w]*)/u
const PASSWORD_REGEX = /.*/

export default {
  Query: {
    /**
     * @name userProfile()
     * @type resolver
     * @desc Query information about a specific user corresponding to a given ID
     * @param parent : default parameter from ApolloServer
     * @param { _id } : User ID(from MongoDB ObjectID)
     * @param { models } : Mongoose Model
     * @return Object : GraphQL User Type
     */
    userProfile: async (_, { _id }, { models }) => {
      // Input Validation
      if (!_id || _id == '' || !USER_ID_REGEX.test(_id)) {
        return {
          user: null,
          err: {
            name: 'user',
            message: 'User ID invalid or not specified'
          }
        }
      }

      try {
        // Querying user
        const user = await models.User.findOne({ _id })

        // Querying user's classrooms
        const userClassrooms = await models.Classroom.find({
          creator: user._id
        })

        if (!user) {
          return {
            user: null,
            err: {
              name: 'user',
              message: 'User not found'
            }
          }
        }

        return {
          user: {
            _id: user._id,
            email: user.email,
            fname: user.fname,
            lname: user.lname,
            career: user.career,
            address: user.address,
            username: user.username,
            classrooms: userClassrooms,
            profilePicture: user.profilePicture
          },
          err: null
        }
      } catch (err) {
        return {
          user: null,
          err: {
            name: 'user',
            message: 'Server Error'
          }
        }
      }
    }
  },
  Mutation: {
    /**
     * @name register()
     * @type resolver
     * @desc Create a new user with a given information
     * @param parent : default parameter from ApolloServer
     * @param { fname } : User's firstname
     * @param { lname } : User's lastname(Not required)
     * @param { email } : User's email
     * @param { password } : User's password(Must be at least >= 8 chars)
     * @param { models } : Mongoose Model
     * @return Object : GraphQL User Type
     */
    register: async (_, { fname, lname, email, password }, { models }) => {
      // Inputs Validation
      if (
        fname.length === 0 ||
        email.length === 0 ||
        password.length === 0 ||
        lname.length === 0
      ) {
        return {
          success: false,
          user: null,
          err: {
            name: 'register',
            message:
              'Important credentials should not be empty. Please provide all important credentials'
          }
        }
      }

      // Email format Validation
      if (!EMAIL_REGEX.test(email)) {
        return {
          success: false,
          user: null,
          err: {
            name: 'register',
            message: 'Email is not valid'
          }
        }
      }

      if (!NAME_REGEX.test(fname)) {
        return {
          success: false,
          user: null,
          err: {
            name: 'register',
            message: 'Firstname is not valid'
          }
        }
      }

      if (!NAME_REGEX.test(lname)) {
        return {
          success: false,
          user: null,
          err: {
            name: 'register',
            message: 'Lastname is not valid'
          }
        }
      }

      if (!PASSWORD_REGEX.test(password)) {
        return {
          success: false,
          user: null,
          err: {
            name: 'register',
            message: 'Password is not valid'
          }
        }
      }

      // Password Validation
      if (password.length < 8) {
        return {
          success: false,
          user: null,
          err: {
            name: 'register',
            message: 'Password is too weak, must be at least >= 8 characters'
          }
        }
      }

      try {
        const ifUserAlreadyExist = await models.User.findOne({ email })

        // User email must be unique
        if (ifUserAlreadyExist) {
          return {
            success: false,
            user: null,
            err: {
              name: 'register',
              message: 'User already exist with the given credentials'
            }
          }
        }

        // Encrypt Password
        const salt = await bcrypt.genSaltSync(12)
        const hashedPassword = await bcrypt.hashSync(password, salt)

        // Saving new user
        const user = await models.User.create({
          fname,
          lname,
          email,
          password: hashedPassword
        })

        return {
          success: true,
          user
        }
      } catch (err) {
        return {
          success: false,
          user: null,
          err: {
            name: 'register',
            message: 'Server Error'
          }
        }
      }
    },
    /**
     * @name login()
     * @type resolver
     * @desc Authenticate user by verifying their email nad password
     * @param parent : default parameter from ApolloServer
     * @param { email } : User email
     * @param { password } : User password
     * @param { models } : Mongoose Model
     * @return GraphQL LoginResponse Type
     */
    login: async (_, { email, password }, { models }) => {
      // Inputs Validation
      if (!email || email == '' || !password || password == '') {
        return {
          success: false,
          token: '',
          user: null,
          err: {
            name: 'login',
            message: 'Email or Password not specified'
          }
        }
      }

      if (!EMAIL_REGEX.test(email)) {
        return {
          success: false,
          token: '',
          user: null,
          err: {
            name: 'login',
            message: 'Email is not valid'
          }
        }
      }

      try {
        const user = await models.User.findOne({ email })

        if (!user) {
          // User not found
          return {
            success: false,
            token: '',
            user: null,
            err: {
              name: 'login',
              message: 'User not found'
            }
          }
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compareSync(
          password,
          user.password
        )

        if (isPasswordValid) {
          // Password valid
          const accessToken = await generateToken(
            { email: user.email, _id: user._id },
            'accessToken'
          )

          const refreshToken = await generateToken(
            { email: user.email, _id: user._id },
            'refreshToken'
          )

          return {
            success: true,
            refreshToken,
            accessToken,
            user
          }
        } else {
          // Invalid Password
          return {
            success: false,
            token: '',
            user: null,
            err: {
              name: 'login',
              message: 'Wrong Password'
            }
          }
        }
      } catch (err) {
        return {
          success: false,
          token: '',
          user: null,
          err: {
            name: 'login',
            message: 'Server Error'
          }
        }
      }
    },
    /**
     * @name editProfile()
     * @type resolver
     * @desc Edit user's profile information
     * @param parent : default parameter from ApolloServer
     * @param { _id } : User ID
     * @param { username } : New username
     * @param { fname } : User new firstname
     * @param { lname } : User new lastname
     * @param { career } : User new career
     * @param { address } : User new address
     * @param { models } : Mongoose Model
     * @return GraphQL EditProfileResponse Type
     */
    editProfile: async (
      _,
      { _id, username, fname, lname, career, address },
      { models }
    ) => {
      const fieldsToUpdate = [username, fname, lname, career, address].filter(
        input => !!input
      )

      // Validation
      if (!_id || _id == '') {
        return {
          success: false,
          err: {
            name: 'editProfile',
            message: "Error 'ID' not specified"
          }
        }
      }

      if (!USER_ID_REGEX.test(_id)) {
        return {
          success: false,
          err: {
            name: 'editProfile',
            message: 'User ID not valid or not specified'
          }
        }
      }

      if (username & !USERNAME_REGEX.test(username)) {
        return {
          success: false,
          err: {
            name: 'editProfile',
            message: 'Username is not valid'
          }
        }
      }

      if (fname & !NAME_REGEX.test(fname)) {
        return {
          success: false,
          err: {
            name: 'editProfile',
            message: 'Firstname is not valid'
          }
        }
      }

      if (lname & !NAME_REGEX.test(lname)) {
        return {
          success: false,
          err: {
            name: 'editProfile',
            message: 'Lastname is not valid'
          }
        }
      }

      if (career & !TEXT_REGEX.test(career)) {
        return {
          success: false,
          err: {
            name: 'editProfile',
            message: 'Career is not valid'
          }
        }
      }

      if (address & !TEXT_REGEX.test(address)) {
        return {
          success: false,
          err: {
            name: 'editProfile',
            message: 'Address is not valid'
          }
        }
      }

      try {
        // Update user info
        const result = await models.User.findOneAndUpdate(
          { _id },
          { ...fieldsToUpdate }
        )

        return {
          success: true,
          err: null
        }
      } catch (err) {
        return {
          success: false,
          err: {
            name: 'editProfile',
            message: 'Server Error'
          }
        }
      }
    }
  }
}
