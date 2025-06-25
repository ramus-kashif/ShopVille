import { uploadImageOnCloudinary } from "../helper/cloudinaryHelper.js";
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
    const product = await productsModel.create({
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
      product,
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
const getAllProductsController = async (req, res) => {
  try {
    const product = await productsModel.find({}).populate("user", "name").populate("category", "name");

    return res.status(200).send({
      success: true,
      total: product.length,
      message: "All Products fetched successfully",
      product,
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

export { getAllProductsController,addProductController };
