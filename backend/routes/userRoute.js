import express from "express";

import {
  updateLocationAndCategoryForUser,
  updateUser,
  getUserByClerkId,
} from "../controllers/userController.js";

const router = express.Router();

router.put(
  "/update-location-category/:clerkId",
  updateLocationAndCategoryForUser
);
router.put("/update-user/:clerkId", updateUser);
router.get("/get-user/:clerkId", getUserByClerkId);

export default router;
