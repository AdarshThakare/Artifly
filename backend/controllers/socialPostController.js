import SocialPost from "../models/socialPost.js";
import User from "../models/user.js";

export const createSocialPost = async (req, res) => {
  try {
    const { clerkId, name, category, location } = req.body;

    if (!clerkId || !name || !category || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const newPost = await SocialPost.create({
      user: user._id,
      name,
      category,
      location,
    });

    res
      .status(201)
      .json({ message: "Post created successfully", data: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Server error while creating post" });
  }
};

export const updateSocialPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const updates = req.body;

    const updatedPost = await SocialPost.findByIdAndUpdate(
      postId,
      { $set: updates },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ message: "Post updated", data: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Server error while updating post" });
  }
};

export const storeTitle = async (req, res) => {
  await updateSocialPost(req, res);
};

export const storeStory = async (req, res) => {
  await updateSocialPost(req, res);
};

export const storeImage = async (req, res) => {
  try {
    const { postId, imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing image data" });
    }

    const post = await SocialPost.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.images.push(imageBase64);
    await post.save();

    res.status(200).json({ message: "Image added", data: post });
  } catch (error) {
    console.error("Error storing image:", error);
    res.status(500).json({ error: "Server error while storing image" });
  }
};

export const getAllSocialPosts = async (req, res) => {
  try {
    const posts = await SocialPost.find()
      .populate(
        "user",
        "firstName lastName email profilePicture category location"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All social posts fetched successfully",
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching all social posts:", error);
    res.status(500).json({ error: "Server error while fetching posts" });
  }
};

export const getSocialPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await SocialPost.findById(postId).populate(
      "user",
      "firstName lastName email profilePicture category location"
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({
      message: "Post fetched successfully",
      data: post,
    });
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    res.status(500).json({ error: "Server error while fetching post" });
  }
};
