import userClassrooms from '../handlers/classroom/query/user-classrooms'
import classroomProfile from '../handlers/classroom/query/classroom-profile'
import inviteUser from '../handlers/classroom/mutation/invite-user'
import createClassroom from '../handlers/classroom/mutation/create-classroom'
import classroomMembers from '../handlers/classroom/query/classroom-members'

export default {
  Query: {
    userClassrooms,
    classroomProfile,
    classroomMembers
  },
  Mutation: {
    inviteUser,
    createClassroom
  }
}
