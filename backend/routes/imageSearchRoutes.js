import express from "express";
import { imageSearchHandler } from "../controllers/imageSearchController.js";
import { uploadMemory } from "../middlewares/multerMiddleware.js";

const router = express.Router();

// New image search route
router.post("/", uploadMemory.single("image"), imageSearchHandler);

export default router; 