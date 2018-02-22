import ClassroomInvitation from './classroom-invitation'
import Notification from './notification'
import ChatMessage from './chat-message'
import SubComment from './sub-comment'
import Classroom from './classroom'
import Chatroom from './chatroom'
import Comment from './comment'
import User from './user'
import Post from './post'

// We'll pass this object contains every available models
// to the GraphQL Context. So, we can use these models
// directly through our resolver's context object, without
// importing these models one by one
const models = {
  ClassroomInvitation,
  Notification,
  ChatMessage,
  SubComment,
  Classroom,
  Chatroom,
  Comment,
  User,
  Post
}

export default models
