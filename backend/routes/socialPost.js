import express from "express";
import {
  createSocialPost,
  updateSocialPost,
  storeTitle,
  storeStory,
  storeImage,
  getAllSocialPosts,
  getSocialPostById,
} from "../controllers/socialPostController.js";

const router = express.Router();

router.post("/", createSocialPost);

router.put("/:postId", updateSocialPost);

router.post("/store-title/:postId", storeTitle);
router.post("/store-story/:postId", storeStory);
router.post("/store-image", storeImage);

router.get("/", getAllSocialPosts);

router.get("/:postId", getSocialPostById);

export default router;
