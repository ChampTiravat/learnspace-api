import { isEmpty, trim, isMongoId } from 'validator'

/** ==================================================================================
 * @name getPost()
 * @type resolver
 * @desc Return a post corresponding to a given post ID
 * @param parent : default parameter from ApolloServer
 * @param { _id } [GRAPHQL_ARGS] : post ID
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @return Object : GraphQL GetPostResponse Type
 ================================================================================== */
export default async (_, { _id }, { models }) => {
  try {
    // Input Validation
    if (isEmpty(trim(_id)) || !isMongoId(_id)) {
      return {
        posts: null,
        err: {
          name: 'getPost',
          message: 'post ID is invalid'
        }
      }
    }

    // Query post data
    const post = await models.Post.findOne({ _id })

    // If the post does not exist
    if (!post) {
      return {
        post: null,
        err: {
          name: 'getPost',
          message: 'The post does not exist'
        }
      }
    }

    return {
      post,
      err: null
    }
  } catch (err) {
    // Some error occured
    return {
      post: null,
      err: {
        name: 'getPost',
        message: 'Server Error'
      }
    }
  }
}
