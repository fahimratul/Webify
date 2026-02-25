import express from "express";
import Question from "../models/Question.js";
import User from "../models/User.js";

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

// GET /api/users/top-three - fetch top 3 users
router.get("/users/top-three", async (req, res) => {
  try {
    const users = await User.find({})
      .limit(3)
      .select("username email profilePicture bio phoneNumber createdAt");

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /api/questions - fetch questions with optional filters
router.get("/questions", async (req, res) => {
  try {
    const { tab = "newest", tag, sort = "newest", search } = req.query;
    let filter = {};

    if (tab === "unanswered") {
      filter.isAnswered = false;
    } else if (tab === "lastyear") {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      filter.createdAt = { $gte: oneYearAgo };
    }

    if (tag) {
      filter.tags = tag.toLowerCase();
    }

    if (search) {
      filter.$text = { $search: search };
    }

    let sortOption = {};
    if (sort === "newest") {
      sortOption = { createdAt: -1 };
    } else if (sort === "votes") {
      sortOption = { votes: -1 };
    } else if (sort === "views") {
      sortOption = { views: -1 };
    }

    if (tab === "trending") {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      filter.createdAt = { $gte: threeDaysAgo };
      sortOption = { votes: -1, views: -1 };
    }

    const questions = await Question.find(filter)
      .sort(sortOption)
      .populate("author", "username email profilePicture")
      .populate("answers.author", "username profilePicture")
      .limit(50)
      .lean();

    res.json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// GET /api/questions/:id - get question by ID and increment views
router.get("/questions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true },
    )
      .populate("author", "username email profilePicture")
      .populate("answers.author", "username email profilePicture");

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json({
      success: true,
      question,
    });
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ error: "Failed to fetch question" });
  }
});

// POST /api/questions - create new question (auth required)
router.post("/questions", isAuthenticated, async (req, res) => {
  try {
    const { title, body, tags } = req.body;

    if (!title || !title.trim() || !body || !body.trim()) {
      return res.status(400).json({ error: "Title and body are required" });
    }

    // Validate and sanitize tags
    let validatedTags = [];
    if (tags && Array.isArray(tags)) {
      validatedTags = tags
        .map((tag) => (typeof tag === "string" ? tag.trim().toLowerCase() : ""))
        .filter((tag) => tag.length > 0 && tag.length <= 20) // Remove empty and too long tags
        .filter((tag, index, self) => self.indexOf(tag) === index) // Remove duplicates
        .slice(0, 5); // Maximum 5 tags
    }

    const newQuestion = new Question({
      title,
      body,
      author: req.user._id,
      tags: validatedTags,
    });

    await newQuestion.save();
    await newQuestion.populate("author", "username email");

    res.status(201).json({
      success: true,
      message: "Question posted successfully",
      question: newQuestion,
    });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ error: "Failed to create question" });
  }
});

// POST /api/questions/:id/answers - add answer to question (auth required)
router.post("/questions/:id/answers", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;

    if (!body || !body.trim()) {
      return res.status(400).json({ error: "Answer body is required" });
    }

    // Find question and add answer
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    question.answers.push({
      body,
      author: req.user._id,
      createdAt: new Date(),
    });

    if (question.answers.length === 1) {
      question.isAnswered = true;
    }

    await question.save();
    await question.populate("author", "username email profilePicture");
    await question.populate("answers.author", "username email profilePicture");

    res.status(201).json({
      success: true,
      message: "Answer posted successfully",
      question,
    });
  } catch (error) {
    console.error("Error posting answer:", error);
    res.status(500).json({ error: "Failed to post answer" });
  }
});

// PUT /api/questions/:id/vote - vote on question (auth required)
router.put("/questions/:id/vote", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body;

    if (!["up", "down"].includes(voteType)) {
      return res.status(400).json({ error: "Invalid vote type" });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Check if user already voted
    const existingVote = question.votedBy.find(
      (vote) => vote.user.toString() === req.user._id.toString(),
    );

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        question.votedBy = question.votedBy.filter(
          (vote) => vote.user.toString() !== req.user._id.toString(),
        );
        question.votes += voteType === "up" ? -1 : 1;
      } else {
        existingVote.voteType = voteType;
        question.votes += voteType === "up" ? 2 : -2;
      }
    } else {
      question.votedBy.push({
        user: req.user._id,
        voteType,
      });
      question.votes += voteType === "up" ? 1 : -1;
    }

    await question.save();

    res.json({
      success: true,
      votes: question.votes,
      message: "Vote recorded",
    });
  } catch (error) {
    console.error("Error voting:", error);
    res.status(500).json({ error: "Failed to vote" });
  }
});

// PUT /api/questions/:questionId/answers/:answerId/vote - vote on answer (auth required)
router.put(
  "/questions/:questionId/answers/:answerId/vote",
  isAuthenticated,
  async (req, res) => {
    try {
      const { questionId, answerId } = req.params;
      const { voteType } = req.body;

      if (!["up", "down"].includes(voteType)) {
        return res.status(400).json({ error: "Invalid vote type" });
      }

      const question = await Question.findById(questionId);

      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      const answer = question.answers.id(answerId);

      if (!answer) {
        return res.status(404).json({ error: "Answer not found" });
      }

      const existingVote = answer.votedBy.find(
        (vote) => vote.user.toString() === req.user._id.toString(),
      );

      if (existingVote) {
        if (existingVote.voteType === voteType) {
          answer.votedBy = answer.votedBy.filter(
            (vote) => vote.user.toString() !== req.user._id.toString(),
          );
          answer.votes += voteType === "up" ? -1 : 1;
        } else {
          existingVote.voteType = voteType;
          answer.votes += voteType === "up" ? 2 : -2;
        }
      } else {
        // New vote
        answer.votedBy.push({
          user: req.user._id,
          voteType,
        });
        answer.votes += voteType === "up" ? 1 : -1;
      }

      await question.save();

      res.json({
        success: true,
        votes: answer.votes,
        message: "Vote recorded",
      });
    } catch (error) {
      console.error("Error voting on answer:", error);
      res.status(500).json({ error: "Failed to vote" });
    }
  },
);

// DELETE /api/questions/:id - delete question (auth required, author only)
router.delete("/questions/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (question.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You can only delete your own questions" });
    }

    await Question.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ error: "Failed to delete question" });
  }
});

export default router;
