import bcrypt from 'bcrypt'

import { generateToken } from '../helpers/security-helpers'

export default {
  Query: {
    /**
     * @name user()
     * @type resolver
     * @desc Query information about a specific user corresponding to a given ID
     * @param parent : default parameter from ApolloServer
     * @param { _id } : User ID(from MongoDB ObjectID)
     * @param { models } : Mongoose Model
     * @return Object : GraphQL User Type
     */
    user: async (parent, { _id }, { models }) => {
      try {
        const user = await models.User.findOne({ _id })
        return {
          _id: user._id,
          email: user.email,
          fname: user.fname,
          lname: user.lname,
          career: user.career,
          address: user.address,
          username: user.username,
          profilePicture: user.profilePicture,
          classrooms: []
        }
      } catch (err) {
        // Returning GraphQL Error Type
        return {
          err
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
    register: async (parent, { fname, lname, email, password }, { models }) => {
      // Important credentials should not be empty
      if (fname.length === 0 || email.length === 0 || password.length === 0) {
        return {
          success: false,
          user: null,
          err:
            'Important credentials should not be empty. Please provide all important credentials'
        }
      }

      // Password Validation
      if (password.length < 8) {
        return {
          success: false,
          user: null,
          err: 'Password is too weak, must be at least >= 8 characters'
        }
      }

      try {
        const ifUserAlreadyExist = await models.User.findOne({ email })

        // User email must be unique
        if (ifUserAlreadyExist) {
          return {
            success: false,
            user: null,
            err: 'User already exist with the given credentials'
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
          err
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
    login: async (parent, { email, password }, { models }) => {
      try {
        const user = await models.User.findOne({ email })

        if (!user) {
          // no user found
          return {
            success: false,
            token: '',
            user: null,
            err: 'User not found'
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
            { email: user.email },
            'accessToken'
          )

          const refreshToken = await generateToken(
            { email: user.email },
            'refreshToken'
          )

          return {
            success: true,
            refreshToken,
            accessToken,
            user,
            err: ''
          }
        } else {
          // Wrong Password
          return {
            success: false,
            token: '',
            user: null,
            err: 'Wrong Password'
          }
        }
      } catch (err) {
        return {
          success: false,
          token: '',
          user: null,
          err: err.message
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
      parent,
      { _id, username, fname, lname, career, address },
      { models }
    ) => {
      try {
        const expectedFields = [username, fname, lname, career, address]
        console.log(...expectedFields, _id)

        expectedFields.filter(field => field != '')

        await models.User.findOne({ _id }).update({
          ...expectedFields
        })

        return {
          success: true
        }
      } catch (err) {
        return {
          success: false,
          err
        }
      }
    }
  }
}
