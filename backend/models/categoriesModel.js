import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase:true
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      lowercase:true
    },

  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
