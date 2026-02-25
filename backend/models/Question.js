import mongoose from "mongoose";

// Question schema for community Q&A
const QuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Question title is required"],
      trim: true,
      minlength: [10, "Title must be at least 10 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    body: {
      type: String,
      required: [true, "Question body is required"],
      minlength: [20, "Question must be at least 20 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    votes: {
      type: Number,
      default: 0,
    },
    votedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        voteType: {
          type: String,
          enum: ["up", "down"],
        },
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    answers: [
      {
        body: {
          type: String,
          required: true,
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        votes: {
          type: Number,
          default: 0,
        },
        votedBy: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            voteType: {
              type: String,
              enum: ["up", "down"],
            },
          },
        ],
        isAccepted: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isAnswered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
QuestionSchema.index({ title: "text", body: "text" });
QuestionSchema.index({ tags: 1 });
QuestionSchema.index({ createdAt: -1 });

const Question = mongoose.model("Question", QuestionSchema);

export default Question;
