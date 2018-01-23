export default `

    type PostReceipe {
        order: Int!
        type: String!
        data: String # Placeholder
    }

    type Post {
        _id: String!
        title: String!
        receipe: [PostReceipe!]!
        creator: User!
        comments: [String]!
        isPublic: Boolean!
    }
`