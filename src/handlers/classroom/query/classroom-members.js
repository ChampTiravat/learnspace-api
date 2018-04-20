import { isEmpty, trim, isMongoId } from 'validator'

import { displayErrMessageWhenDev } from '../../../helpers/error-helpers'
import { requiredAuthentication, requireClassroomMember } from '../../../helpers/security-helpers'

const formatGraphQLErrorMessage = message => ({
  member: false,
  err: {
    name: 'classroomMembers',
    message
  }
})

/** ==================================================================================
 * @name classroomMembers()
 * @type resolver
 * @desc Send a list of members in a given classroom, specified by classroom ID
 * @param parent : default parameter from ApolloServer
 * @param { clasroomID } [GRAPHQL_ARGS] : Classroom ID
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @param { user } [GRAPHQL_CONTEXT] : Current logged-in user(used as a classroom creator)
 * @return Object : GraphQL ClassroomProfileResoonse Type
 ================================================================================== */
export default async (_, { classroomID }, { models, user }) => {
  try {
    // Input Validation
    if (isEmpty(trim(classroomID)) || !isMongoId(classroomID))
      return formatGraphQLErrorMessage('Classroom ID invalid or not specified')

    // Use must be logged-in
    if (!requiredAuthentication(user)) return formatGraphQLErrorMessage('Authentication Required')

    // Check if user is a member of a given classroom or not
    const isClassroomMember = await requireClassroomMember(user, classroomID)

    // If user is NOT a member of a given classroom
    if (!isClassroomMember) return formatGraphQLErrorMessage('Permission Denied')

    // Quering a classroom
    const classroom = await models.Classroom.findOne({ _id: classroomID }, '_id').lean()

    // in case a given classroom does not found
    if (!classroom) return formatGraphQLErrorMessage('Classroom not found')

    // Quering members of a given classroom
    const classroomMembers = await models.ClassroomMember.find(
      {
        classroom: classroomID
      },
      'member'
    )
      .populate('member')
      .lean()

    // Return appropriete GraphQL response
    return {
      members: classroomMembers.map(classroomMember => classroomMember.member),
      err: null
    }
  } catch (err) {
    displayErrMessageWhenDev(err)
    return formatGraphQLErrorMessage('Server Error')
  }
}
