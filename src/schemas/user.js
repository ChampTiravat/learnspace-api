export default `

  type User {
    _id: String!
    fname: String!
    email: String!
    lname: String
    username: String
    address: String
    career: String
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

  }
`
