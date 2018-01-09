import mongoose from "mongoose";

const ClassroomJoinRequest = new mongoose.Schema({
  sender: {
    type: String,
    isRequired: true
  }
});

export default mongoose.model(
  "classroom-join-requests",
  ClassroomJoinRequestSchema
);
