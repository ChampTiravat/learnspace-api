import { equals, isEmail, isEmpty, trim, isAlphanumeric } from 'validator'
import bcrypt from 'bcrypt'

import {
  ENG_THA_NUM_ALPHA,
  PASSWORD_PATTERN
} from '../../../constants/regex-patterns'

/** ==================================================================================
 * @name register()
 * @type resolver
 * @desc Create a new user with a given information
 * @param parent : default parameter from ApolloServer
 * @param { username } [GRAPHQL_ARGS] : User's username
 * @param { fname } [GRAPHQL_ARGS] : User's firstname
 * @param { lname } [GRAPHQL_ARGS] : User's lastname(Not required)
 * @param { email } [GRAPHQL_ARGS] : User's email
 * @param { password } [GRAPHQL_ARGS] : User's password(Must be at least >= 8 chars)
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @return Object : GraphQL RegisterResponse Type
 ================================================================================== */
export default async (
  _,
  { fname, lname, email, password, username },
  { models }
) => {
  try {
    // Inputs Validation
    if (
      isEmpty(trim(username)) ||
      isEmpty(trim(fname)) ||
      isEmpty(trim(email)) ||
      isEmpty(trim(lname)) ||
      isEmpty(trim(password))
    ) {
      return {
        success: false,
        user: null,
        err: {
          name: 'register',
          message: 'Important credentials should not be empty'
        }
      }
    }

    // Email format Validation
    if (!isEmail(email) || email.length > 250) {
      return {
        success: false,
        user: null,
        err: {
          name: 'register',
          message: 'Email is not valid'
        }
      }
    }

    // Username must contains only ENG alphabets
    // and must be only 1 - 30 characters
    if (!isAlphanumeric(username) || username.length > 50) {
      return {
        success: false,
        user: null,
        err: {
          name: 'register',
          message: 'Username is not valid'
        }
      }
    }

    // Firstname must contains only ENG or THA alphabets
    // and must be only 1 - 50 characters
    if (!ENG_THA_NUM_ALPHA.test(fname) || fname.length > 50) {
      return {
        success: false,
        user: null,
        err: {
          name: 'register',
          message: 'Firstname is not valid'
        }
      }
    }

    // Lastname must contains only ENG or THA alphabets
    // and must be only 1 - 50 characters
    if (!ENG_THA_NUM_ALPHA.test(lname) || lname.length > 50) {
      return {
        success: false,
        user: null,
        err: {
          name: 'register',
          message: 'Lastname is not valid'
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
          message: 'Password is too weak, must be >= 8, but <= 250 characters'
        }
      }
    }

    // Checking wether user is already exists
    const userWithTheSameCreds = await models.User.findOne({
      $or: [{ email: email }, { username: username }]
    })

    // User email must be unique
    if (userWithTheSameCreds) {
      // Email conflict
      if (equals(userWithTheSameCreds.email, email)) {
        return {
          success: false,
          user: null,
          err: {
            name: 'register',
            message: 'User already exist with the given email'
          }
        }
      }

      // Username conflict
      if (equals(userWithTheSameCreds.username, username)) {
        return {
          success: false,
          user: null,
          err: {
            name: 'register',
            message: 'User already exist with the given username'
          }
        }
      }
    }

    // Encrypt Password
    const salt = await bcrypt.genSaltSync(12)
    const hashedPassword = await bcrypt.hashSync(password, salt)

    // Saving new user
    const user = await models.User.create({
      username,
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
    console.log(err)
    return {
      success: false,
      user: null,
      err: {
        name: 'register',
        message: 'Server Error'
      }
    }
  }
}
