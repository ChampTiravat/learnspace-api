import { isEmpty, trim, isMongoId } from 'validator'

import { displayErrMessageWhenDev } from '../../../helpers/error-helpers'
import {
  requiredAuthentication,
  requireClassroomMember
} from '../../../helpers/security-helpers'

const formatGraphQLErrorMessage = message => ({
  classroom: null,
  err: {
    name: 'classroom',
    message
  }
})

/** ==================================================================================
 * @name classroomProfile()
 * @type resolver
 * @desc Send classroom information corresponding to a given Classroom ID
 * @param parent : default parameter from ApolloServer
 * @param { _id } [GRAPHQL_ARGS] : Classroom ID
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @param { user } [GRAPHQL_CONTEXT] : Current logged-in user(used as a classroom creator)
 * @return Object : GraphQL ClassroomProfileResoonse Type
 ================================================================================== */
export default async (_, { _id }, { models, user }) => {
  try {
    // =========================================================
    // Authentication
    // =========================================================
    // Use must be logged-in
    if (!requiredAuthentication(user))
      return formatGraphQLErrorMessage('Authentication Required')

    // User must be a member of a given classroom
    if (!requireClassroomMember(user, _id))
      return formatGraphQLErrorMessage('Permission Denied')

    // =========================================================
    // Input Validation
    // =========================================================
    if (isEmpty(trim(_id)) || !isMongoId(_id))
      return formatGraphQLErrorMessage('Classroom ID invalid or not specified')

    // =========================================================
    // Quering a classroom
    // =========================================================
    const classroom = await models.Classroom.findOne({ _id }).lean()

    // =========================================================
    // Quering members of a given classroom
    // =========================================================
    const classroomMembers = await models.ClassroomMember.find({
      member: user._id,
      classroom: _id
    }).lean()

    // =========================================================
    // Quering a creator of the classroom
    // =========================================================
    const classroomCreator = await models.User.findOne({
      _id: classroom.creator
    }).lean()

    // =========================================================
    // Querying posts related to a given classroom
    // =========================================================
    const classroomPosts = await models.Post.find({
      classroom: classroom._id
    }).lean()

    // =========================================================
    // in case a given classroom does not found
    // =========================================================
    if (!classroom) return formatGraphQLErrorMessage('Classroom not found')

    // =========================================================
    // in case a classroom creator of a given classroom does not found
    // =========================================================
    if (!classroomCreator)
      return formatGraphQLErrorMessage('Classroom creator not found not found')

    // =========================================================
    // Return appropriete GraphQL response
    // =========================================================
    return {
      classroom: {
        _id: classroom._id,
        name: classroom.name,
        description: classroom.description,
        subject: classroom.subject,
        thumbnail: classroom.thumbnail,
        creator: classroomCreator,
        members: classroomMembers,
        outline: [
          { title: 'Explain course outline', passed: true },
          { title: 'Calculus and Analytic Geometry', passed: true },
          { title: 'Getting started with Python programming', passed: true },
          { title: 'Data Structures and Algorithms', passed: false },
          { title: 'Final Project', passed: false },
          { title: 'Examination', passed: false }
        ],
        posts: classroomPosts
      },
      err: null
    }
  } catch (err) {
    displayErrMessageWhenDev(err)
    return formatGraphQLErrorMessage('Server Error')
  }
}
