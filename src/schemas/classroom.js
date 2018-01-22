export default `

  type Classroom {
    _id: String!
    name: String!
    description: String!
    creator: User! 
    outline: [String]!
    members: [User!]!
    posts: [String]!
    joinRequests: [User]!
    subject: String!
    thumbnail: String!
  }

  type CreateClassroomResponse {
    success: Boolean!
    classroomID: String 
    err: Error
  }

  type Mutation {
    createClassroom(
      name: String!,
      description: String!,
      subject: String!
    ) : CreateClassroomResponse!
  }
  
`