import express from "express";
import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// GET all answers for a question - public
router.get("/question/:questionId", optionalAuth, async (req, res) => {
  try {
    const { sort = "-votes" } = req.query;

    const answers = await Answer.find({ question: req.params.questionId })
      .sort(sort)
      .populate("author", "username email");

    res.json({
      count: answers.length,
      answers,
    });
  } catch (error) {
    console.error("Get answers error:", error);
    res.status(500).json({ error: "Failed to retrieve answers" });
  }
});

// POST create new answer - requires auth
router.post("/", requireAuth, async (req, res) => {
  try {
    const { content, questionId } = req.body;

    if (!content || !questionId) {
      return res.status(400).json({
        error: "Content and questionId are required",
      });
    }

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const answer = new Answer({
      content,
      question: questionId,
      author: req.user._id,
    });

    await answer.save();
    await answer.populate("author", "username email");

    // Update question answer count
    await question.updateAnswerCount();

    res.status(201).json({
      message: "Answer created successfully",
      answer,
    });
  } catch (error) {
    console.error("Create answer error:", error);
    res.status(500).json({ error: "Failed to create answer" });
  }
});

// PUT update answer - requires auth and ownership
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    // Check ownership
    if (answer.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "You do not have permission to edit this answer",
      });
    }

    const { content } = req.body;
    if (content) answer.content = content;

    await answer.save();
    await answer.populate("author", "username email");

    res.json({
      message: "Answer updated successfully",
      answer,
    });
  } catch (error) {
    console.error("Update answer error:", error);
    res.status(500).json({ error: "Failed to update answer" });
  }
});

// DELETE answer - requires auth and ownership
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    // Check ownership
    if (answer.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "You do not have permission to delete this answer",
      });
    }

    const questionId = answer.question;
    await answer.deleteOne();

    // Update question answer count
    const question = await Question.findById(questionId);
    if (question) {
      await question.updateAnswerCount();
    }

    res.json({
      message: "Answer deleted successfully",
      answerId: req.params.id,
    });
  } catch (error) {
    console.error("Delete answer error:", error);
    res.status(500).json({ error: "Failed to delete answer" });
  }
});

// POST vote on answer - requires auth
router.post("/:id/vote", requireAuth, async (req, res) => {
  try {
    const { voteType } = req.body; // 'up' or 'down'
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    const userId = req.user._id;
    const hasUpvoted = answer.upvotedBy.includes(userId);
    const hasDownvoted = answer.downvotedBy.includes(userId);

    if (voteType === "up") {
      if (hasUpvoted) {
        // Remove upvote
        answer.upvotedBy.pull(userId);
        answer.votes -= 1;
      } else {
        // Add upvote
        answer.upvotedBy.push(userId);
        answer.votes += 1;
        // Remove downvote if exists
        if (hasDownvoted) {
          answer.downvotedBy.pull(userId);
          answer.votes += 1;
        }
      }
    } else if (voteType === "down") {
      if (hasDownvoted) {
        // Remove downvote
        answer.downvotedBy.pull(userId);
        answer.votes += 1;
      } else {
        // Add downvote
        answer.downvotedBy.push(userId);
        answer.votes -= 1;
        // Remove upvote if exists
        if (hasUpvoted) {
          answer.upvotedBy.pull(userId);
          answer.votes -= 1;
        }
      }
    } else {
      return res.status(400).json({ error: "Invalid vote type" });
    }

    await answer.save();

    res.json({
      message: "Vote recorded",
      votes: answer.votes,
      userVote: answer.upvotedBy.includes(userId)
        ? "up"
        : answer.downvotedBy.includes(userId)
          ? "down"
          : null,
    });
  } catch (error) {
    console.error("Vote answer error:", error);
    res.status(500).json({ error: "Failed to vote on answer" });
  }
});

// POST accept answer - requires auth (question author only)
router.post("/:id/accept", requireAuth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id).populate("question");

    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    const question = await Question.findById(answer.question);

    // Check if user is the question author
    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "Only the question author can accept an answer",
      });
    }

    // Remove acceptance from other answers
    await Answer.updateMany(
      { question: question._id, _id: { $ne: answer._id } },
      { isAccepted: false },
    );

    // Toggle acceptance
    answer.isAccepted = !answer.isAccepted;
    await answer.save();

    // Update question status
    if (answer.isAccepted) {
      question.status = "answered";
    } else {
      // Check if there are other accepted answers
      const hasAcceptedAnswer = await Answer.findOne({
        question: question._id,
        isAccepted: true,
      });
      if (!hasAcceptedAnswer) {
        question.status = "open";
      }
    }
    await question.save();

    res.json({
      message: answer.isAccepted ? "Answer accepted" : "Answer unaccepted",
      isAccepted: answer.isAccepted,
    });
  } catch (error) {
    console.error("Accept answer error:", error);
    res.status(500).json({ error: "Failed to accept answer" });
  }
});

export default router;
