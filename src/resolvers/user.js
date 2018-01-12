import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { SECRET_TOKEN_KEY } from '../config/security-config'
import User from '../models/user'

export default {
	Query: {
		user: async (parent, { email }, context) => {
			try {
				return await User.findOne({ email })
			} catch (err) {
				// Returning GraphQL Error Type
				return {
					err
				}
			}
		},
		users: async (parent, args, context) => {
			try {
				return User.find({})
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
		register: async (parent, args, context) => {
			try {
				const { fname, lname, email, password } = args
				const salt = await bcrypt.genSaltSync(12)
				const hashedPassword = await bcrypt.hashSync(password, salt)

				const user = await User.create({
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
		login: async (parent, { email, password }, context) => {
			console.log('Someone try to log in . . . ')
			try {
				const user = await User.findOne({ email })

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
					const accessToken = jwt.sign(
						{ email: user.email },
						SECRET_TOKEN_KEY,
						{
							expiresIn: 60 * 10 // 10 minutes
						}
					)

					const refreshToken = jwt.sign({ email: user.email }, SECRET_TOKEN_KEY)

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
