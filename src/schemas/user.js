export default `

  type User {
    _id: String!
    fname: String!
    lname: String
    email: String!
    password: String!
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
      user(email: String, _id: String): User
      users: [User!]!
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
`;
