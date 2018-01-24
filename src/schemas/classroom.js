export default `

  type Outline {
    passed: Boolean!
    title: String!
  }

  type Classroom {
    _id: String!
    name: String!
    description: String!
    creator: User! 
    outline: [Outline]!
    members: [User!]!
    posts: [Post]!
    joinRequests: [User]!
    subject: String!
    thumbnail: String!
  }

  type CreateClassroomResponse {
    success: Boolean!
    classroomID: String 
    err: Error
  }

  type ClassroomProfileResponse {
    classroom: Classroom
    err: Error
  }

  type Query {
    classroomProfile(_id: String!): ClassroomProfileResponse!
  }

  type Mutation {
    createClassroom(
      name: String!,
      description: String!,
      subject: String!
    ) : CreateClassroomResponse!
  }
  
`
