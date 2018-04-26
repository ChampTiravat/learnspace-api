import { requiredAuthentication } from '../../../helpers/security-helpers'

/** ==================================================================================
 * @name editProfile()
 * @type resolver
 * @desc Edit user's profile information
 * @param parent : default parameter from ApolloServer
 * @param { username } [GRAPHQL_ARGS] : New username
 * @param { fname } [GRAPHQL_ARGS] : User new firstname
 * @param { lname } [GRAPHQL_ARGS] : User new lastname
 * @param { career } [GRAPHQL_ARGS] : User new career
 * @param { address } [GRAPHQL_ARGS] : User new address
 * @param { user } [GRAPHQL_CONTEXT] : Current authenticated user
 * @param { models } [GRAPHQL_CONTEXT] : Mongoose Model
 * @return GraphQL EditProfileResponse Type
 ================================================================================== */
export default async (_, { username, fname, lname, career, address }, { models }) => {
  try {
    // Authentication : user must be logged-in
    await requiredAuthentication(user)
  } catch (err) {}
}
