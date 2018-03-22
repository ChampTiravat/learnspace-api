import jwt from 'jsonwebtoken'
import { isMongoId, isEmpty, trim } from 'validator'

import { SECRET_TOKEN_KEY } from '../config/security-config'

/** ==================================================================================
 * @name requiredAuthentication()
 * @desc Make sure user have the right permission to access the
 *       particular resource, by verifying their authentication status
 * @param { user } [GRAPHQL_CONTEXT] : Current user extracted from JWT Token since he/she was logged-in
 * @return Boolean
 ================================================================================== */
export const requiredAuthentication = async user =>
  !user || isEmpty(trim(user._id)) || !isMongoId(user._id) ? false : true

/** ==================================================================================
 * @name requireClassroomMember()
 * @desc Make sure user have the right permission to access the
 *       particular resource, by Making sure they are classroom member
 * @param { classroomID } [GRAPHQL_ARGS] : Classroom ID
 * @param { Classroom } [GRAPHQL_CONTEXT] : Mongoose Model names "Classroom"
 * @param { user } [GRAPHQL_CONTEXT] : Current user extracted from JWT Token since he/she was logged-in
 ================================================================================== */
export const requireClassroomMember = async (classroomID, Classroom, user) => {
  // Make sure user is already authenticated
  await requiredAuthentication(user)

  // In case the classroom ID was not provided. This means something went wrong
  if (isEmpty(trim(_id)) || !isMongoId(_id)) {
    return { err: { message: 'Not Authorized Access' } }
  }

  // Checking wether user is a member of the given classroom or not
  // IF NOT isClassroomMember DO
  //    RETURN message "Not Authorized Access"
}

/** ==================================================================================
 * @name verifyToken()
 * @desc Verifying wether the given token is valid or not
 * @param token string : A token to verify
 * @return Object(an extracted data from the given token)
 ================================================================================== */
export const verifyToken = async token => {
  if (!token || token === '') {
    throw new Error("ERROR: 1st parameter 'token' not specified!")
  }

  const extractedData = await jwt.verify(token, SECRET_TOKEN_KEY)

  if (!extractedData) {
    throw new Error('ERROR: Token Invalid!')
  }

  return extractedData
}

/** ==================================================================================
 * @name generateToken()
 * @desc Generate accessToken or refreshToken depending on the parameter
 * @param payload object : Object contains data which will be storing in the Token
 * @param type string : Specify wether to generate accessToken
 *     or refreshToken. Possible values are 'accessToken' or 'refreshToken'
 * @return string : a generated token
 ================================================================================== */
export const generateToken = async (payload, type) => {
  let token = ''

  if (!payload || payload == null)
    throw new Error("ERROR: 1st parameter 'payload' not specified!")

  if (!type || type === '')
    throw new Error("ERROR: 2nd parameter 'type' not specified!")

  if (type === 'accessToken') {
    token = await jwt.sign(payload, SECRET_TOKEN_KEY, {
      expiresIn: 60 * 10 // Last for 10 minutes
    })
  } else if (type === 'refreshToken') {
    token = await jwt.sign(payload, SECRET_TOKEN_KEY) // This token will last forever
  }

  return token
}

/** ==================================================================================
 * @name generateNewTokensIfExpired()
 * @desc Generate new both access/refresh tokens of old accessToken is expired
 * @param payload object : a payload from old refreshToken
 * @return Object (contains new refresh/access tokens)
 ================================================================================== */
export const generateNewTokensIfExpired = async payload => {
  if (!payload || payload == null)
    throw new Error("ERROR: 1st parameter 'refreshToken' not specified!")

  const newRefreshToken = await generateToken(payload, 'refreshToken')
  const newAccessToken = await generateToken(payload, 'accessToken')

  return { newRefreshToken, newAccessToken }
}
