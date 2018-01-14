import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { SECRET_TOKEN_KEY } from '../config/security-config'

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
          // Correct Password
          const accessToken = await jwt.sign(
            { email: user.email },
            SECRET_TOKEN_KEY,
            {
              expiresIn: 60 * 10 // 10 minutes
            }
          )

          const refreshToken = await jwt.sign(
            { email: user.email },
            SECRET_TOKEN_KEY
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
        console.log(err)
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
