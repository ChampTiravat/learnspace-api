import respondToClassroomInvitation from '../handlers/user/mutation/respond-to-classroom-invitation'
import sendClassroomJoinRequest from '../handlers/user/mutation/send-classroom-join-request'
import userClassroomInvitations from '../handlers/user/query/user-classroom-invitations'
import userProfile from '../handlers/user/query/user-profile'
import register from '../handlers/user/mutation/register'
import editProfile from '../handlers/user/mutation/login'
import login from '../handlers/user/mutation/login'

export default {
  Query: {
    userClassroomInvitations,
    userProfile
  },
  Mutation: {
    respondToClassroomInvitation,
    sendClassroomJoinRequest,
    editProfile,
    register,
    login
  }
}
