import login from '../handlers/user/mutation/login'
import register from '../handlers/user/mutation/register'
import editProfile from '../handlers/user/mutation/login'
import userProfile from '../handlers/user/query/user-profile'

export default {
  Query: {
    userProfile
  },
  Mutation: {
    login,
    register,
    editProfile
  }
}
