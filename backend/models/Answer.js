import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    // Question this answer belongs to
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },
    // Author of the answer
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Vote count (upvotes - downvotes)
    votes: {
      type: Number,
      default: 0,
    },
    // Users who upvoted
    upvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Users who downvoted
    downvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Is this the accepted answer?
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Index for sorting by votes
AnswerSchema.index({ votes: -1, createdAt: -1 });

const Answer = mongoose.model("Answer", AnswerSchema);

export default Answer;
