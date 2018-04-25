import { isEmpty, trim, isMongoId, isEmail, isAlphanumeric } from 'validator'

import { displayErrMessageWhenDev } from '../../../helpers/error-helpers'
import { requiredAuthentication, requiredClassroomAdmin } from '../../../helpers/security-helpers'

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
 * @param { candidateIdent } [GRAPHQL_ARGS] : Self-Identification(Email or Username)
 *             of the candidate(target user who recieve an invitation)
 * @param { classroomID } [GRAPHQL_ARGS] : Classroom ID
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @param { user } [GRAPHQL_CONTEXT] : Current logged-in user(used as a classroom creator)
 * @return Object : GraphQL InviteUserResponse Type
 ================================================================================== */
export default async (_, { candidateIdent, classroomID }, { models, user }) => {
  try {
    // =========================================================
    // Authentication
    // =========================================================
    // Make sure user has authorized access
    if (!requiredAuthentication(user)) return formatGraphQLErrorMessage('Authentication Required')

    // User must be a classroom administrator
    if (!requiredClassroomAdmin(user, classroomID, models.ClassroomMember))
      return formatGraphQLErrorMessage('Permission Denied')

    // =========================================================
    // Inputs Validation
    // =========================================================
    if (isEmpty(trim(candidateIdent)))
      return formatGraphQLErrorMessage('Candidate Identification is not specified')

    // User Identification must contains only Alpha & Numeric or Email format
    if (!isEmail(candidateIdent) && !isAlphanumeric(candidateIdent))
      return formatGraphQLErrorMessage('Candidate Identification invalid')

    // Classroom ID must be MongoDB index value
    if (isEmpty(trim(classroomID)) || !isMongoId(classroomID))
      return formatGraphQLErrorMessage('Classroom Identification invalid or not specified')

    // =========================================================
    // Make sure a candidate user does exists
    // =========================================================
    // Find the user candidate using his/her email or username,
    // depending on what's being given
    const candidate = await models.User.findOne({
      $or: [{ username: candidateIdent }, { email: candidateIdent }]
    }).lean()

    // If user does not exists
    if (!candidate) return formatGraphQLErrorMessage('A given candidate does not exists')

    // =========================================================
    // Make sure a given classroom does exists
    // =========================================================
    const targetClassroom = await models.Classroom.findOne({
      _id: classroomID
    }).lean()

    if (!targetClassroom) return formatGraphQLErrorMessage('A given classroom does not exists')

    // =========================================================
    // Candidate must not already being a member of a target classroom
    // =========================================================
    const memberWithSameCred = await models.ClassroomMember.findOne({
      classroom: classroomID,
      member: candidate._id
    }).lean()

    if (memberWithSameCred)
      return formatGraphQLErrorMessage('A given candidate is already a member of a given classroom')

    // =========================================================
    // Do not send an invitation if it's already been sent
    // =========================================================
    const invitationWithSameCred = await models.ClassroomInvitation.findOne({
      candidate: candidate._id,
      classroom: classroomID
    }).lean()

    // Abort! if the invitation is already been sent
    if (invitationWithSameCred)
      return formatGraphQLErrorMessage('A given candidate already recieve an invitation')

    // =========================================================
    // Insert Invitation into ClassroomInvitations Collections(in MongoDB)
    // =========================================================
    // Everything is alright. Send an invitation to the candidate
    await models.ClassroomInvitation.create({
      candidate: candidate._id,
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
