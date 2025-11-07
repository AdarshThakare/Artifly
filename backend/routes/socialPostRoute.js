import express from "express";
import {
  createSocialPost,
  updateSocialPost,
  storeTitle,
  storeStory,
  storeImage,
  getAllSocialPosts,
  getSocialPostById,
  storeDescription,
  getSocialPostsByClerkId,
} from "../controllers/socialPostController.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.post("/", createSocialPost);

router.put("/:postId", updateSocialPost);

router.post("/store-title/:postId", storeTitle);
router.post("/store-story/:postId", storeStory);
router.post("/store-description/:postId", storeDescription);
router.post("/store-image", upload.single("image"), storeImage);

router.get("/", getAllSocialPosts);
router.get("/:clerkId", getSocialPostsByClerkId);
router.get("/:postId", getSocialPostById);

export default router;
