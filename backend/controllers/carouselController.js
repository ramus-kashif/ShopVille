import { uploadImageOnCloudinary, deleteImageFromCloudinary } from "../helper/cloudinaryHelper.js";
import Carousel from "../models/carouselModel.js";

// Get all active carousel images
export const getCarouselImages = async (req, res) => {
  try {
    const images = await Carousel.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .populate("user", "name");

    res.status(200).json({
      success: true,
      message: "Carousel images fetched successfully",
      images,
    });
  } catch (error) {
    console.log(`getCarouselImages Error: ${error}`);
    res.status(500).json({
      success: false,
      message: "Error fetching carousel images",
      error: error.message,
    });
  }
};

// Add new carousel image (Admin only)
export const addCarouselImage = async (req, res) => {
  try {
    const { title, description, order } = req.body;
    const imagePath = req.file?.path;

    if (!title || !imagePath) {
      return res.status(400).json({
        success: false,
        message: "Title and image are required",
      });
    }

    // Upload image to Cloudinary
    const { secure_url, public_id } = await uploadImageOnCloudinary(
      imagePath,
      "carousel"
    );

    if (!secure_url) {
      return res.status(400).json({
        success: false,
        message: "Error uploading image",
      });
    }

    const carouselImage = new Carousel({
      title,
      description,
      imageUrl: secure_url,
      publicId: public_id,
      order: order || 0,
      user: req.user._id,
    });

    await carouselImage.save();

    res.status(201).json({
      success: true,
      message: "Carousel image added successfully",
      image: carouselImage,
    });
  } catch (error) {
    console.log(`addCarouselImage Error: ${error}`);
    res.status(500).json({
      success: false,
      message: "Error adding carousel image",
      error: error.message,
    });
  }
};

// Update carousel image (Admin only)
export const updateCarouselImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, order, isActive } = req.body;
    const imagePath = req.file?.path;

    const carouselImage = await Carousel.findById(id);
    if (!carouselImage) {
      return res.status(404).json({
        success: false,
        message: "Carousel image not found",
      });
    }

    // Update fields
    if (title) carouselImage.title = title;
    if (description !== undefined) carouselImage.description = description;
    if (order !== undefined) carouselImage.order = order;
    if (isActive !== undefined) carouselImage.isActive = isActive;

    // Handle new image upload
    if (imagePath) {
      // Upload new image
      const { secure_url, public_id } = await uploadImageOnCloudinary(
        imagePath,
        "carousel"
      );

      if (!secure_url) {
        return res.status(400).json({
          success: false,
          message: "Error uploading new image",
        });
      }

      // Delete old image
      if (carouselImage.publicId) {
        await deleteImageFromCloudinary(carouselImage.publicId);
      }

      carouselImage.imageUrl = secure_url;
      carouselImage.publicId = public_id;
    }

    await carouselImage.save();

    res.status(200).json({
      success: true,
      message: "Carousel image updated successfully",
      image: carouselImage,
    });
  } catch (error) {
    console.log(`updateCarouselImage Error: ${error}`);
    res.status(500).json({
      success: false,
      message: "Error updating carousel image",
      error: error.message,
    });
  }
};

// Delete carousel image (Admin only)
export const deleteCarouselImage = async (req, res) => {
  try {
    const { id } = req.params;

    const carouselImage = await Carousel.findById(id);
    if (!carouselImage) {
      return res.status(404).json({
        success: false,
        message: "Carousel image not found",
      });
    }

    // Delete image from Cloudinary
    if (carouselImage.publicId) {
      await deleteImageFromCloudinary(carouselImage.publicId);
    }

    await Carousel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Carousel image deleted successfully",
    });
  } catch (error) {
    console.log(`deleteCarouselImage Error: ${error}`);
    res.status(500).json({
      success: false,
      message: "Error deleting carousel image",
      error: error.message,
    });
  }
};

// Get all carousel images (Admin only)
export const getAllCarouselImages = async (req, res) => {
  try {
    const images = await Carousel.find({})
      .sort({ order: 1, createdAt: -1 })
      .populate("user", "name");

    res.status(200).json({
      success: true,
      message: "All carousel images fetched successfully",
      images,
    });
  } catch (error) {
    console.log(`getAllCarouselImages Error: ${error}`);
    res.status(500).json({
      success: false,
      message: "Error fetching carousel images",
      error: error.message,
    });
  }
}; 