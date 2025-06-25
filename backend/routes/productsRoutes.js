import express from "express";
import { isAdmin, isAuthorized } from "../middlewares/authMiddleware.js";
import { addProductController, getAllProductsController } from "../controllers/productsController.js";
import { upload } from "../middlewares/multerMiddleware.js";

const productRouter = express.Router();

// http://localhost:8080/api/v1/products/ - GET
productRouter.get("/", getAllProductsController);

// Admin Routes

// http://localhost:8080/api/v1/products/ - POST

productRouter.post("/", upload.single("picture"), isAuthorized, isAdmin, addProductController);

// http://localhost:8080/api/v1/products/:slug - DELETE

// http://localhost:8080/api/v1/products/:slug - GET

// http://localhost:8080/api/v1/products/:slug - PUT

export default productRouter;
