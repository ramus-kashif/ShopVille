import Review from "../models/reviewModel.js";
import Product from "../models/productsModel.js";
import { uploadImageOnCloudinary } from "../helper/cloudinaryHelper.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/error.js";

// Create new review => /api/v1/review
export const newReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, title, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    title,
    comment,
    productId,
  };

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    productId,
    userId: req.user._id,
  });

  if (existingReview) {
    return next(new ErrorHandler("You have already reviewed this product", 400));
  }

  // Handle image uploads if any
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) => uploadImageOnCloudinary(file.path, "reviews"));
    const uploadResults = await Promise.all(uploadPromises);
    
    review.images = uploadResults.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));
  }

  const newReview = await Review.create({
    ...review,
    userId: req.user._id,
  });

  res.status(201).json({
    success: true,
    review: newReview,
  });
});

// Get product reviews => /api/v1/reviews
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const reviews = await Review.find({ productId })
    .populate("userId", "name avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalReviews = await Review.countDocuments({ productId });

  res.status(200).json({
    success: true,
    reviews,
    totalReviews,
    currentPage: page,
    totalPages: Math.ceil(totalReviews / limit),
  });
});

// Get single review => /api/v1/review/:id
export const getSingleReview = catchAsyncErrors(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate(
    "userId",
    "name avatar"
  );

  if (!review) {
    return next(new ErrorHandler("Review not found", 404));
  }

  res.status(200).json({
    success: true,
    review,
  });
});

// Update review => /api/v1/review/:id
export const updateReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, title, comment } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorHandler("Review not found", 404));
  }

  // Check if user owns the review
  if (review.userId.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("You can only update your own reviews", 403));
  }

  // Handle new image uploads
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) => uploadImageOnCloudinary(file.path, "reviews"));
    const uploadResults = await Promise.all(uploadPromises);
    
    const newImages = uploadResults.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));

    review.images = [...review.images, ...newImages];
  }

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();

  res.status(200).json({
    success: true,
    review,
  });
});

// Delete review => /api/v1/review/:id
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorHandler("Review not found", 404));
  }

  // Check if user owns the review or is admin
  if (review.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return next(new ErrorHandler("You can only delete your own reviews", 403));
  }

  await review.remove();

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

// Mark review as helpful => /api/v1/review/:id/helpful
export const markHelpful = catchAsyncErrors(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorHandler("Review not found", 404));
  }

  const existingHelpful = review.helpful.find(
    (h) => h.userId.toString() === req.user._id.toString()
  );

  if (existingHelpful) {
    // Remove helpful mark
    review.helpful = review.helpful.filter(
      (h) => h.userId.toString() !== req.user._id.toString()
    );
  } else {
    // Add helpful mark
    review.helpful.push({
      userId: req.user._id,
      helpful: true,
    });
  }

  await review.save();

  res.status(200).json({
    success: true,
    helpfulCount: review.helpful.length,
    isHelpful: !existingHelpful,
  });
});

// Get user's reviews => /api/v1/reviews/me
export const getMyReviews = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const reviews = await Review.find({ userId: req.user._id })
    .populate("productId", "title picture")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalReviews = await Review.countDocuments({ userId: req.user._id });

  res.status(200).json({
    success: true,
    reviews,
    totalReviews,
    currentPage: page,
    totalPages: Math.ceil(totalReviews / limit),
  });
});

// Get all reviews (admin) => /api/v1/admin/reviews
export const getAllReviews = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const reviews = await Review.find()
    .populate("userId", "name email")
    .populate("productId", "title")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalReviews = await Review.countDocuments();

  res.status(200).json({
    success: true,
    reviews,
    totalReviews,
    currentPage: page,
    totalPages: Math.ceil(totalReviews / limit),
  });
});

// Verify review (admin) => /api/v1/admin/review/:id/verify
export const verifyReview = catchAsyncErrors(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorHandler("Review not found", 404));
  }

  review.verified = !review.verified;
  await review.save();

  res.status(200).json({
    success: true,
    review,
  });
}); 