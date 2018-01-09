import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
  content: {
    type: String,
    isRequired: true,
    unique: false
  }
});

export default mongoose.model("chat-messages", ChatMessageSchema);
