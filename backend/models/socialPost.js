import mongoose from "mongoose";

const socialPostSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      description: "Product name",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "textile",
        "pottery",
        "furniture",
        "jewellery",
        "decorative work",
        "home utilities",
      ],
      description: "Category of the product",
    },
    location: {
      type: String,
      required: true,
      description: "Location of the artisan or product",
    },
    description: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    story: {
      type: String,
      default: "",
    },
    caption: {
      type: String,
      default: "",
    },
    hashtags: {
      type: [String],
      default: [],
    },
    seo_tags: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const socialPost =
  mongoose.models.Product || mongoose.model("Product", socialPostSchema);
export default socialPost;
