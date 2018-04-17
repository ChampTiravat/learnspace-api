import { isEmpty, trim, isMongoId, equals } from 'validator'

/** ==================================================================================
 * @name removePost()
 * @type resolver
 * @desc Remove an existing post
 * @param parent : default parameter from ApolloServer
 * @param { postID } [GRAPHQL_ARGS] : Post ID which about to be removed
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @param { user } [GRAPHQL_CONTEXT] : Currnet logged-in user(extracted from JWT token)
 * @return Object : GraphQL RemovePostResponse Type
 ================================================================================== */
export default async (_, { postID }, { models, user }) => {
  try {
    // Input Validation
    if (isEmpty(trim(postID)) || !isMongoId(postID)) {
      return {
        success: false,
        err: {
          name: 'removePost',
          message: 'post ID is empty or invalid'
        }
      }
    }

    // The post must be exists
    const postToRemove = await models.Post.findOne({ _id: postID }).lean()
    if (!postToRemove) {
      return {
        success: false,
        err: {
          name: 'removePost',
          message: 'A post with the given ID does not exist'
        }
      }
    }

    // Current user must be the creator of the post(classroom supervisor)
    if (!equals(user._id, String(postToRemove.creator))) {
      return {
        success: false,
        err: {
          name: 'removePost',
          message: 'Unauthorized operation'
        }
      }
    }

    // Remove the post
    await models.Post.remove({ _id: postID })

    return {
      success: true,
      err: null
    }
  } catch (err) {
    return {
      success: false,
      err: {
        name: 'removePost',
        message: 'Server Error'
      }
    }
  }
}
