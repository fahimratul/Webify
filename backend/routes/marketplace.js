import express from "express";
import Template from "../models/Template.js";

const router = express.Router();

// Auth middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res
    .status(401)
    .json({ error: "You must be logged in to perform this action" });
};

// Optional auth - doesn't block, just attaches user if logged in
const optionalAuth = (req, res, next) => {
  next();
};

// ============================================================
// CRUD OPERATIONS
// ============================================================

// GET /api/marketplace/templates - Get all templates with filters
router.get("/templates", optionalAuth, async (req, res) => {
  try {
    const {
      category,
      type,
      search,
      sort = "newest",
      page = 1,
      limit = 20,
    } = req.query;

    const query = { isPublished: true };

    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    // Filter by type (free/paid)
    if (type && type !== "all") {
      if (type === "premium") {
        query.type = "paid";
      } else {
        query.type = type;
      }
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "popular":
        sortOption = { downloads: -1 };
        break;
      case "rating":
        sortOption = { rating: -1 };
        break;
      case "likes":
        sortOption = { likes: -1 };
        break;
      case "price-low":
        sortOption = { price: 1 };
        break;
      case "price-high":
        sortOption = { price: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const templates = await Template.find(query)
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip(skip)
      .populate("author", "username profilePicture")
      .select("-html -css -purchasedBy -ratedBy");

    const total = await Template.countDocuments(query);

    res.json({
      success: true,
      templates,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get templates error:", error);
    res.status(500).json({ error: "Failed to retrieve templates" });
  }
});

// GET /api/marketplace/templates/:id - Get single template by ID
router.get("/templates/:id", optionalAuth, async (req, res) => {
  try {
    const template = await Template.findById(req.params.id).populate(
      "author",
      "username profilePicture email",
    );

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    res.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error("Get template error:", error);
    res.status(500).json({ error: "Failed to retrieve template" });
  }
});

// POST /api/marketplace/templates - Create a new template (auth required)
router.post("/templates", isAuthenticated, async (req, res) => {
  try {
    const {
      title,
      description,
      html,
      css,
      type: rawType,
      isPremium,
      price,
      category,
      tags,
      image,
    } = req.body;

    // Support both old format (isPremium: true/false) and new format (type: "paid"/"free")
    const type = rawType || (isPremium ? "paid" : "free");

    if (!title || !html) {
      return res
        .status(400)
        .json({ error: "Title and HTML content are required" });
    }

    // Validate price for paid templates
    if (type === "paid" && (!price || price <= 0)) {
      return res
        .status(400)
        .json({ error: "Paid templates must have a valid price" });
    }

    const template = new Template({
      title,
      description: description || "",
      html,
      css: css || "",
      type: type || "free",
      price: type === "paid" ? parseFloat(price) : 0,
      category: category || "webpage",
      tags: tags || [],
      image: image || "",
      author: req.user._id,
    });

    await template.save();
    await template.populate("author", "username profilePicture");

    res.status(201).json({
      success: true,
      message: "Template created successfully",
      template,
    });
  } catch (error) {
    console.error("Create template error:", error);
    res.status(500).json({ error: "Failed to create template" });
  }
});

// PUT /api/marketplace/templates/:id - Update a template (auth + ownership)
router.put("/templates/:id", isAuthenticated, async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    // Check ownership
    if (template.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You can only edit your own templates" });
    }

    const {
      title,
      description,
      html,
      css,
      type,
      price,
      category,
      tags,
      image,
      isPublished,
    } = req.body;

    if (title) template.title = title;
    if (description !== undefined) template.description = description;
    if (html) template.html = html;
    if (css !== undefined) template.css = css;
    if (type) template.type = type;
    if (price !== undefined) template.price = type === "paid" ? price : 0;
    if (category) template.category = category;
    if (tags) template.tags = tags;
    if (image !== undefined) template.image = image;
    if (isPublished !== undefined) template.isPublished = isPublished;

    await template.save();
    await template.populate("author", "username profilePicture");

    res.json({
      success: true,
      message: "Template updated successfully",
      template,
    });
  } catch (error) {
    console.error("Update template error:", error);
    res.status(500).json({ error: "Failed to update template" });
  }
});

// DELETE /api/marketplace/templates/:id - Delete a template (auth + ownership)
router.delete("/templates/:id", isAuthenticated, async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    // Check ownership
    if (template.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You can only delete your own templates" });
    }

    await template.deleteOne();

    res.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("Delete template error:", error);
    res.status(500).json({ error: "Failed to delete template" });
  }
});

// GET /api/marketplace/my-templates - Get current user's templates
router.get("/my-templates", isAuthenticated, async (req, res) => {
  try {
    const templates = await Template.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .populate("author", "username profilePicture");

    res.json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error("Get my templates error:", error);
    res.status(500).json({ error: "Failed to retrieve your templates" });
  }
});

