export default `

  type Outline {
    passed: Boolean!
    title: String!
  }

  type Classroom {
    _id: String!
    name: String
    description: String
    creator: User
    outline: [Outline]
    posts: [Post]
    subject: String
    thumbnail: String
  }

  type CreateClassroomResponse {
    success: Boolean!
    classroomID: String 
    err: Error
  }

  type ClassroomProfileResponse {
    isMember: Boolean!
    didJoinReqSent: Boolean
    classroom: Classroom
    err: Error
  }

  type UserClassroomsResponse {
    classrooms: [Classroom]!
    err: Error
  }

  type InviteUserResponse {
    success: Boolean!
    err: Error
  }

  type ClassroomInvitation {
    classroomName: String!
    classroomID: String!
    thumbnail: String!
    issueDate: String!
  }

  type ClassroomMembersResponse {
    isMember: Boolean!
    classroom: Classroom
    members: [User!]
    err: Error
  }

  type Query {
    classroomProfile(_id: String!): ClassroomProfileResponse!
    classroomMembers(classroomID: String!): ClassroomMembersResponse!
    userClassrooms(_id: String!): UserClassroomsResponse!
  }

  type Mutation {

    createClassroom (
      name: String!,
      description: String!,
      subject: String!
    ) : CreateClassroomResponse!
    
    inviteUser (
      candidateIdent: String!,
      classroomID: String!
    ) : InviteUserResponse!
  }
  
`
