import { isEmpty, trim, isMongoId } from 'validator'

import { displayErrMessageWhenDev } from '../../../helpers/error-helpers'
import { ENG_THA_NUM_ALPHA } from '../../../constants/regex-patterns'

/** ==================================================================================
 * @name createClassroom()
 * @type resolver
 * @desc Create a new classroom with a given information
 * @param parent : default parameter from ApolloServer
 * @param { name } [GRAPHQL_ARGS] : classroom name
 * @param { subject } [GRAPHQL_ARGS] : classroom main subject
 * @param { description } [GRAPHQL_ARGS] : classroom description
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @param { user } [GRAPHQL_CONTEXT] : Current logged-in user(used as a classroom creator)
 * @return Object : GraphQL CraeteClassroomResponse Type
 ================================================================================== */
export default async (_, { name, description, subject }, { user, models }) => {
  try {
    // User must be authenticated
    if (isEmpty(trim(user._id)) || !isMongoId(user._id)) {
      return {
        success: false,
        classroomID: '',
        err: {
          name: 'createClassroom',
          message: 'Unauthorized Access'
        }
      }
    }

    // All GraphQL Mutation parameters are required
    if (
      isEmpty(trim(name)) ||
      isEmpty(trim(description)) ||
      isEmpty(trim(subject))
    ) {
      return {
        success: false,
        classroomID: '',
        err: {
          name: 'createClassroom',
          message: 'Important information should not be empty'
        }
      }
    }

    // Validation
    if (!ENG_THA_NUM_ALPHA.test(name))
      return {
        success: false,
        classroomID: '',
        err: {
          name: 'createClassroom',
          message: "'name' is invalid or not specified"
        }
      }

    if (!ENG_THA_NUM_ALPHA.test(description))
      return {
        success: false,
        classroomID: '',
        err: {
          name: 'createClassroom',
          message: "'description' is invalid or not specified"
        }
      }

    if (!ENG_THA_NUM_ALPHA.test(subject))
      return {
        success: false,
        classroomID: '',
        err: {
          name: 'createClassroom',
          message: "'subject' is invalid or not specified"
        }
      }

    // New Classroom Construction
    const newClassroom = await models.Classroom.create({
      name,
      subject,
      description,
      creator: user._id
    })

    // Add user(current user who created the classroom above)
    // as a member of the classroom
    await models.ClassroomMember.create({
      member: user._id,
      classroom: newClassroom._id,
      role: 'admin'
    })

    return {
      success: true,
      classroomID: newClassroom._id,
      err: null
    }
  } catch (err) {
    // Some Error Occured
    displayErrMessageWhenDev(err)

    return {
      success: false,
      classroomID: '',
      err: {
        name: 'createClassroom',
        message: 'Server Error'
      }
    }
  }
}
