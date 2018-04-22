import { isEmpty, trim, equals, isMongoId } from 'validator'

import { requiredAuthentication } from '../../../helpers/security-helpers'
import { displayErrMessageWhenDev } from '../../../helpers/error-helpers'

const formatGraphQLErrorMessage = message => ({
  success: false,
  err: {
    name: 'respondToClassroomInvitation',
    message
  }
})

/** ==================================================================================
 * @name respondToClassroomInvitation()
 * @type resolver
 * @desc Respond to a received classroom invitation
 * @param parent : default parameter from ApolloServer
 * @param { classroomID } [GRAPHQL_ARGS] : ID of a specific classroom, which holds sent the invitation to the current user
 * @param { answer } [GRAPHQL_ARGS] : Answer to a given classroom invitation. Possible values are ["accept", "refuse"]
 * @param { user } [GRAPHQL_CONTEXT] : Current logged-in user(used as a classroom creator)
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @return GraphQL respondToClassroomInvitationResponse Type
 ================================================================================== */
export default async (_, { classroomID, answer }, { user, models }) => {
  try {
    // 1 - Input Validation
    if (isEmpty(trim(classroomID)) || !isMongoId(classroomID))
      return formatGraphQLErrorMessage('Classroom ID invalid or not specified')

    if (isEmpty(trim(answer)))
      return formatGraphQLErrorMessage('Answer of a given invitation not specified')

    if (!equals(answer, 'accept') && !equals(answer, 'refuse'))
      return formatGraphQLErrorMessage('Answer of a given invitation invalid')

    // 2 - User must be authenticated
    if (!requiredAuthentication(user)) return formatGraphQLErrorMessage('Authentication Required')

    // 3 - User must received an invitation from a given classroom
    const targetClassroomInvitation = await models.ClassroomInvitation.findOne({
      classroom: classroomID,
      status: 'waiting'
    }).lean()

    // 3.1 - If FALSE : Return negative response
    if (!targetClassroomInvitation)
      return formatGraphQLErrorMessage('Classroom invitation of a given classroom does not exists')

    // 3.2 - If TRUE : Respond to the invitation according to user's "anser"
    if (equals(answer, 'accept')) {
      // 3.2.1 - Add the current user to the given classroom as a member
      await models.ClassroomMember.create({ member: String(user._id), classroom: classroomID })
    }

    // 3.2.2 - Update the classroom invitation status to "accepted" or "refused" According to user's "answer"
    await models.ClassroomInvitation.update(
      {
        classroom: classroomID
      },
      {
        status: equals(answer, 'accept') ? 'accepted' : 'refused'
      }
    )

    // 4 - Return an appropriate GraphQL response
    return {
      success: true,
      err: null
    }
  } catch (err) {
    displayErrMessageWhenDev(err)
    return formatGraphQLErrorMessage('Server Error')
  }
}
