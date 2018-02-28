import { isEmpty, trim, isMongoId } from 'validator'

import { requiredAuthentication } from '../../..//helpers/security-helpers'

/** ==================================================================================
 * @name userProfile()
 * @type resolver
 * @desc Query information about a specific user corresponding to a given ID
 * @param parent : default parameter from ApolloServer
 * @param { _id } [GRAPHQL_ARGS] : User ID(from MongoDB ObjectID)
 * @param { user } [GRAPHQL_CONTEXT] : Current authenticated user
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @return Object : GraphQL UserProfileResponse Type
 ================================================================================== */
export default async (_, { _id }, { models, user }) => {
  try {
    // Authentication : user must be logged-in
    await requiredAuthentication(user)

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
    const user = await models.User.findOne(
      { _id },
      '_id email fname lname career address username profilePicture'
    )

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
      user,
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
