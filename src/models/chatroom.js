import mongoose from "mongoose";

const ChatroomSchema = new mongoose.Schema({
  name: {
    type: String,
    isRequired: true,
    unique: false
  }
});

export default mongoose.model("chatrooms", ChatroomSchema);
