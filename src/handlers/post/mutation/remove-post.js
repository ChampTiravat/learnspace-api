import { isEmpty, trim, isMongoId, equals } from 'validator'

import { requiredAuthentication, requiredClassroomAdmin } from '../../../helpers/security-helpers'
import { displayErrMessageWhenDev } from '../../../helpers/error-helpers'

const formatGraphQLErrorMessage = message => ({
  success: false,
  err: {
    name: 'removePost',
    message
  }
})

/** ==================================================================================
 * @name removePost()
 * @type resolver
 * @desc Remove an existing post
 * @param parent : default parameter from ApolloServer
 * @param { postID } [GRAPHQL_ARGS] : Post ID which about to be removed
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @param { user } [GRAPHQL_CONTEXT] : Currnet logged-in user(extracted from JWT token)
 * @return Object : GraphQL RemovePostResponse Type
 ================================================================================== */
export default async (_, { postID }, { models, user }) => {
  try {
    // ---------------------------------------------------------------------
    // Authentication
    // ---------------------------------------------------------------------
    // Make sure user has authorized access
    const isLogin = await requiredAuthentication(user)
    if (!isLogin) return formatGraphQLErrorMessage('Authentication Required')

    // ---------------------------------------------------------------------
    // Checking the current user is classroom supervisor(creator)
    // ---------------------------------------------------------------------
    const isClassroomAdmin = await requiredClassroomAdmin(user, classroomID, models.ClassroomMember)
    if (!isClassroomAdmin) return formatGraphQLErrorMessage('Unauthorized Access')

    // ---------------------------------------------------------------------
    // Input Validation
    // ---------------------------------------------------------------------
    if (isEmpty(trim(postID)) || !isMongoId(postID))
      return formatGraphQLErrorMessage('post ID is empty or invalid')

    // ---------------------------------------------------------------------
    // Making sure a given post does exist
    // ---------------------------------------------------------------------
    const postToRemove = await models.Post.findOne({ _id: postID }).lean()
    if (!postToRemove) return formatGraphQLErrorMessage('A post with the given ID does not exist')

    // ---------------------------------------------------------------------
    // Remove the post
    // ---------------------------------------------------------------------
    await models.Post.remove({ _id: postID })

    // ---------------------------------------------------------------------
    // return appropriete graphql response
    // ---------------------------------------------------------------------
    return {
      success: true,
      err: null
    }
  } catch (err) {
    displayErrMessageWhenDev(err)
    return formatGraphQLErrorMessage('Server Error')
  }
}
