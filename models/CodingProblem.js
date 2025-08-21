const mongoose = require("mongoose")

const codingProblemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    platform: {
      type: String,
      required: true,
      enum: ["LeetCode", "HackerRank", "CodeChef", "Codeforces", "GeeksforGeeks", "InterviewBit", "Other"],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["todo", "attempted", "solved"],
      default: "todo",
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    solvedDate: {
      type: Date,
    },
    lastAttemptDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
    solution: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
codingProblemSchema.index({ user: 1, status: 1 })
codingProblemSchema.index({ user: 1, difficulty: 1 })
codingProblemSchema.index({ user: 1, platform: 1 })

module.exports = mongoose.model("CodingProblem", codingProblemSchema)
