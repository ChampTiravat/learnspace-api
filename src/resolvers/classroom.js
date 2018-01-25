const TEXT_REGEX = /([\w ]+)/u
const OBJECT_ID_REGEX = /^[a-f0-9]{24}$/

export default {
  Query: {
    /**
     * @name
     * @type resolver
     * @desc Send the classrooms corresponding to a given user
     * @param parent : default parameter from ApolloServer
     * @param { _id } : User ID
     * @param { models } : Mongoose Model
     * @return Object : GraphQL
     */
    userClassrooms: async (_, { _id }, { models }) => {
      // Input Validation
      if (!_id || _id == '' || !OBJECT_ID_REGEX.test(_id)) {
        return {
          classroom: null,
          err: {
            name: 'classroom',
            message: 'User ID invalid or not specified'
          }
        }
      }

      try {
        // Quering a classroom
        const classrooms = await models.Classroom.find({ creator: _id })

        return {
          classrooms,
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
    },
    /**
     * @name classroomProfile()
     * @type resolver
     * @desc Send classroom information corresponding to a given Classroom ID
     * @param parent : default parameter from ApolloServer
     * @param { _id } : Classroom ID
     * @param { models } : Mongoose Model
     * @return Object : GraphQL
     */
    classroomProfile: async (_, { _id }, { models }) => {
      // Input Validation
      if (!_id || _id == '' || !OBJECT_ID_REGEX.test(_id)) {
        return {
          classroom: null,
          err: {
            name: 'classroom',
            message: 'Classroom ID invalid or not specified'
          }
        }
      }

      try {
        // Quering a classroom
        const classroom = await models.Classroom.findOne({ _id })

        // Quering a creator of the classroom
        const classroomCreator = await models.User.findOne({
          _id: classroom.creator
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
            posts: [
              {
                _id: '123235',
                title:
                  'Advance Introduction to JVM Execution Processes on x64 Architecture'
              },
              {
                _id: '123237',
                title:
                  'เริ่มต้นการเขียนโปรแกรมควบคุมระบบเซ็นเซอร์ตรวจจับการเคลื่อนใหวด้วยภาษา C++ และ Linux'
              },
              {
                _id: '123238',
                title: 'Introduction to JVM'
              },
              {
                _id: '123239',
                title: 'Introduction to JVM'
              },
              {
                _id: '12323111',
                title: 'Introduction to JVM'
              }
            ]
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
  },
  Mutation: {
    /**
     * @name createClassroom()
     * @type resolver
     * @desc Create a new classroom with a given information
     * @param parent : default parameter from ApolloServer
     * @param { name } : classroom name
     * @param { description } : classroom description
     * @param { subject } : classroom main subject
     * @param { user } : Current logged-in user(used as a classroom creator)
     * @param { models } : Mongoose Model
     * @return Object : GraphQL CraeteClassroomResponse Type
     */
    createClassroom: async (
      _,
      { name, description, subject },
      { user, models }
    ) => {
      // User must be authenticated
      if (!user || !user._id) {
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
      if (!name || !description || !subject) {
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
      if (!TEXT_REGEX.test(name))
        return {
          success: false,
          classroomID: '',
          err: {
            name: 'createClassroom',
            message: "'name' is invalid or not specified"
          }
        }

      if (!TEXT_REGEX.test(description))
        return {
          success: false,
          classroomID: '',
          err: {
            name: 'createClassroom',
            message: "'description' is invalid or not specified"
          }
        }

      if (!TEXT_REGEX.test(subject))
        return {
          success: false,
          classroomID: '',
          err: {
            name: 'createClassroom',
            message: "'subject' is invalid or not specified"
          }
        }

      try {
        // New Classroom Construction
        const newClassroom = await models.Classroom.create({
          name,
          subject,
          description,
          creator: user._id
        })

        return {
          success: true,
          classroomID: newClassroom._id,
          err: null
        }
      } catch (err) {
        // Some Error Occured
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
  }
}
