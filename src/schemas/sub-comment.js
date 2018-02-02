export default `
    type SubComment {
        _id: String!
        creator: User!
        message: String!
        parentComment: Comment!
    }
`
