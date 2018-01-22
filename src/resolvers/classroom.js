const TEXT_REGEX = /^([\w]*)$/u

export default {
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
