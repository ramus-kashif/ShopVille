import {
  deleteImageFromCloudinary,
  uploadImageOnCloudinary,
} from "../helper/cloudinaryHelper.js";
import productsModel from "../models/productsModel.js";

const addProductController = async (req, res) => {
  try {
    const { title, description, category, price, discount } = req.body;
    const picture = req.file.fieldname;
    const picturePath = req.file?.path;

    if (
      !title ||
      !description ||
      !category ||
      !price ||
      !picture ||
      !picturePath
    ) {
      return res
        .status(400)
        .send({ success: false, message: "All feilds are required" });
    }
    //Uploading image on cloudinary
    const { secure_url, public_id } = await uploadImageOnCloudinary(
      picturePath,
      "products"
    );

    if (!secure_url) {
      return res.status(400).send({
        success: false,
        message: "Error while uploading image",
        error: secure_url,
      });
    }
    const products = await productsModel.create({
      title,
      description,
      category,
      price,
      discount: discount || 0,
      user: req.user._id,
      picture: { secure_url, public_id },
    });

    return res.status(201).send({
      success: true,
      message: "Product added successfully",
      products,
    });
  } catch (error) {
    console.log(`addProductController Error ${error}`);
    return res.status(400).send({
      success: false,
      message: "Error in addProductController",
      error,
    });
  }
};

const getAllProductsController = async (_req, res) => {
  try {
    const products = await productsModel
      .find({})
      .populate("user", "name")
      .populate("category", "name");

    return res.status(200).send({
      success: true,
      total: products.length,
      message: "All Products fetched successfully",
      products,
    });
  } catch (error) {
    console.log(`getAllProductsController Error ${error}`);
    return res.status(400).send({
      success: false,
      message: "Error in getAllProductsController",
      error,
    });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productsModel.findById(productId);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    // Deleting image from cloudinary
    if (product.picture && product.picture.public_id) {
      await deleteImageFromCloudinary(product.picture.public_id);
    }

    await productsModel.findByIdAndDelete(productId);
    return res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(`deleteProductController Error ${error}`);
    return res.status(400).send({
      success: false,
      message: "Error in deleteAllProductController",
      error,
    });
  }
};

const getSingleProductController = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productsModel
      .findById(productId)
      .populate("user", "name")
      .populate("category", "name");

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Product details fetched successfully",
      product,
    });
  } catch (error) {
    console.log(`getSingleProductController Error ${error}`);
    return res.status(400).send({
      success: false,
      message: "Error in getSingleProductController",
      error,
    });
  }
};
const updateSingleProductController = async (req, res) => {
  try {
    const { productId } = req.params;
    const { title, description, category, price, discount } = req.body;
    // const picture = req.file.fieldname;
    const picturePath = req.file?.path;
    const product = await productsModel.findById(productId);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    if (title) product.title = title;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price) product.price = price;
    if (discount !== undefined) product.discount = discount;
    if (picturePath) {
      // Uploading new image on cloudinary
      const { secure_url, public_id } = await uploadImageOnCloudinary(
        picturePath,
        "products"
      );
      // Deleting old image from cloudinary
      if (product.picture && product.picture.public_id) {
        await deleteImageFromCloudinary(product.picture.public_id);
      }
      product.picture = { secure_url, public_id };

      if (!secure_url) {
        return res.status(400).send({
          success: false,
          message: "Error while uploading image",
          error: secure_url,
        });
      }
      product.picture = { secure_url, public_id };
      await product.save();
      return res.status(200).send({
        success: true,
        message: "Product updated successfully",
        product,
      });
    } else {
      await product.save();
      return res.status(200).send({
        success: true,
        message: "Product updated successfully",
        product,
      });
    }
  } catch (error) {
    console.log(`updateSingleProductController Error ${error}`);
    return res.status(400).send({
      success: false,
      message: "Error in updateSingleProductController",
      error,
    });
  }
};

// GET /api/v1/products?search=...&page=...&limit=...&category=...
const getPaginatedProductsController = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10, category = "" } = req.query;
    const query = {};
    
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    
    if (category) {
      query.category = category;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [products, total] = await Promise.all([
      productsModel
        .find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("user", "name")
        .populate("category", "name"),
      productsModel.countDocuments(query),
    ]);
    return res.status(200).send({
      success: true,
      message: "Products fetched successfully",
      products,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log(`getPaginatedProductsController Error ${error}`);
    return res.status(400).send({
      success: false,
      message: "Error in getPaginatedProductsController",
      error,
    });
  }
};

export {
  getAllProductsController,
  addProductController,
  deleteProductController,
  getSingleProductController,
  updateSingleProductController,
  getPaginatedProductsController,
};
