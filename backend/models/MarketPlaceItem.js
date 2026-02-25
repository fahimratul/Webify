import mongoose from "mongoose";
const { Schema, model } = mongoose;

const MarketplaceItemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, default: "webpage" },
    isPremium: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    html: { type: String }, // full HTML from builder
    css: { type: String }, // full CSS from builder
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    published: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    ratedBy: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
    likes: { type: Number, default: 0 },
    likedBy: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default model("MarketplaceItem", MarketplaceItemSchema);
