import express from "express";
import {
  newReview,
  getProductReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  markHelpful,
  getMyReviews,
  getAllReviews,
  verifyReview,
  adminReplyToReview,
} from "../controllers/reviewController.js";

import { isAuthorized as isAuthenticatedUser, isAdmin as authorizeRoles } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = express.Router();

// Public routes
router.route("/product/:productId").get(getProductReviews);

// Protected routes
router.route("/review/new").post(isAuthenticatedUser, upload.array("images", 5), newReview);
router.route("/review/:id").get(getSingleReview);
router.route("/review/:id").put(isAuthenticatedUser, upload.array("images", 5), updateReview);
router.route("/review/:id").delete(isAuthenticatedUser, deleteReview);
router.route("/review/:id/helpful").post(isAuthenticatedUser, markHelpful);
router.route("/reviews/me").get(isAuthenticatedUser, getMyReviews);

// Admin routes
router.route("/admin/reviews").get(isAuthenticatedUser, authorizeRoles, getAllReviews);
router.route("/admin/review/:id/verify").put(isAuthenticatedUser, authorizeRoles, verifyReview);
router.route("/admin/review/:id/reply").put(isAuthenticatedUser, authorizeRoles, adminReplyToReview);

export default router; 