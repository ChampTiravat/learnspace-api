export default `

  type User {
    _id: String!
    fname: String!
    email: String!
    lname: String
    address: String
    username: String
    career: String
    profilePicture: String!
  }

  type UserProfileResponse {
    user: User
    err: Error
  }

  type LoginResponse {
    success: Boolean!
    refreshToken: String
    accessToken: String
    user: User
    err: Error 
  }

  type RegisterResponse {
    success: Boolean!
    user: User
    err: Error 
  }

  type EditProfileResponse {
    success: Boolean!
    err: Error 
  }

  type UserClassroomInvitationsResponse {
    invitations: [ClassroomInvitation]!
    err: Error
  }

  type Query {

      userProfile(_id: String): UserProfileResponse!

      userClassroomInvitations(
        _id: String!
      ) UserClassroomInvitationsResponse!

  }

  type Mutation {

      login(
        email: String!,
        password: String!
      ): LoginResponse!

      register(
        email: String!,
        password: String!,
        username: String!,
        fname: String!,
        lname: String
      ): RegisterResponse!

      editProfile(
        username: String,
        fname: String,
        lname: String,
        career: String,
        address: String 
      ): EditProfileResponse!

  }
`
