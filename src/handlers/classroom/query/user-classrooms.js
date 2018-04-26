import { isEmpty, trim, isMongoId } from 'validator'

import { requiredAuthentication } from '../../../helpers/security-helpers'
import { displayErrMessageWhenDev } from '../../../helpers/error-helpers'

const formatGraphQLErrorMessage = message => ({
  classrooms: [],
  err: {
    name: 'userClassroom',
    message
  }
})

/** ==================================================================================
 * @name userClassrooms()
 * @type resolver
 * @desc Send the classrooms corresponding to a given user
 * @param parent : default parameter from ApolloServer
 * @param { _id } [GRAPHQL_ARGS] : User ID
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @return Object : GraphQL UserClassroomsResponse Type
 ================================================================================== */
export default async (_, { _id }, { models }) => {
  try {
    // ---------------------------------------------------------------------
    // Authentication
    // ---------------------------------------------------------------------
    // Use must be logged-in
    const isLogin = await requiredAuthentication(user)
    if (!isLogin) return formatGraphQLErrorMessage('Authentication Required')

    // ---------------------------------------------------------------------
    // Input Validation
    // ---------------------------------------------------------------------
    if (isEmpty(trim(_id)) || !isMongoId(_id))
      return formatGraphQLErrorMessage('User ID invalid or not specified')

    // ---------------------------------------------------------------------
    // Quering a classroom
    // ---------------------------------------------------------------------
    const classrooms = await models.ClassroomMember.find({ member: _id })
      .populate('classroom')
      .lean()

    return {
      classrooms: classrooms.map(c => c.classroom),
      err: null
    }
  } catch (err) {
    displayErrMessageWhenDev(err)
    return formatGraphQLErrorMessage('Server Error')
  }
}
