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
        const user = await models.User.findOne({ _id: _id })
        console.log(user)
        const response = {
          _id: user._id,
          fname: user.fname,
          lname: user.lname,
          email: user.email,
          address: user.address,
          username: user.username,
          career: user.career,
          classrooms: []
        }
        console.log(response)
        return response
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
     * @desc Create a new user with a given information
     * @param parent : default parameter from ApolloServer
     * @param args : Arguments from GraphQL Query
     * @param { models } : Mongoose Model
     * @return Object : GraphQL User Type
     */
    register: async (parent, args, { models }) => {
      try {
        const { fname, lname, email, password } = args
        const salt = await bcrypt.genSaltSync(12)
        const hashedPassword = await bcrypt.hashSync(password, salt)

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
        // Has a chance to cause an Duplication Error
        return {
          success: false,
          user: null
        }
      }
    },
    /**
     * @name login()
     * @desc Authenticate user by verifying their email nad password
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
          const accessToken = generateToken(
            { email: user.email },
            'accessToken'
          )

          const refreshToken = generateToken(
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
    }
  }
}
