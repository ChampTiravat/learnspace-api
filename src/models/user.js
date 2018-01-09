import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fname: {
    type: String,
    isRequired: true,
    unique: false
  },
  lname: {
    type: String,
    isRequired: false,
    unique: false
  },
  email: {
    type: String,
    isRequired: true,
    unique: true
  },
  password: {
    type: String,
    isRequired: true,
    unique: false
  }
});

export default mongoose.model("users", UserSchema);
