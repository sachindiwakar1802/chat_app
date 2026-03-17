import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  contact: {
    type: Number,
    required: function() {
      // Contact is required only if user doesn't have googleId
      return !this.googleId;
    },
    unique: true,
    sparse: true  // Allows multiple null/undefined values
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: ""
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;