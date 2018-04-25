import jwt from 'jsonwebtoken'

import { verifyToken, generateNewTokensIfExpired } from '../helpers/security-helpers'

/**
 * @name extractUserFromToken()
 * @type Middleware
 * @param req : HTTP Request
 * @param res : HTTP Response
 * @param next : Next Middleware
 * @desc Extract user information from the given token(JSON) then attach it the HTTP Request Object.
 *       So, Apollo GraphQLExpress() should add the exacted user to it's context.
 *       If access token is not valid, created a new one by verifying refresh token
 */
const extractUserFromToken = async (req, res, next) => {
  // Get tokens
  const accessToken = await req.headers['x-access-token']
  const refreshToken = await req.headers['x-refresh-token']

  try {
    // If access token is not available. just skip to the next middleware
    if (!accessToken || accessToken === '') {
      throw new Error('AccessToken not specified')
      return next()
    }

    // Extract data from the access token
    const userFromAccessToken = await verifyToken(accessToken)

    if (!userFromAccessToken.email || userFromAccessToken.email == '') {
      throw new Error('AccessToken Invalid')
    }
    // If data is present, attach the extracted data to the HTTP Request Object
    req.user = userFromAccessToken
  } catch (err) {
    // access token might be invalid. So, we have to create a new one

    // Verify refresh token
    if (!refreshToken || refreshToken === '') {
      req.user = null
      return next()
    }

    // Extract data from refresh token

    const userFromRefreshToken = await verifyToken(refreshToken)

    // If refresh token is invalid. set req.user to NULL and do nothing
    if (!userFromRefreshToken.email || userFromRefreshToken.email === '') {
      req.user = null
      return next()
    }

    // If refresh token is valid. Created new access token and refresh token
    const { newRefreshToken, newAccessToken } = await generateNewTokensIfExpired(
      userFromRefreshToken
    )

    // and send theme back the the client
    res.set('Access-Control-Expose-Headers', 'x-access-token, x-refresh-token')
    res.set('x-access-token', newAccessToken)
    res.set('x-refresh-token', newRefreshToken)

    // set the req.user to the new created user object from new access token
    req.user = userFromRefreshToken
  }

  return next()
}

export default extractUserFromToken
