import classroomPosts from '../handlers/post/query/classroom-posts'
import createPost from '../handlers/post/mutation/create-post'
import removePost from '../handlers/post/mutation/remove-post'
import getPost from '../handlers/post/query/get-post'

export default {
  Query: {
    classroomPosts,
    getPost
  },
  Mutation: {
    createPost,
    removePost
  }
}
