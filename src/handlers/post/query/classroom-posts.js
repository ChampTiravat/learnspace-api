import { isEmpty, trim, isMongoId } from 'validator'

/** ==================================================================================
 * @name classroomPosts()
 * @type resolver
 * @desc Return a list of post corresponding to a given classroom ID
 * @param parent : default parameter from ApolloServer
 * @param { _id } [GRAPHQL_ARGS] : Classroom ID
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @return Object : GraphQL ClassroomPostsResponse Type
 ================================================================================== */
export default async (_, { _id }, { models }) => {
  try {
    // Input Validation
    if (isEmpty(trim(_id)) || !isMongoId(_id)) {
      return {
        posts: null,
        err: {
          name: 'classroomsPosts',
          message: 'Classroom ID is invalid'
        }
      }
    }

    // Check classroom must be exists!
    const classroom = await models.Classroom.findOne({ _id })

    if (!classroom) {
      return {
        posts: null,
        err: {
          name: 'classroomsPosts',
          message: 'A given classroom does not exists'
        }
      }
    }

    // Querying all post in the classroom
    const posts = await models.Post.find({ classroom: _id })

    return {
      posts,
      err: null
    }
  } catch (err) {
    return {
      posts: null,
      err: {
        name: 'classroomsPosts',
        message: 'Server Error'
      }
    }
  }
}
