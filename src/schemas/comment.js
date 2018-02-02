export default `
    type Comment {
        _id: String!
        creator: User!
	    message: String!
	    parentPost: Post!
        subComments: [SubComment]!
    }
`