// ============================================================
// INTERACTIONS: Like, Rate, Download, Purchase
// ============================================================

// POST /api/marketplace/templates/:id/like - Toggle like on a template
router.post("/templates/:id/like", isAuthenticated, async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    const userId = req.user._id;
    const hasLiked = template.likedBy.includes(userId);

    if (hasLiked) {
      // Unlike
      template.likedBy.pull(userId);
      template.likes -= 1;
    } else {
      // Like
      template.likedBy.push(userId);
      template.likes += 1;
    }

    await template.save();

    res.json({
      success: true,
      liked: !hasLiked,
      likes: template.likes,
    });
  } catch (error) {
    console.error("Like template error:", error);
    res.status(500).json({ error: "Failed to like template" });
  }
});

// POST /api/marketplace/templates/:id/rate - Rate a template (1-5)
router.post("/templates/:id/rate", isAuthenticated, async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    const userId = req.user._id;
    const existingRating = template.ratedBy.find(
      (r) => r.user.toString() === userId.toString(),
    );

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
    } else {
      // Add new rating
      template.ratedBy.push({ user: userId, rating });
      template.ratingCount += 1;
    }

    // Recalculate average rating
    const totalRating = template.ratedBy.reduce((sum, r) => sum + r.rating, 0);
    template.rating =
      Math.round((totalRating / template.ratedBy.length) * 10) / 10;

    await template.save();

    res.json({
      success: true,
      rating: template.rating,
      ratingCount: template.ratingCount,
      userRating: rating,
    });
  } catch (error) {
    console.error("Rate template error:", error);
    res.status(500).json({ error: "Failed to rate template" });
  }
});

// POST /api/marketplace/templates/:id/download - Download a template (increments count)
router.post("/templates/:id/download", async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    // For paid templates, check if user has purchased
    if (template.type === "paid") {
      if (!req.isAuthenticated()) {
        return res
          .status(401)
          .json({ error: "You must be logged in to download paid templates" });
      }

      const hasPurchased = template.purchasedBy.some(
        (p) => p.user.toString() === req.user._id.toString(),
      );

      if (!hasPurchased) {
        return res.status(403).json({
          error: "You must purchase this template before downloading",
        });
      }
    }

    // Increment download count
    template.downloads += 1;
    await template.save();

    // Return the template content for download
    res.json({
      success: true,
      template: {
        title: template.title,
        html: template.html,
        css: template.css,
      },
      downloads: template.downloads,
    });
  } catch (error) {
    console.error("Download template error:", error);
    res.status(500).json({ error: "Failed to download template" });
  }
});

// POST /api/marketplace/templates/:id/purchase - Purchase a paid template
router.post("/templates/:id/purchase", isAuthenticated, async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    if (template.type !== "paid") {
      return res
        .status(400)
        .json({ error: "This template is free, no purchase needed" });
    }

    const userId = req.user._id;

    // Check if already purchased
    const alreadyPurchased = template.purchasedBy.some(
      (p) => p.user.toString() === userId.toString(),
    );

    if (alreadyPurchased) {
      return res
        .status(400)
        .json({ error: "You have already purchased this template" });
    }

    // Generate transaction ID
    const transactionId =
      "TXN-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);

    // Record purchase
    template.purchasedBy.push({
      user: userId,
      purchasedAt: new Date(),
      transactionId,
    });

    await template.save();

    res.json({
      success: true,
      message: "Purchase successful",
      transactionId,
      template: {
        title: template.title,
        price: template.price,
      },
    });
  } catch (error) {
    console.error("Purchase template error:", error);
    res.status(500).json({ error: "Failed to purchase template" });
  }
});

// Alias: /api/marketplace/items -> same as /api/marketplace/templates (backward compatibility)
router.post("/items", isAuthenticated, async (req, res) => {
  // Redirect internally to the /templates route handler
  try {
    const {
      title,
      description,
      html,
      css,
      type: rawType,
      isPremium,
      price,
      category,
      tags,
      image,
    } = req.body;

    const type = rawType || (isPremium ? "paid" : "free");

    if (!title || !html) {
      return res
        .status(400)
        .json({ error: "Title and HTML content are required" });
    }

    if (type === "paid" && (!price || price <= 0)) {
      return res
        .status(400)
        .json({ error: "Paid templates must have a valid price" });
    }

    const template = new Template({
      title,
      description: description || "",
      html,
      css: css || "",
      type: type || "free",
      price: type === "paid" ? parseFloat(price) : 0,
      category: category || "webpage",
      tags: tags || [],
      image: image || "",
      author: req.user._id,
    });

    await template.save();
    await template.populate("author", "username profilePicture");

    res.status(201).json({
      success: true,
      message: "Template created successfully",
      template,
    });
  } catch (error) {
    console.error("Create template (items alias) error:", error);
    res.status(500).json({ error: "Failed to create template" });
  }
});

export default router;
