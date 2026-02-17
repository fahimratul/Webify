import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Template title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Template content
    html: {
      type: String,
      required: [true, "HTML content is required"],
    },
    css: {
      type: String,
      default: "",
    },
    // Pricing
    type: {
      type: String,
      enum: ["free", "paid"],
      default: "free",
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    // Categorization
    category: {
      type: String,
      enum: ["dashboard", "portfolio", "webpage", "other"],
      default: "webpage",
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    // Preview image URL
    image: {
      type: String,
      default: "",
    },
    // Stats
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    // Users who liked this template
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Users who rated this template
    ratedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
    ],
    // Users who purchased this template (for paid templates)
    purchasedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        purchasedAt: {
          type: Date,
          default: Date.now,
        },
        transactionId: {
          type: String,
        },
      },
    ],
    // Status
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and filtering
TemplateSchema.index({ title: "text", description: "text" });
TemplateSchema.index({ category: 1 });
TemplateSchema.index({ type: 1 });
TemplateSchema.index({ createdAt: -1 });
TemplateSchema.index({ downloads: -1 });
TemplateSchema.index({ likes: -1 });
TemplateSchema.index({ rating: -1 });

const Template = mongoose.model("Template", TemplateSchema);

export default Template;
