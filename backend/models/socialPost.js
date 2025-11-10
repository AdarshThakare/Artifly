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
    pricePerPiece: {
      type: Number,
      default: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
    TotalPriceCollected: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    itemSold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const SocialPost =
  mongoose.models.SocialPost || mongoose.model("SocialPost", socialPostSchema);
export default SocialPost;
