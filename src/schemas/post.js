export default `

    type Post {
        _id: String!
        title: String!
        creator: User!
        recipe: String!
        comments: [String]!
        isPublic: Boolean!
    }

    type ClassroomPostsResponse {
        posts: [Post]
        err: Error
    }

    type CreatePostResponse {
        success: Boolean!
        post: Post,
        err: Error 
    }

    type Query {
        classroomPosts(_id: String!): ClassroomPostsResponse!
    }

    type Mutation {
        createPost(classroomID: String!, title: String!, recipe: String!, isPublic: Boolean!): CreatePostResponse!
    }

`
