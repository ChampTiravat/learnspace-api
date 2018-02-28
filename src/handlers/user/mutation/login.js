import { isEmail, isEmpty, trim } from 'validator'
import bcrypt from 'bcrypt'

import { generateToken } from '../../../helpers/security-helpers'
import { PASSWORD_PATTERN } from '../../../constants/regex-patterns'

/** ==================================================================================
 * @name login()
 * @type resolver
 * @desc Authenticate user by verifying their email nad password
 * @param parent : default parameter from ApolloServer
 * @param { email } [GRAPHQL_ARGS] : User email
 * @param { password } [GRAPHQL_ARGS] : User password
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @return GraphQL LoginResponse Type
 ================================================================================== */
export default async (_, { email, password }, { models }) => {
  try {
    // Inputs Validation
    if (isEmpty(trim(email)) || isEmpty(trim(password))) {
      return {
        success: false,
        user: null,
        token: '',
        err: {
          name: 'login',
          message: 'Email or Password not specified'
        }
      }
    }

    if (!isEmail(email) || email.length > 250) {
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

    // Password may contain anything and must have
    // a length between 8 - 55 characters
    if (!PASSWORD_PATTERN.test(password) || password.length > 55) {
      return {
        success: false,
        user: null,
        err: {
          name: 'login',
          message: 'Password is not valid'
        }
      }
    }

    const user = await models.User.findOne({ email })

    if (!user) {
      // User not found
      return {
        success: false,
        token: '',
        user: null,
        err: {
          name: 'login',
          message: 'Invalid Credentials'
        }
      }
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compareSync(password, user.password)

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
        user: null,
        token: '',
        err: {
          name: 'login',
          message: 'Invalid Credentials'
        }
      }
    }
  } catch (err) {
    return {
      success: false,
      user: null,
      token: '',
      err: {
        name: 'login',
        message: 'Server Error'
      }
    }
  }
}
