import productsModel from "../models/productsModel.js";

const addProductController = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
        if (!title || !description || !category || !price) {
      return res
        .status(400)
        .send({ success: false, message: "All feilds are required" });
    }
console.log(req.body)
  } catch (error) {
    console.log(`addProductController Error ${error}`);
    return res.status(400).send({
      success: false,
      message: "Error in addProductController",
      error,
    });
  }
};

export { addProductController };
