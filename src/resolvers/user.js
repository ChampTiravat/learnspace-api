import bcrypt from 'bcrypt'

import { generateToken } from '../helpers/security-helpers'

export default {
  Query: {
    user: async (parent, { email }, { models }) => {
      try {
        return await models.User.findOne({ email })
      } catch (err) {
        // Returning GraphQL Error Type
        return {
          err
        }
      }
    },
    users: async (parent, args, { models }) => {
      try {
        return await models.User.find({})
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
