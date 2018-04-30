import { isEmpty, trim, isMongoId } from 'validator'

import { requiredAuthentication, requiredClassroomMember } from '../../../helpers/security-helpers'
import { displayErrMessageWhenDev } from '../../../helpers/error-helpers'

const formatGraphQLErrorMessage = message => ({
  post: null,
  err: {
    name: 'getPost',
    message
  }
})

/** ==================================================================================
 * @name getPost()
 * @type resolver
 * @desc Return a post corresponding to a given post ID
 * @param parent : default parameter from ApolloServer
 * @param { _id } [GRAPHQL_ARGS] : post ID
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @return Object : GraphQL GetPostResponse Type
 ================================================================================== */
export default async (_, { _id }, { models, user }) => {
  try {
    // ---------------------------------------------------------------------
    // Input Validation
    // ---------------------------------------------------------------------
    if (isEmpty(trim(_id)) || !isMongoId(_id))
      return formatGraphQLErrorMessage('post ID is invalid')

    // ---------------------------------------------------------------------
    // Authentication
    // ---------------------------------------------------------------------
    // Make sure user has authorized access
    const isLogin = await requiredAuthentication(user)
    if (!isLogin) return formatGraphQLErrorMessage('Authentication Required')

    // ---------------------------------------------------------------------
    // If the post does not exist
    // ---------------------------------------------------------------------
    const post = await models.Post.findOne({ _id }).lean()
    if (!post) return formatGraphQLErrorMessage('The post does not exist')

    // ---------------------------------------------------------------------
    // Checking the current user is classroom member
    // ---------------------------------------------------------------------
    const isClassroomMember = await requiredClassroomMember(user, String(post.classroom))
    if (!isClassroomMember) return formatGraphQLErrorMessage('Unauthorized Access')

    // ---------------------------------------------------------------------
    // Return appropriete GraphQL response
    // ---------------------------------------------------------------------
    return {
      post,
      err: null
    }
  } catch (err) {
    displayErrMessageWhenDev(err)
    return formatGraphQLErrorMessage('Server Error')
  }
}
