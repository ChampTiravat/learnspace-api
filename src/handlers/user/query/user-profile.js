import { isEmpty, trim, isMongoId } from 'validator'

import { requiredAuthentication } from '../../..//helpers/security-helpers'
import { displayErrMessageWhenDev } from '../../../helpers/error-helpers'

const formatGraphQLErrorMessage = message => ({
  user: null,
  err: {
    name: 'user',
    message
  }
})

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
    // ---------------------------------------------------------------------
    // Authentication
    // ---------------------------------------------------------------------
    const isLogin = await requiredAuthentication(user)
    if (!isLogin) return formatGraphQLErrorMessage('Authentication Required')

    // ---------------------------------------------------------------------
    // Input Validation
    // ---------------------------------------------------------------------
    if (isEmpty(trim(_id)) || !isMongoId(_id))
      return formatGraphQLErrorMessage('User ID invalid or not specified')

    // ---------------------------------------------------------------------
    // If user does not exists
    // ---------------------------------------------------------------------
    const user = await models.User.findOne(
      { _id },
      '_id email fname lname career address username profilePicture'
    ).lean()

    if (!user) return formatGraphQLErrorMessage('User not found')

    // ---------------------------------------------------------------------
    // Return appropriete GraphQL response
    // ---------------------------------------------------------------------
    return {
      user,
      err: null
    }
  } catch (err) {
    displayErrMessageWhenDev(err)
    return formatGraphQLErrorMessage('Server Error')
  }
}
