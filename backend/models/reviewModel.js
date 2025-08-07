import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: false,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    images: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    helpful: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        helpful: {
          type: Boolean,
          default: true,
        },
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
    adminReply: {
      text: { type: String, trim: true },
      date: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

// Prevent multiple reviews from same user for same product
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

// Calculate average rating for product
reviewSchema.statics.getAverageRating = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { productId: productId },
    },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      numOfReviews: stats[0].numOfReviews,
    });
  } else {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      averageRating: 0,
      numOfReviews: 0,
    });
  }
};

// Call getAverageRating after save
reviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.productId);
});

// Call getAverageRating before remove
reviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.productId);
});

export default mongoose.model("Review", reviewSchema); 