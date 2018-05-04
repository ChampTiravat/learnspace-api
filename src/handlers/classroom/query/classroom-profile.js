import { isEmpty, trim, isMongoId } from 'validator'

import { requiredAuthentication, requiredClassroomMember } from '../../../helpers/security-helpers'
import { displayErrMessageWhenDev } from '../../../helpers/error-helpers'

const formatGraphQLErrorMessage = message => ({
  isMember: false,
  didJoinReqSent: false,
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
    // ---------------------------------------------------------------------
    // Input Validation
    // ---------------------------------------------------------------------
    if (isEmpty(trim(_id)) || !isMongoId(_id))
      return formatGraphQLErrorMessage('Classroom ID invalid or not specified')

    // ---------------------------------------------------------------------
    // Authentication
    // ---------------------------------------------------------------------
    // Use must be logged-in
    const isLogin = await requiredAuthentication(user)
    if (!isLogin) return formatGraphQLErrorMessage('Authentication Required')

    // ---------------------------------------------------------------------
    // Check if user is a member of a given classroom or not
    // ---------------------------------------------------------------------
    const isClassroomMember = await requiredClassroomMember(user, _id)

    // ---------------------------------------------------------------------
    // If user is NOT a member of a given classroom
    // ---------------------------------------------------------------------
    if (!isClassroomMember) {
      // ---------------------------------------------------------------------
      // Query a given classroom for a preview. Because the user is
      // not a member of the classroom. So, we will only show a brief info
      // about the classroom
      // ---------------------------------------------------------------------
      const classroom = await models.Classroom.findOne(
        { _id },
        'name creator subject thumbnail description'
      ).lean()

      // ---------------------------------------------------------------------
      // If a given classroom does not exist
      // ---------------------------------------------------------------------
      if (!classroom) return formatGraphQLErrorMessage('Classroom not found')

      // ---------------------------------------------------------------------
      // Query the creator of a given classroom
      // ---------------------------------------------------------------------
      const classroomCreator = await models.User.findOne(
        { _id: classroom.creator },
        'fname lname'
      ).lean()

      // ---------------------------------------------------------------------
      // Check if the user already sent a join-request to the given classroom
      // ---------------------------------------------------------------------
      const classroomJoinReqFromUser = await models.ClassroomJoinRequest.findOne(
        {
          classroom: classroom._id,
          candidate: String(user._id),
          status: 'waiting'
        },
        'candidate'
      ).lean()

      // ---------------------------------------------------------------------
      // Return GraphQL response with a limit of the classroom information
      // ---------------------------------------------------------------------
      return {
        isMember: false,
        didJoinReqSent: !!classroomJoinReqFromUser,
        classroom: {
          _id: classroom._id,
          name: classroom.name,
          creator: classroomCreator,
          subject: classroom.subject,
          thumbnail: classroom.thumbnail,
          description: classroom.description
        },
        err: {
          name: 'classroom',
          message: 'Permission Denied'
        }
      }
    }

    // ---------------------------------------------------------------------
    // Quering a classroom
    // ---------------------------------------------------------------------
    const classroom = await models.Classroom.findOne({ _id }).lean()

    // ---------------------------------------------------------------------
    // Quering members of a given classroom
    // ---------------------------------------------------------------------
    const classroomMembers = await models.ClassroomMember.find({
      member: user._id,
      classroom: _id
    }).lean()

    // ---------------------------------------------------------------------
    // Quering a creator of the classroom
    // ---------------------------------------------------------------------
    const classroomCreator = await models.User.findOne({
      _id: classroom.creator
    }).lean()

    // ---------------------------------------------------------------------
    // Querying posts related to a given classroom
    // ---------------------------------------------------------------------
    const classroomPosts = await models.Post.find({
      classroom: classroom._id
    }).lean()

    // ---------------------------------------------------------------------
    // In case a given classroom does not found
    // ---------------------------------------------------------------------
    if (!classroom) return formatGraphQLErrorMessage('Classroom not found')

    // ---------------------------------------------------------------------
    // In case a classroom creator of a given classroom does not found
    // ---------------------------------------------------------------------
    if (!classroomCreator) return formatGraphQLErrorMessage('Classroom creator not found not found')

    // ---------------------------------------------------------------------
    // Check if the user already sent a join-request to the given classroom
    // ---------------------------------------------------------------------
    const classroomJoinReqFromUser = await models.ClassroomJoinRequest.findOne(
      {
        classroom: classroom._id,
        candidate: String(user._id),
        status: 'waiting'
      },
      'candidate'
    ).lean()

    // ---------------------------------------------------------------------
    // Return appropriete GraphQL response
    // ---------------------------------------------------------------------
    return {
      isMember: true,
      didJoinReqSent: !!classroomJoinReqFromUser,
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
