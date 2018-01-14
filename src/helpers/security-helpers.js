import jwt from 'jsonwebtoken'

import { SECRET_TOKEN_KEY } from '../config/security-config'

/**
 * @name requiredAuthentication()
 * @desc Verify that the user is already authenticated
 * @param
 * @return
 */
export const requiredAuthentication = () => {
  // Do something
}

/**
 * @name generateToken()
 * @desc Generate accessToken or refreshToken depending on the parameter
 * @param payload : Object contains data which will be storing in the Token
 * @param type string : Specify wether to generate accessToken
 *     or refreshToken. Possible values are 'accessToken' or 'refreshToken'
 */
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
