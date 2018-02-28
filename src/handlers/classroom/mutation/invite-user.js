import { isEmpty, trim, isMongoId } from 'validator'

import {
  requiredAuthentication,
  mustBeClassroomCreator
} from '../../../helpers/security-helpers'

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
    // Make sure user has authorized access
    await requiredAuthentication(user)
    await mustBeClassroomCreator(user, classroomID)

    // Validate inputs
    if (isEmpty(trim(candidateID)) || !isMongoId(candidateID)) {
      return {
        success: false,
        err: {
          name: 'inviteUser',
          message: 'Candidate ID invalid or not specified'
        }
      }
    }

    if (isEmpty(trim(classroomID)) || !isMongoId(classroomID)) {
      return {
        success: false,
        err: {
          name: 'inviteUser',
          message: 'Classroom ID invalid or not specified'
        }
      }
    }

    // Make sure a given classroom does exists
    const targetClassroom = await models.Classroom.findOne({
      _id: classroomID
    })
    if (!classroom) {
      return {
        success: false,
        err: {
          name: 'inviteUser',
          message: 'A given classroom does not exists'
        }
      }
    }

    // Make sure a candidate user does exists
    const candidate = await models.User.findOne({ _id: candidateID })
    if (!candidate) {
      return {
        success: false,
        err: {
          name: 'inviteUser',
          message: 'A given candidate does not exists'
        }
      }
    }

    // Candidate must not already being a member of a target classroom
    const memberWithSameCred = await targetClassroom.members.find(member =>
      equals(member._id, candidateID)
    )
    if (memberWithSameCred) {
      if (!memberWithSameCred) {
        return {
          success: false,
          err: {
            name: 'inviteUser',
            message:
              'A given candidate is already a member of a given classroom'
          }
        }
      }
    }

    // Do not send an invitation if it's already been sent
    const invitationWithSameCred = await models.ClassroomInvitation.findOne({
      candidate: candidateID,
      classroom: classroomID
    })
    if (invitationWithSameCred) {
      return {
        success: false,
        err: {
          name: 'inviteUser',
          message: 'A given candidate already recieve an invitation'
        }
      }
    }

    // Insert Invitation into ClassroomInvitations Collections(in MongoDB)
    await models.ClassroomInvitation.create({
      candidate: candidateID,
      classroom: classroomID
    })

    // Send a notification to candidate user(if everything went ok)

    // Return appropriete GraphQL response
    return {
      success: true,
      err: null
    }
  } catch (err) {
    return {
      success: false,
      err: {
        name: 'inviteUser',
        message: 'Server Error'
      }
    }
  }
}
