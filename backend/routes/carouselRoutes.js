import express from "express";
import { isAuthorized, isAdmin } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import {
  getCarouselImages,
  addCarouselImage,
  updateCarouselImage,
  deleteCarouselImage,
  getAllCarouselImages,
} from "../controllers/carouselController.js";

const router = express.Router();

// Public route to get active carousel images
router.get("/images", getCarouselImages);

// Admin routes
router.get("/admin/images", isAuthorized, isAdmin, getAllCarouselImages);
router.post("/admin/images", isAuthorized, isAdmin, upload.single("image"), addCarouselImage);
router.put("/admin/images/:id", isAuthorized, isAdmin, upload.single("image"), updateCarouselImage);
router.delete("/admin/images/:id", isAuthorized, isAdmin, deleteCarouselImage);

export default router; 