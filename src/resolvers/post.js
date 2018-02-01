import { isEmpty, trim, isMongoId, equals } from 'validator'

import { ENG_THA_NUM_ALPHA } from '../constants/regex-patterns'

export default {
  Query: {
    /**
     * @name classroomPosts()
     * @type resolver
     * @desc Return a list of post corresponding to a given classroom ID
     * @param parent : default parameter from ApolloServer
     * @param { _id } [GRAPHQL_ARGS] : Classroom ID
     * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
     * @return Object : GraphQL ClassroomPostsResponse Type
     */
    classroomPosts: async (_, { _id }, { models }) => {
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
    },
    /**
     * @name getPost()
     * @type resolver
     * @desc Return a post corresponding to a given post ID
     * @param parent : default parameter from ApolloServer
     * @param { _id } [GRAPHQL_ARGS] : post ID
     * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
     * @return Object : GraphQL GetPostResponse Type
     */
    getPost: async (_, { _id }, { models }) => {
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
  }, // End Query
  Mutation: {
    /**
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
     */
    createPost: async (
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
  } // End Mutation
}
