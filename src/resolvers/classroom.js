import { isAlpha, isEmpty, trim, isMongoId } from 'validator'

import { ENG_THA_NUM_ALPHA } from '../constants/regex-patterns'
import {
  requiredAuthentication,
  mustBeClassroomCreator
} from '../helpers/security-helpers'

export default {
  Query: {
    /** ==================================================================================
     * @name userClassrooms()
     * @type resolver
     * @desc Send the classrooms corresponding to a given user
     * @param parent : default parameter from ApolloServer
     * @param { _id } [GRAPHQL_ARGS] : User ID
     * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
     * @return Object : GraphQL UserClassroomsResponse Type
     ================================================================================== */
    userClassrooms: async (_, { _id }, { models }) => {
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
        const classrooms = await models.Classroom.find({ creator: _id })
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
    },
    /** ==================================================================================
     * @name classroomProfile()
     * @type resolver
     * @desc Send classroom information corresponding to a given Classroom ID
     * @param parent : default parameter from ApolloServer
     * @param { _id } [GRAPHQL_ARGS] : Classroom ID
     * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
     * @return Object : GraphQL
     ================================================================================== */
    classroomProfile: async (_, { _id }, { models }) => {
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
  }, // End Query
  Mutation: {
    /** ==================================================================================
     * @name inviteUser()
     * @type resolver
     * @desc Send a classroom invitation to a given user
     * @param parent : default parameter from ApolloServer
     * @param { candidateID } [GRAPHQL_ARGS] : ID if the candidate(target user who recieve an invitation)
     * @param { classroomID } [GRAPHQL_ARGS] : Classroom ID
     * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
     * @param { user } [GRAPHQL_CONTEXT] : Current logged-in user(used as a classroom creator)
     * @return Object : GraphQL CraeteClassroomResponse Type
     ================================================================================== */
    inviteUser: async (_, { candidateID, classroomID }, { models, user }) => {
      try {
        // Make sure user has authorized access
        await requiredAuthentication(user)
        await mustBeClassroomCreator(user, classroomID)

        // Validate inputs
        if (isEmpty(trim(candidateID)) || !isMongoId(candidateID)) {
          return {
            success: false,
            err: {
              name: 'inviteUser',
              message: 'Candidate ID invalid or not specified'
            }
          }
        }

        if (isEmpty(trim(classroomID)) || !isMongoId(classroomID)) {
          return {
            success: false,
            err: {
              name: 'inviteUser',
              message: 'Classroom ID invalid or not specified'
            }
          }
        }

        // Make sure a given classroom does exists
        const targetClassroom = await models.Classroom.findOne({
          _id: classroomID
        })
        if (!classroom) {
          return {
            success: false,
            err: {
              name: 'inviteUser',
              message: 'A given classroom does not exists'
            }
          }
        }

        // Make sure a candidate user does exists
        const candidate = await models.User.findOne({ _id: candidateID })
        if (!candidate) {
          return {
            success: false,
            err: {
              name: 'inviteUser',
              message: 'A given candidate does not exists'
            }
          }
        }

        // Candidate must not already being a member of a target classroom
        const memberWithSameCred = await targetClassroom.members.find(member =>
          equals(member._id, candidateID)
        )
        if (memberWithSameCred) {
          if (!memberWithSameCred) {
            return {
              success: false,
              err: {
                name: 'inviteUser',
                message:
                  'A given candidate is already a member of a given classroom'
              }
            }
          }
        }

        // Do not send an invitation if it's already been sent
        const invitationWithSameCred = await models.ClassroomInvitation.findOne(
          {
            candidate: candidateID,
            classroom: classroomID
          }
        )
        if (invitationWithSameCred) {
          return {
            success: false,
            err: {
              name: 'inviteUser',
              message: 'A given candidate already recieve an invitation'
            }
          }
        }

        // Insert Invitation into ClassroomInvitations Collections(in MongoDB)
        await models.ClassroomInvitation.create({
          candidate: candidateID,
          classroom: classroomID
        })

        // Send a notification to candidate user(if everything went ok)

        // Return appropriete GraphQL response
        return {
          success: true,
          err: null
        }
      } catch (err) {
        return {
          success: false,
          err: {
            name: 'inviteUser',
            message: 'Server Error'
          }
        }
      }
    },
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
    createClassroom: async (
      _,
      { name, description, subject },
      { user, models }
    ) => {
      try {
        // User must be authenticated
        if (isEmpty(trim(user._id)) || !isMongoId(user._id)) {
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
        if (
          isEmpty(trim(name)) ||
          isEmpty(trim(description)) ||
          isEmpty(trim(subject))
        ) {
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
        if (!ENG_THA_NUM_ALPHA.test(name))
          return {
            success: false,
            classroomID: '',
            err: {
              name: 'createClassroom',
              message: "'name' is invalid or not specified"
            }
          }

        if (!ENG_THA_NUM_ALPHA.test(description))
          return {
            success: false,
            classroomID: '',
            err: {
              name: 'createClassroom',
              message: "'description' is invalid or not specified"
            }
          }

        if (!ENG_THA_NUM_ALPHA.test(subject))
          return {
            success: false,
            classroomID: '',
            err: {
              name: 'createClassroom',
              message: "'subject' is invalid or not specified"
            }
          }

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
  } // End Mutation
}
