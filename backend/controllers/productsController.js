import {
  deleteImageFromCloudinary,
  uploadImageOnCloudinary,
} from "../helper/cloudinaryHelper.js";
import productsModel from "../models/productsModel.js";

const addProductController = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
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
    
    await productsModel.findByIdAndDelete(productId)
    return res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(`getAllProductsController Error ${error}`);
    return res.status(400).send({
      success: false,
      message: "Error in deleteAllProductController",
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

export {
  getAllProductsController,
  addProductController,
  deleteProductController,
};
