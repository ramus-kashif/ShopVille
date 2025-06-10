import categoriesModel from "../models/categoriesModel.js";
import slugify from "slugify";

const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .send({ success: false, message: "Category name is required" });
    }

    // Checking if the category already exists or not?
    const isExist = await categoriesModel.findOne({ name });
    if (isExist) {
      return res
        .status(400)
        .send({ success: false, message: "Category already exist" });
    }

    // Creating new user
    const category = await categoriesModel.create({
      name, // Example: Samsung Mobile
      slug: slugify(name, { lower: true, strict: true }), // Example: samsung-mobile
    });

    return res.status(201).send({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.log(`createCategoryController Error ${error}`);
    return res.status(400).send({
      success: false,
      message: "Error in createCategoryController",
      error,
    });
  }
};
const getAllCategoriescontroller = async (req, res) => {
  try {
    // fetching all categories from database
    const categories = await categoriesModel.find({});

    return res.status(201).send({
      success: true,
      message: "Category fetched successfully",
      categories,
    });
  } catch (error) {
    console.log(`getAllCategoriescontroller Error ${error}`);
    return res.status(400).send({
      success: false,
      message: "Error in getAllCategoriescontroller",
      error,
    });
  }
};
const deleteCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
    // fetching all categories from database
    const category = await categoriesModel.findOneAndDelete({ slug });
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log(`deleteCategoryController Error ${error}`);
    return res.status(400).send({
      success: false,
      message: "Error in deleteCategoryController",
      error,
    });
  }
};
const updateCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name } = req.body;

    //Validation check
    if (!name) {
      return res
        .status(400)
        .send({ success: false, message: "Category name is required" });
    }

    // fetching all categories from database
    const category = await categoriesModel.findOneAndUpdate(
      { slug },
      { name, slug: slugify(name, { lower: true, strict: true }) },
      { new: true }
    );
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.log(`updateCategoryController Error ${error}`);
    return res.status(400).send({
      success: false,
      message: "Error in updateCategoryController",
      error,
    });
  }
};
const getSingleCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
    // fetching all categories from database
    const category = await categoriesModel.findOne({ slug });
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    console.log(`getSingleCategoryController Error ${error}`);
    return res.status(400).send({
      success: false,
      message: "Error in getSingleCategoryController",
      error,
    });
  }
};

export {
  createCategoryController,
  getAllCategoriescontroller,
  deleteCategoryController,
  updateCategoryController,
  getSingleCategoryController,
};
