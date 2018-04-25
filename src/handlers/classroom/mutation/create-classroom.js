import { isEmpty, trim, isMongoId } from 'validator'

import { requiredAuthentication } from '../../../helpers/security-helpers'
import { displayErrMessageWhenDev } from '../../../helpers/error-helpers'
import { ENG_THA_NUM_ALPHA } from '../../../constants'

const formatGraphQLErrorMessage = message => ({
  success: false,
  classroomID: '',
  err: {
    name: 'createClassroom',
    message
  }
})

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
    if (!requiredAuthentication) return formatGraphQLErrorMessage('Authentication Required')

    // All GraphQL Mutation parameters are required
    if (isEmpty(trim(name)) || isEmpty(trim(subject)) || isEmpty(trim(description)))
      return formatGraphQLErrorMessage('Important information should not be empty')

    // Validation
    if (!ENG_THA_NUM_ALPHA.test(name))
      return formatGraphQLErrorMessage("'name' is invalid or not specified")

    if (!ENG_THA_NUM_ALPHA.test(description))
      return formatGraphQLErrorMessage("'description' is invalid or not specified")

    if (!ENG_THA_NUM_ALPHA.test(subject))
      return formatGraphQLErrorMessage("'subject' is invalid or not specified")

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
      classroom: newClassroom._id,
      member: user._id,
      role: 'admin'
    })

    return {
      classroomID: newClassroom._id,
      success: true,
      err: null
    }
  } catch (err) {
    displayErrMessageWhenDev(err)
    return formatGraphQLErrorMessage('Server Error')
  }
}
