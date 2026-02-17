import express from "express";
import Template from "../models/Template.js";

const router = express.Router();

// Auth middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "You must be logged in to perform this action" });
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
    const template = await Template.findById(req.params.id)
      .populate("author", "username profilePicture email");

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
    const { title, description, html, css, type, price, category, tags, image } = req.body;

    if (!title || !html) {
      return res.status(400).json({ error: "Title and HTML content are required" });
    }

    // Validate price for paid templates
    if (type === "paid" && (!price || price <= 0)) {
      return res.status(400).json({ error: "Paid templates must have a valid price" });
    }

    const template = new Template({
      title,
      description: description || "",
      html,
      css: css || "",
      type: type || "free",
      price: type === "paid" ? price : 0,
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
      return res.status(403).json({ error: "You can only edit your own templates" });
    }

    const { title, description, html, css, type, price, category, tags, image, isPublished } = req.body;

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
      return res.status(403).json({ error: "You can only delete your own templates" });
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

export default router;
