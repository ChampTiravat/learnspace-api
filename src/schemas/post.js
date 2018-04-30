export default `

    type Post {
        _id: String!
        title: String!
        creator: User!
        recipe: String!
        comments: [Comment]!
        isPublic: Boolean!
        createdAt: String
        updatedAt: String
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

    type GetPostResponse {
        post: Post
        err: Error
    }

    type RemovePostResponse {
        success: Boolean!
        err: Error
    }

    type Query {
        getPost(_id: String!): GetPostResponse!
        classroomPosts(_id: String!): ClassroomPostsResponse!
    }

    type Mutation {
        createPost(classroomID: String!, title: String!, recipe: String!, isPublic: Boolean!): CreatePostResponse!
        removePost(postID: String!): RemovePostResponse!
    }

`
