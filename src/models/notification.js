import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    isRequired: true,
    unique: false
  }
});

export default mongoose.model("notifications", NotificationSchema);
