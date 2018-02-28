import { isEmpty, trim, isMongoId, equals } from 'validator'

import { ENG_THA_NUM_ALPHA } from '../../../constants/regex-patterns'

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
export default async (
  _,
  { classroomID, title, recipe, isPublic },
  { models, user }
) => {
  try {
    // Validation
    if (
      isEmpty(trim(classroomID)) ||
      isEmpty(trim(recipe)) ||
      isEmpty(trim(title))
    ) {
      return {
        success: false,
        post: null,
        err: {
          name: 'createPost',
          message: 'Important information not provided or invalid'
        }
      }
    }

    if (!isMongoId(classroomID)) {
      return {
        success: false,
        post: null,
        err: {
          name: 'createPost',
          message: 'ClassroomID invalid'
        }
      }
    }

    if (!ENG_THA_NUM_ALPHA.test(title)) {
      return {
        success: false,
        post: null,
        err: {
          name: 'createPost',
          message: 'Post title invalid'
        }
      }
    }

    // Checking the post creator is a current logged-in user or not?
    console.log(user)
    if (!user || isEmpty(user._id)) {
      return {
        success: false,
        post: null,
        err: {
          name: 'createPost',
          message: 'Unauthorized Access'
        }
      }
    }

    // Checking classroom is exists?
    const targetClassroom = await models.Classroom.findOne({
      _id: classroomID
    })

    if (!targetClassroom) {
      return {
        success: false,
        post: null,
        err: {
          name: 'createPost',
          message: 'Given classroom does not exist'
        }
      }
    }

    // Checking the current user is classroom supervisor(creator)
    if (!equals(user._id, String(targetClassroom.creator))) {
      return {
        success: false,
        post: null,
        err: {
          name: 'createPost',
          message: 'Only classroom creator should be able to create a post'
        }
      }
    }

    // Create and saving new post
    const newPost = await models.Post.create({
      title,
      recipe,
      isPublic,
      creator: user._id,
      classroom: targetClassroom._id
    })

    return {
      success: true,
      post: newPost,
      err: null
    }
  } catch (err) {
    console.log(err)
    return {
      success: false,
      post: null,
      err: {
        name: 'createPost',
        message: 'Server error'
      }
    }
  }
}
