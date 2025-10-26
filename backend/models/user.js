import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    specialization: [
      {
        type: String,
        required: false,
      },
    ],

    instagramLink: {
      type: String,
      required: false,
    },
    facebookLink: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
