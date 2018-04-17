import { isEmpty, trim, isMongoId } from 'validator'

import { requiredAuthentication } from '../../..//helpers/security-helpers'
import { displayErrMessageWhenDev } from '../../../helpers/error-helpers'

const formatGraphQLErrorMessage = message => ({
  invitations: [],
  err: {
    name: 'userClassroomInvitations',
    message
  }
})

/** ==================================================================================
 * @name userClassroomInvitations()
 * @type resolver
 * @desc Gather a list of the classroom invitations of a particular user
 * @param parent : default parameter from ApolloServer
 * @param { _id } [GRAPHQL_ARGS] : User ID(from MongoDB ObjectID)
 * @param { user } [GRAPHQL_CONTEXT] : Current authenticated user
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @return Object : GraphQL UserClassroomInvitationsResponse Type
 ================================================================================== */
export default async (_, { _id }, { models, user }) => {
  try {
    // =========================================================
    // Authentication
    // =========================================================
    // Make sure user has authorized access
    if (!requiredAuthentication(user))
      return formatGraphQLErrorMessage('Authentication Required')

    // =========================================================
    // Input Validation
    // =========================================================
    if (isEmpty(trim(_id)) || !isMongoId(_id))
      return formatGraphQLErrorMessage('User ID invalid or not specified')

    // =========================================================
    // Make sure a given user account does exists
    // =========================================================
    const givenCandidate = await models.User.findOne({ _id }).lean()
    if (!givenCandidate) return formatGraphQLErrorMessage('User not found')

    // =========================================================
    // Querying Classroom Invitations of the user
    // =========================================================
    const rawInvitations = await models.ClassroomInvitation.find(
      {
        candidate: givenCandidate._id
      },
      'classroom createdAt'
    ).lean()

    // =========================================================
    // Querying the name of each Classroom
    // =========================================================
    const cNames = await models.Classroom.find(
      {
        _id: { $in: [...rawInvitations.map(invt => invt.classroom)] }
      },
      '_id name'
    ).lean()

    // =========================================================
    // GraphQL type and MongoDB collection which represent "Classroom Invitation"
    // have a different attribute names. So, we have to loop through each attrib of
    // MongoDB collections and then, map them to the corresponding attribs in GraphQL Types
    // =========================================================
    const invitations = await rawInvitations.reduce((totalInvt, nextInvt) => {
      const mutatedInvt = {
        classroomId: nextInvt.classroom,
        issueDate: nextInvt.createdAt,
        // We have to find the "name" of the classroom by looking for the classroom
        // that has the same "_id". Then, we just pull-off only the "name" attrib
        // of that classroom object that we found
        classroomName: cNames.find(n => String(n._id) === String(nextInvt.classroom)).name
      }

      return totalInvt.concat(mutatedInvt)
    }, [])

    // =========================================================
    // Return appropriete GraphQL response
    // =========================================================
    return {
      invitations,
      err: null
    }
  } catch (err) {
    displayErrMessageWhenDev(err)
    return formatGraphQLErrorMessage('Server Error')
  }
}
