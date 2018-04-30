import { isEmpty, trim, isMongoId } from 'validator'

import { requiredAuthentication, requiredClassroomMember } from '../../../helpers/security-helpers'
import { displayErrMessageWhenDev } from '../../../helpers/error-helpers'

const formatGraphQLErrorMessage = message => ({
  posts: null,
  err: {
    name: 'classroomsPosts',
    message
  }
})

/** ==================================================================================
 * @name classroomPosts()
 * @type resolver
 * @desc Return a list of post corresponding to a given classroom ID
 * @param parent : default parameter from ApolloServer
 * @param { _id } [GRAPHQL_ARGS] : Classroom ID
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @return Object : GraphQL ClassroomPostsResponse Type
 ================================================================================== */
export default async (_, { _id }, { models }) => {
  try {
    // ---------------------------------------------------------------------
    // Authentication
    // ---------------------------------------------------------------------
    // Make sure user has authorized access
    const isLogin = await requiredAuthentication(user)
    if (!isLogin) return formatGraphQLErrorMessage('Authentication Required')

    // ---------------------------------------------------------------------
    // Checking the current user is classroom member
    // ---------------------------------------------------------------------
    const isClassroomMember = await requiredClassroomAdmin(user, _id)
    if (!isClassroomMember) return formatGraphQLErrorMessage('Unauthorized Access')

    // ---------------------------------------------------------------------
    // Input Validation
    // ---------------------------------------------------------------------
    if (isEmpty(trim(_id)) || !isMongoId(_id))
      return formatGraphQLErrorMessage('Classroom ID is invalid')

    // ---------------------------------------------------------------------
    // Check classroom must be exists!
    // ---------------------------------------------------------------------
    const classroom = await models.Classroom.findOne({ _id }).lean()
    if (!classroom) return formatGraphQLErrorMessage('A given classroom does not exists')

    // ---------------------------------------------------------------------
    // Querying all post in the classroom
    // ---------------------------------------------------------------------
    const posts = await models.Post.find({ classroom: _id }).lean()

    // ---------------------------------------------------------------------
    // Return appropriete GraphQL response
    // ---------------------------------------------------------------------
    return {
      posts,
      err: null
    }
  } catch (err) {
    displayErrMessageWhenDev(err)
    return formatGraphQLErrorMessage('Server Error')
  }
}
