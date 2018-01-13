import jwt from 'jsonwebtoken'

import { SECRET_TOKEN_KEY } from '../config/security-config'

/**
 * @name extractUserFromToken()
 * @type Middleware
 * @param req : HTTP Request
 * @param res : HTTP Response
 * @param next : Next Middleware
 * @desc Extract user information from the given token(JSON) then attach it the HTTP Request Object.
 *        So, Apollo GraphQLExpress() should add the exacted user to it's context
 */
const extractUserFromToken = async (req, res, next) => {
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

export default extractUserFromToken
