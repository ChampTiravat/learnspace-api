import login from '../handlers/user/mutation/login'
import register from '../handlers/user/mutation/register'
import editProfile from '../handlers/user/mutation/login'
import userProfile from '../handlers/user/query/user-profile'
import userClassroomInvitations from '../handlers/user/query/user-classroom-invitations'

export default {
  Query: {
    userProfile,
    userClassroomInvitations
  },
  Mutation: {
    login,
    register,
    editProfile
  }
}
