import { isEmpty, trim, isMongoId } from 'validator'

import { requiredAuthentication, requiredClassroomMember } from '../../../helpers/security-helpers'
import { displayErrMessageWhenDev } from '../../../helpers/error-helpers'

const formatGraphQLErrorMessage = message => ({
  success: false,
  err: {
    name: 'sendClassroomJoinRequest',
    message
  }
})

/** ==================================================================================
 * @name sendClassroomJoinRequest()
 * @type resolver
 * @desc Send a classroom join-request to a specific classroom
 * @param parent : default parameter from ApolloServer
 * @param { classroomID } [GRAPHQL_ARGS] : Classroom ID which user would like to send a join request to.
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @param { user } [GRAPHQL_CONTEXT] : Current logged-in user(used as a classroom creator)
 * @return Object : GraphQL InviteUserResponse Type
 ================================================================================== */
export default async (_, { classroomID }, { models, user }) => {
  try {
    // ---------------------------------------------------------------------
    // Authentication
    // ---------------------------------------------------------------------
    // Make sure user has authorized access
    const isLogin = await requiredAuthentication(user)
    if (!isLogin) return formatGraphQLErrorMessage('Authentication Required')

    // User must NOT already being a classroom administrator
    const isClassroomMember = await requiredClassroomMember(user, classroomID)
    if (isClassroomMember)
      return formatGraphQLErrorMessage(
        'Candidate user must not already being a member of a given classroom'
      )

    // ---------------------------------------------------------------------
    // Inputs Validation
    // ---------------------------------------------------------------------
    // Classroom ID must be MongoDB ID value
    if (isEmpty(trim(classroomID)) || !isMongoId(classroomID))
      return formatGraphQLErrorMessage('Classroom ID invalid or not specified')

    // ---------------------------------------------------------------------
    // A given classroom must be exists
    // ---------------------------------------------------------------------
    const givenClassroom = await models.Classroom.findOne(
      {
        _id: classroomID
      },
      '_id'
    ).lean()

    if (!givenClassroom) return formatGraphQLErrorMessage('A target classroom must be specified')

    // ---------------------------------------------------------------------
    // Do not send a request to a classroom that already recieved a request from a user
    // ---------------------------------------------------------------------
    const isAlreadySentToGivenClassroom = await models.ClassroomJoinRequest.findOne({
      classroom: classroomID
    })

    if (isAlreadySentToGivenClassroom) {
      return formatGraphQLErrorMessage(
        'The request from the user has been sent to the given classroom'
      )
    }

    // ---------------------------------------------------------------------
    // Add join request to a specific classroom
    // ---------------------------------------------------------------------
    await models.ClassroomJoinRequest.create({
      candidate: String(user._id),
      classroom: classroomID
    })

    // ---------------------------------------------------------------------
    // Send a notification to candidate user(if everything went ok)
    // ---------------------------------------------------------------------

    // ---------------------------------------------------------------------
    // Return appropriete GraphQL response
    // ---------------------------------------------------------------------
    return { success: true, err: null }
  } catch (err) {
    displayErrMessageWhenDev(err)
    return formatGraphQLErrorMessage('Server Error')
  }
}
