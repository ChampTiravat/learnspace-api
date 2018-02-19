import jwt from "jsonwebtoken";

import { SECRET_TOKEN_KEY } from "../config/security-config";

/** ==================================================================================
 * @name requiredAuthentication()
 * @desc A resolver acts as a middleware between a real resolver wich intended to be execute.
 *       The purpose of this, is to make sure user have the right permission to access the
 *       particular resource, by verifying their authentication status
 * @param { user } [GRAPHQL_CONTEXT] : Current authenticated user
 ================================================================================== */
export const requiredAuthentication = async (parent, args, { user }) => {
  try {
    // A middleware with a specific permission
    const middlewareResolver = {
      /**
       * @name mustBeLoggedIn()
       * @desc User must be authenticated(must be logged-in)
       */
      mustBeLoggedIn: resolver => {
        if (!user || user == null || !user._id) {
          throw new Error("Not authenticated");
        }
        return resolver;
      },
      /**
       * @name mustBeClassroomAdmin()
       * @desc User must be authenticated and must be a classroom member(must be logged-in)
       */
      mustBeClassroomAdmin: resolver => {
        // Make sure user is an admin of a particular classroom
      }
    };

    return middlewareResolver;
  } catch (err) {
    // User doesn't meet the minimum authorization requirement
    return {
      err: {
        name: "authentication",
        message: "No Authorized Access"
      }
    };
  }
};

/** ==================================================================================
 * @name verifyToken()
 * @desc Verifying wether the given token is valid or not
 * @param token string : A token to verify
 * @return Object(an extracted data from the given token)
 ================================================================================== */
export const verifyToken = async token => {
  if (!token || token === "")
    throw new Error("ERROR: 1st parameter 'token' not specified!");

  const extractedData = await jwt.verify(token, SECRET_TOKEN_KEY);

  if (!extractedData) {
    throw new Error("ERROR: Token Invalid!");
  }

  return extractedData;
};

/** ==================================================================================
 * @name generateToken()
 * @desc Generate accessToken or refreshToken depending on the parameter
 * @param payload object : Object contains data which will be storing in the Token
 * @param type string : Specify wether to generate accessToken
 *     or refreshToken. Possible values are 'accessToken' or 'refreshToken'
 * @return string : a generated token
 ================================================================================== */
export const generateToken = async (payload, type) => {
  let token = "";

  if (!payload || payload == null)
    throw new Error("ERROR: 1st parameter 'payload' not specified!");

  if (!type || type === "")
    throw new Error("ERROR: 2nd parameter 'type' not specified!");

  if (type === "accessToken") {
    token = await jwt.sign(payload, SECRET_TOKEN_KEY, {
      expiresIn: 60 * 10 // Last for 10 minutes
    });
  } else if (type === "refreshToken") {
    token = await jwt.sign(payload, SECRET_TOKEN_KEY); // This token will last forever
  }

  return token;
};

/** ==================================================================================
 * @name generateNewTokensIfExpired()
 * @desc Generate new both access/refresh tokens of old accessToken is expired
 * @param payload object : a payload from old refreshToken
 * @return Object (contains new refresh/access tokens)
 ================================================================================== */
export const generateNewTokensIfExpired = async payload => {
  if (!payload || payload == null)
    throw new Error("ERROR: 1st parameter 'refreshToken' not specified!");

  const newRefreshToken = await generateToken(payload, "refreshToken");
  const newAccessToken = await generateToken(payload, "accessToken");

  return { newRefreshToken, newAccessToken };
};
