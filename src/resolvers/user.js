import { isEmail, isAlpha, isEmpty, trim, isMongoId } from 'validator'
import bcrypt from 'bcrypt'

import { generateToken } from '../helpers/security-helpers'
import {
  ENG_THA_NUM_ALPHA,
  PASSWORD_PATTERN
} from '../constants/regex-patterns'

export default {
  Query: {
    /**
     * @name userProfile()
     * @type resolver
     * @desc Query information about a specific user corresponding to a given ID
     * @param parent : default parameter from ApolloServer
     * @param { _id } [GRAPHQL_ARGS] : User ID(from MongoDB ObjectID)
     * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
     * @return Object : GraphQL UserProfileResponse Type
     */
    userProfile: async (_, { _id }, { models }) => {
      try {
        // Input Validation
        if (isEmpty(trim(_id)) || !isMongoId(_id)) {
          return {
            user: null,
            err: {
              name: 'user',
              message: 'User ID invalid or not specified'
            }
          }
        }

        // Querying user
        const user = await models.User.findOne({ _id })

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
  }, // End Query
  Mutation: {
    /**
     * @name register()
     * @type resolver
     * @desc Create a new user with a given information
     * @param parent : default parameter from ApolloServer
     * @param { fname } [GRAPHQL_ARGS] : User's firstname
     * @param { lname } [GRAPHQL_ARGS] : User's lastname(Not required)
     * @param { email } [GRAPHQL_ARGS] : User's email
     * @param { password } [GRAPHQL_ARGS] : User's password(Must be at least >= 8 chars)
     * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
     * @return Object : GraphQL RegisterResponse Type
     */
    register: async (_, { fname, lname, email, password }, { models }) => {
      try {
        // Inputs Validation
        if (
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
        // a length between 8 - 250 characters
        if (!PASSWORD_PATTERN.test(password) || password.length > 250) {
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
              message:
                'Password is too weak, must be >= 8, but <= 250 characters'
            }
          }
        }

        // Checking wether user is already exists
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
          fname: fname,
          lname: lname,
          email: email,
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
     * @param { email } [GRAPHQL_ARGS] : User email
     * @param { password } [GRAPHQL_ARGS] : User password
     * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
     * @return GraphQL LoginResponse Type
     */
    login: async (_, { email, password }, { models }) => {
      try {
        // Inputs Validation
        if (isEmpty(trim(email)) || isEmpty(trim(password))) {
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
        // a length between 8 - 250 characters
        if (!PASSWORD_PATTERN.test(password) || password.length > 250) {
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
              message: 'Invalid Credentials'
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
     * @param { username } [GRAPHQL_ARGS] : New username
     * @param { fname } [GRAPHQL_ARGS] : User new firstname
     * @param { lname } [GRAPHQL_ARGS] : User new lastname
     * @param { career } [GRAPHQL_ARGS] : User new career
     * @param { address } [GRAPHQL_ARGS] : User new address
     * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
     * @param { user } [GRAPHQL_CONTEXT] : Current authenticated user
     * @return GraphQL EditProfileResponse Type
     */
    editProfile: async (
      _,
      { username, fname, lname, career, address },
      { models }
    ) => {
      try {
      } catch (err) {}
    }
  } // End Mutation
}
