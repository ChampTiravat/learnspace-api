import { isEmpty, trim, isMongoId } from 'validator'

import { displayErrMessageWhenDev } from '../../../helpers/error-helpers'
import {
  requiredAuthentication,
  requiredClassroomAdmin
} from '../../../helpers/security-helpers'

const formatGraphQLErrorMessage = message => ({
  success: false,
  err: {
    name: 'inviteUser',
    message
  }
})

/** ==================================================================================
 * @name inviteUser()
 * @type resolver
 * @desc Send a classroom invitation to a given user
 * @param parent : default parameter from ApolloServer
 * @param { candidateID } [GRAPHQL_ARGS] : ID if the candidate(target user who recieve an invitation)
 * @param { classroomID } [GRAPHQL_ARGS] : Classroom ID
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @param { user } [GRAPHQL_CONTEXT] : Current logged-in user(used as a classroom creator)
 * @return Object : GraphQL CraeteClassroomResponse Type
 ================================================================================== */
export default async (_, { candidateID, classroomID }, { models, user }) => {
  try {
    // =========================================================
    // Authentication
    // =========================================================
    // Make sure user has authorized access
    if (requiredAuthentication(user))
      return formatGraphQLErrorMessage('Authentication Required')

    // User must be a classroom administrator
    if (requiredClassroomAdmin(user, classroomID, models.ClassroomMember))
      return formatGraphQLErrorMessage('Permission Denied')

    // =========================================================
    // Inputs Validation
    // =========================================================
    if (isEmpty(trim(candidateID)) || !isMongoId(candidateID))
      return formatGraphQLErrorMessage('Candidate ID invalid or not specified')

    if (isEmpty(trim(classroomID)) || !isMongoId(classroomID))
      return formatGraphQLErrorMessage('Classroom ID invalid or not specified')

    // =========================================================
    // Make sure a given classroom does exists
    // =========================================================
    const targetClassroom = await models.Classroom.findOne({
      _id: classroomID
    })

    if (!targetClassroom)
      return formatGraphQLErrorMessage('A given classroom does not exists')

    // =========================================================
    // Make sure a candidate user does exists
    // =========================================================
    const candidate = await models.User.findOne({ _id: candidateID })

    if (!candidate)
      return formatGraphQLErrorMessage('A given candidate does not exists')

    // =========================================================
    // Candidate must not already being a member of a target classroom
    // =========================================================
    const memberWithSameCred = await models.ClassroomMember.findOne({
      classroom: classroomID,
      member: candidateID
    })

    if (memberWithSameCred)
      return formatGraphQLErrorMessage(
        'A given candidate is already a member of a given classroom'
      )

    // =========================================================
    // Do not send an invitation if it's already been sent
    // =========================================================
    const invitationWithSameCred = await models.ClassroomInvitation.findOne({
      candidate: candidateID,
      classroom: classroomID
    })

    if (invitationWithSameCred)
      return formatGraphQLErrorMessage(
        'A given candidate already recieve an invitation'
      )

    // =========================================================
    // Insert Invitation into ClassroomInvitations Collections(in MongoDB)
    // =========================================================
    await models.ClassroomInvitation.create({
      candidate: candidateID,
      classroom: classroomID
    })

    // =========================================================
    // Send a notification to candidate user(if everything went ok)
    // =========================================================

    // =========================================================
    // Return appropriete GraphQL response
    // =========================================================
    return {
      err: null,
      success: true
    }
  } catch (err) {
    displayErrMessageWhenDev(err)
    return formatGraphQLErrorMessage('Server Error')
  }
}
