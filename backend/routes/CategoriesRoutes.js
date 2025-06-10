import express from "express";
import { isAdmin, isAuthorized } from "../middlewares/authMiddleware.js";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriescontroller,
  getSingleCategoryController,
  updateCategoryController,
} from "../controllers/categoriesController.js";

const categoriesRouter = express.Router();

// http://localhost:8080/api/v1/categories/ - GET

categoriesRouter.get("/", getAllCategoriescontroller);

// Admin Routes

// http://localhost:8080/api/v1/categories/ - POST
categoriesRouter.post("/", isAuthorized, isAdmin, createCategoryController);

// http://localhost:8080/api/v1/categories/:slug - DELETE
categoriesRouter.delete(
  "/:slug",
  isAuthorized,
  isAdmin,
  deleteCategoryController
);
// http://localhost:8080/api/v1/categories/:slug - GET
categoriesRouter.get(
  "/:slug",
  isAuthorized,
  isAdmin,
  getSingleCategoryController
);

// http://localhost:8080/api/v1/categories/:slug - PUT
categoriesRouter.put("/:slug", isAuthorized, isAdmin, updateCategoryController);

export default categoriesRouter;
