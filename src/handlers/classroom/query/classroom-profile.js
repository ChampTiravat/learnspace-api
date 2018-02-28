import { isEmpty, trim, isMongoId } from 'validator'

/** ==================================================================================
 * @name classroomProfile()
 * @type resolver
 * @desc Send classroom information corresponding to a given Classroom ID
 * @param parent : default parameter from ApolloServer
 * @param { _id } [GRAPHQL_ARGS] : Classroom ID
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @return Object : GraphQL
 ================================================================================== */
export default async (_, { _id }, { models }) => {
  try {
    // Input Validation
    if (isEmpty(trim(_id)) || !isMongoId(_id)) {
      return {
        classroom: null,
        err: {
          name: 'classroom',
          message: 'Classroom ID invalid or not specified'
        }
      }
    }

    // Quering a classroom
    const classroom = await models.Classroom.findOne({ _id })

    // Quering a creator of the classroom
    const classroomCreator = await models.User.findOne({
      _id: classroom.creator
    })

    // Querying posts related to a given classroom
    const classroomPosts = await models.Post.find({
      classroom: classroom._id
    })

    if (!classroom) {
      return {
        classroom: null,
        err: {
          name: 'classroom',
          message: 'Classroom not found'
        }
      }
    }

    if (!classroomCreator) {
      return {
        classroom: null,
        err: {
          name: 'classroom',
          message: 'Server Error'
        }
      }
    }

    return {
      classroom: {
        _id: classroom._id,
        name: classroom.name,
        description: classroom.description,
        subject: classroom.subject,
        thumbnail: classroom.thumbnail,
        creator: classroomCreator,
        outline: [
          { title: 'Explain course outline', passed: true },
          { title: 'Calculus and Analytic Geometry', passed: true },
          {
            title: 'Getting started with Python programmingmmmmmmmmmm',
            passed: true
          },
          { title: 'Data Structures and Algorithms', passed: false },
          { title: 'Final Project', passed: false },
          { title: 'Examination', passed: false }
        ],
        posts: classroomPosts
      },
      err: null
    }
  } catch (err) {
    return {
      classroom: null,
      err: {
        name: 'classroom',
        message: 'Server Error'
      }
    }
  }
}
