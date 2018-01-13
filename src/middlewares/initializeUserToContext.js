import jwt from 'jsonwebtoken'

import { SECRET_TOKEN_KEY } from '../config/security-config'

/**
 * @name initializeUserToContext()
 * @type Middleware
 * @desc
 */
const initializeUserToContext = async (req, res, next) => {
  const token = await req.headers.authorization

  if (!token) {
    req.user = null
    return next()
  }

  try {
    const user = await jwt.verify(token, SECRET_TOKEN_KEY)

    if (user.email && user.email !== '') {
      req.user = user
    } else {
      req.user = null
    }
  } catch (err) {
    req.user = null
    console.log('Invalid Token')
  }

  return next()
}

export default initializeUserToContext
