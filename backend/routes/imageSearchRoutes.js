import express from "express";
import { searchByImage, getSearchStats } from "../controllers/imageSearchController.js";
import { uploadMemory } from "../middlewares/multerMiddleware.js";

const router = express.Router();

// Enhanced image search route
router.post("/search", uploadMemory.single("image"), searchByImage);

// Get search statistics
router.get("/stats", getSearchStats);

export default router; 