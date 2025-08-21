const mongoose = require("mongoose")

const aptitudeTestSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
      enum: ["quantitative", "logical", "verbal", "general"],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    maxTime: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ["planned", "in-progress", "completed"],
      default: "planned",
    },
    completedDate: {
      type: Date,
    },
    topics: [
      {
        type: String,
        trim: true,
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
    questions: [
      {
        question: String,
        options: [String],
        correctAnswer: Number,
        userAnswer: Number,
        timeSpent: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Calculate score when test is completed
aptitudeTestSchema.methods.calculateScore = function () {
  if (this.totalQuestions > 0) {
    this.score = Math.round((this.correctAnswers / this.totalQuestions) * 100)
  }
}

// Index for better query performance
aptitudeTestSchema.index({ user: 1, category: 1 })
aptitudeTestSchema.index({ user: 1, status: 1 })

module.exports = mongoose.model("AptitudeTest", aptitudeTestSchema)
