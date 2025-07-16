import express from "express";
import { isAdmin, isAuthorized } from "../middlewares/authMiddleware.js";
import {
  addProductController,
  deleteProductController,
  getAllProductsController,
  getSingleProductController,
  updateSingleProductController,
  getPaginatedProductsController,
} from "../controllers/productsController.js";
import { upload } from "../middlewares/multerMiddleware.js";

const productRouter = express.Router();

// http://localhost:8080/api/v1/products/ - GET
productRouter.get("/", getAllProductsController);

// http://localhost:8080/api/v1/products/search?search=...&page=...&limit=...
productRouter.get("/search", getPaginatedProductsController);

// http://localhost:8080/api/v1/products/all - GET
productRouter.get("/all", getAllProductsController);

// Admin Routes

// http://localhost:8080/api/v1/products/ - POST

productRouter.post(
  "/",
  upload.single("picture"),
  isAuthorized,
  isAdmin,
  addProductController
);

// http://localhost:8080/api/v1/products/:productId - DELETE
productRouter.delete(
  "/:productId",
  isAuthorized,
  isAdmin,
  deleteProductController
);

// http://localhost:8080/api/v1/products/:productId - GET
productRouter.get("/:productId", getSingleProductController);

// http://localhost:8080/api/v1/products/:productId - PUT
productRouter.put(
  "/:productId",
  upload.single("picture"),
  isAuthorized,
  isAdmin,
  updateSingleProductController
);

export default productRouter;
