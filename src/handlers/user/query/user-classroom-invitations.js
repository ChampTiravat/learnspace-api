import { equals, isEmpty, trim, isMongoId } from 'validator'

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
    if (!requiredAuthentication(user)) return formatGraphQLErrorMessage('Authentication Required')

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
        candidate: givenCandidate._id,
        status: 'waiting'
      },
      'classroom createdAt'
    ).lean()

    // =========================================================
    // Querying the name of each Classroom
    // =========================================================
    const classroomsInfo = await models.Classroom.find(
      {
        _id: { $in: [...rawInvitations.map(invt => invt.classroom)] }
      },
      '_id name thumbnail'
    ).lean()

    // =========================================================
    // GraphQL type and MongoDB collection which represent "Classroom Invitation"
    // have a different attribute names. So, we have to loop through each attrib of
    // MongoDB collections and then, map them to the corresponding attribs in GraphQL Types
    // =========================================================
    const invitations = await rawInvitations.reduce((totalInvt, nextInvt) => {
      // We have to find the "name" and "thumbnail" of the classroom by looking for the classroom
      // that has the same "_id". Then, we just pull-off only the "name" attrib
      // of that classroom object that we found
      const { thumbnail, name } = classroomsInfo.find(n =>
        equals(String(n._id), String(nextInvt.classroom))
      )

      // Create a classroom invitation object with the right property names,
      // matching with GraphQL ClassroomInvitation Type
      const mutatedInvt = {
        classroomID: nextInvt.classroom,
        issueDate: nextInvt.createdAt,
        thumbnail: thumbnail,
        classroomName: name
      }

      // Attach classroom invitation object above to the array of classroom invitations
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
