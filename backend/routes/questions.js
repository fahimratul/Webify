import express from "express";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// GET all questions - public, no auth required
router.get("/", optionalAuth, async (req, res) => {
  try {
    const {
      tag,
      sort = "-createdAt",
      search,
      status,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    // Filter by tag
    if (tag) {
      query.tags = tag;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search in title and content
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const questions = await Question.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .populate("author", "username email")
      .select("-upvotedBy -downvotedBy -followers");

    const total = await Question.countDocuments(query);

    res.json({
      questions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get questions error:", error);
    res.status(500).json({ error: "Failed to retrieve questions" });
  }
});

// GET single question by ID - public
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate(
      "author",
      "username email",
    );

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Increment view count
    await question.incrementViews();

    res.json({ question });
  } catch (error) {
    console.error("Get question error:", error);
    res.status(500).json({ error: "Failed to retrieve question" });
  }
});

// POST create new question - requires auth
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: "Title and content are required",
      });
    }

    const question = new Question({
      title,
      content,
      author: req.user._id,
      tags: tags || [],
    });

    await question.save();
    await question.populate("author", "username email");

    res.status(201).json({
      message: "Question created successfully",
      question,
    });
  } catch (error) {
    console.error("Create question error:", error);
    res.status(500).json({ error: "Failed to create question" });
  }
});

// PUT update question - requires auth and ownership
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Check ownership
    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "You do not have permission to edit this question",
      });
    }

    const { title, content, tags, status } = req.body;

    if (title) question.title = title;
    if (content) question.content = content;
    if (tags) question.tags = tags;
    if (status) question.status = status;

    await question.save();
    await question.populate("author", "username email");

    res.json({
      message: "Question updated successfully",
      question,
    });
  } catch (error) {
    console.error("Update question error:", error);
    res.status(500).json({ error: "Failed to update question" });
  }
});

// DELETE question - requires auth and ownership
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Check ownership
    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "You do not have permission to delete this question",
      });
    }

    // Delete all answers for this question
    await Answer.deleteMany({ question: question._id });

    await question.deleteOne();

    res.json({
      message: "Question deleted successfully",
      questionId: req.params.id,
    });
  } catch (error) {
    console.error("Delete question error:", error);
    res.status(500).json({ error: "Failed to delete question" });
  }
});

// POST vote on question - requires auth
router.post("/:id/vote", requireAuth, async (req, res) => {
  try {
    const { voteType } = req.body; // 'up' or 'down'
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const userId = req.user._id;
    const hasUpvoted = question.upvotedBy.includes(userId);
    const hasDownvoted = question.downvotedBy.includes(userId);

    if (voteType === "up") {
      if (hasUpvoted) {
        // Remove upvote
        question.upvotedBy.pull(userId);
        question.votes -= 1;
      } else {
        // Add upvote
        question.upvotedBy.push(userId);
        question.votes += 1;
        // Remove downvote if exists
        if (hasDownvoted) {
          question.downvotedBy.pull(userId);
          question.votes += 1; // Remove the -1 from downvote
        }
      }
    } else if (voteType === "down") {
      if (hasDownvoted) {
        // Remove downvote
        question.downvotedBy.pull(userId);
        question.votes += 1;
      } else {
        // Add downvote
        question.downvotedBy.push(userId);
        question.votes -= 1;
        // Remove upvote if exists
        if (hasUpvoted) {
          question.upvotedBy.pull(userId);
          question.votes -= 1; // Remove the +1 from upvote
        }
      }
    } else {
      return res.status(400).json({ error: "Invalid vote type" });
    }

    await question.save();

    res.json({
      message: "Vote recorded",
      votes: question.votes,
      userVote: question.upvotedBy.includes(userId)
        ? "up"
        : question.downvotedBy.includes(userId)
          ? "down"
          : null,
    });
  } catch (error) {
    console.error("Vote question error:", error);
    res.status(500).json({ error: "Failed to vote on question" });
  }
});

// POST follow/unfollow question - requires auth
router.post("/:id/follow", requireAuth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const userId = req.user._id;
    const isFollowing = question.followers.includes(userId);

    if (isFollowing) {
      question.followers.pull(userId);
    } else {
      question.followers.push(userId);
    }

    await question.save();

    res.json({
      message: isFollowing ? "Unfollowed question" : "Following question",
      isFollowing: !isFollowing,
    });
  } catch (error) {
    console.error("Follow question error:", error);
    res.status(500).json({ error: "Failed to follow/unfollow question" });
  }
});

// GET all tags - public
router.get("/tags/all", async (req, res) => {
  try {
    // Aggregate to get unique tags with counts
    const tags = await Question.aggregate([
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 50 },
    ]);

    res.json({ tags });
  } catch (error) {
    console.error("Get tags error:", error);
    res.status(500).json({ error: "Failed to retrieve tags" });
  }
});

export default router;
