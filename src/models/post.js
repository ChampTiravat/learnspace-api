import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    isRequired: true,
    unique: false
  }
});

export default mongoose.model("posts", PostSchema);
