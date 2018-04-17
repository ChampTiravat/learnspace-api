import { isEmpty, trim, isMongoId } from 'validator'

/** ==================================================================================
 * @name userClassrooms()
 * @type resolver
 * @desc Send the classrooms corresponding to a given user
 * @param parent : default parameter from ApolloServer
 * @param { _id } [GRAPHQL_ARGS] : User ID
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @return Object : GraphQL UserClassroomsResponse Type
 ================================================================================== */
export default async (_, { _id }, { models }) => {
  try {
    // Input Validation
    if (isEmpty(trim(_id)) || !isMongoId(_id)) {
      return {
        classrooms: [],
        err: {
          name: 'classroom',
          message: 'User ID invalid or not specified'
        }
      }
    }

    // Quering a classroom
    const classrooms = await models.Classroom.find({ creator: _id }).lean()

    return {
      classrooms,
      err: null
    }
  } catch (err) {
    return {
      classrooms: [],
      err: {
        name: 'classroom',
        message: 'Server Error'
      }
    }
  }
}
