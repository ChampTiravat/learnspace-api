export default `

  type User {
    _id: String!
    fname: String!
    email: String!
    lname: String
    username: String
    address: String
    career: String
    profilePicture: String!
    classrooms: [Classroom]!
  }

  type LoginResponse {
    success: Boolean!
    refreshToken: String
    accessToken: String
    user: User
    err: String
  }

  type RegisterResponse {
    success: Boolean!
    user: User
    err: String
  }

  type EditProfileResponse {
    success: Boolean!
    err: String
  }

  type Query {
      user(_id: String): User
  }

  type Mutation {

      login(
        email: String!,
        password: String!
      ): LoginResponse!

      register(
        email: String!,
        password: String!,
        fname: String!,
        lname: String
      ): RegisterResponse!

      editProfile(
        _id: String!,
        username: String,
        fname: String,
        lname: String,
        career: String,
        address: String 
      ): EditProfileResponse!

  }
`
