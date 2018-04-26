import jwt from 'jsonwebtoken'
import { isMongoId, isEmpty, trim } from 'validator'

import { displayErrMessageWhenDev } from './error-helpers'
import ClassroomMember from '../models/classroom-member'
import { SECRET_TOKEN_KEY } from '../config'

/** ==================================================================================
 * @name requiredAuthentication()
 * @desc verifying user's authentication status and return TRUE if he/she is authenticated, FALSE otherwise.
 * @param user [GRAPHQL_CONTEXT] : Current user(Javascript Object) extracted from JWT Token since he/she was logged-in.
 * @return Boolean
 ================================================================================== */
export const requiredAuthentication = async user => (!user || !isMongoId(user._id) ? false : true)

/** ==================================================================================
 * @name requireClassroomMember()
 * @desc Make sure user have the right permission to access the
 *       particular resource, by Making sure they are classroom member.
 * @param classroomID [GRAPHQL_ARGS] : Classroom ID.
 * @param user [GRAPHQL_CONTEXT] : Current user extracted from JWT Token since he/she was logged-in.
 ================================================================================== */
export const requireClassroomMember = async (user, classroomID) => {
  try {
    const userID = String(user._id)
    const classID = String(classroomID)

    // In case the user ID was not provided. This means user is not authenticated.
    if (isEmpty(trim(userID)) || !isMongoId(userID)) {
      return false
    }

    // In case the classroom ID was not provided. return FALSE
    if (isEmpty(trim(classID)) || !isMongoId(classID)) {
      return false
    }

    // Checking wether user is a member of the given classroom or not.
    const isMember = await ClassroomMember.findOne({
      member: userID,
      classroom: classroomID
    })

    // Return TRUE, if a given user is a member of a given classroom. Otherwise, return FALSE.
    return !!isMember
  } catch (err) {
    displayErrMessageWhenDev(err)
    return false
  }
}

/** ==================================================================================
 * @name requiredClassroomAdmin()
 * @desc Make sure user have the right permission to access the
 *       particular resource, by Making sure they are classroom administrator(Admin)
 * @param user [GRAPHQL_CONTEXT] : Current user extracted from JWT Token since he/she was logged-in
 * @param classroomID [GRAPHQL_ARGS] : Classroom ID
 * @param ClassroomMember [GRAPHQL_CONTEXT] : Mongoose Model names "ClassroomMember"
 * @return Boolean
 ================================================================================== */
export const requiredClassroomAdmin = async (user, classroomID, ClassroomMember) => {
  try {
    // In case the classroom ID was not provided. This means something went wrong
    if (!user || isEmpty(trim(user._id)) || !isMongoId(user._id)) {
      return false
    }

    // Checking wether user is an admin of a given classroom or not
    const isClassroomAdmin = await ClassroomMember.findOne({
      classroom: classroomID,
      member: user._id,
      role: 'admin'
    })

    // return TRUE if user is an admin of a given classroom
    // Other wise FALSE will be returned
    return !!isClassroomAdmin
  } catch (err) {
    displayErrMessageWhenDev(err)
    return false
  }
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

  if (!payload || payload == null) throw new Error("ERROR: 1st parameter 'payload' not specified!")

  if (!type || type === '') throw new Error("ERROR: 2nd parameter 'type' not specified!")

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
