import { isEmpty, trim, isMongoId, equals } from 'validator'

import { requiredAuthentication, requiredClassroomAdmin } from '../../../helpers/security-helpers'
import { displayErrMessageWhenDev } from '../../../helpers/error-helpers'
import { ENG_THA_NUM_ALPHA } from '../../../constants'

const formatGraphQLErrorMessage = message => ({
  success: false,
  post: null,
  err: {
    name: 'createPost',
    message
  }
})

/** ==================================================================================
 * @name createPost()
 * @type resolver
 * @desc Create a new post
 * @param parent : default parameter from ApolloServer
 * @param { title } [GRAPHQL_ARGS] : post title
 * @param { recipe } [GRAPHQL_ARGS] : post content(post recipe)
 * @param { isPublic } [GRAPHQL_ARGS] : Specify wether the post will be publicly visible or not
 * @param { classroomID } [GRAPHQL_ARGS] : Classroom ID
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @param { user } [GRAPHQL_CONTEXT] : Currnet logged-in user(extracted from JWT token)
 * @return Object : GraphQL CreatePostResponse Type
 ================================================================================== */
export default async (_, { classroomID, title, recipe, isPublic }, { models, user }) => {
  try {
    // ---------------------------------------------------------------------
    // Authentication
    // ---------------------------------------------------------------------
    // Make sure user has authorized access
    const isLogin = await requiredAuthentication(user)
    if (!isLogin) return formatGraphQLErrorMessage('Authentication Required')

    // ---------------------------------------------------------------------
    // Validation
    // ---------------------------------------------------------------------
    if (isEmpty(trim(classroomID)) || isEmpty(trim(recipe)) || isEmpty(trim(title)))
      return formatGraphQLErrorMessage('Important information not provided or invalid')

    // classroomID must be mongoDB ObjectId
    if (!isMongoId(classroomID)) return formatGraphQLErrorMessage('ClassroomID invalid')

    if (!ENG_THA_NUM_ALPHA.test(title)) return formatGraphQLErrorMessage('Post title invalid')

    // ---------------------------------------------------------------------
    // Checking the current user is classroom supervisor(creator)
    // ---------------------------------------------------------------------
    const isClassroomAdmin = await requiredClassroomAdmin(user, classroomID, models.ClassroomMember)
    if (!isClassroomAdmin) return formatGraphQLErrorMessage('Unauthorized Access')

    // ---------------------------------------------------------------------
    // Checking classroom is exists?
    // ---------------------------------------------------------------------
    const targetClassroom = await models.Classroom.findOne(
      {
        _id: classroomID
      },
      '_id'
    ).lean()

    if (!targetClassroom) return formatGraphQLErrorMessage('Given classroom does not exist')

    // ---------------------------------------------------------------------
    // Create and saving new post
    // ---------------------------------------------------------------------
    const newPost = await models.Post.create({
      title,
      recipe,
      isPublic,
      creator: user._id,
      classroom: targetClassroom._id
    })

    // ---------------------------------------------------------------------
    // Return appropriete GraphQL response
    // ---------------------------------------------------------------------
    return {
      success: true,
      post: newPost,
      err: null
    }
  } catch (err) {
    displayErrMessageWhenDev(err)
    return formatGraphQLErrorMessage('Server Error')
  }
}
