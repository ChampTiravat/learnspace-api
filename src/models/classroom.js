import mongoose from "mongoose";

const ClassroomSchema = new mongoose.Schema({
  name: {
    type: String,
    isRequired: true,
    unique: false
  }
});

export default mongoose.model("classrooms", ClassroomSchema);
