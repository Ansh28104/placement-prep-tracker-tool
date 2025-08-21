const mongoose = require("mongoose")

const goalSchema = new mongoose.Schema(
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
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["applications", "coding", "aptitude", "interviews", "resume", "general"],
    },
    targetValue: {
      type: Number,
      required: true,
      min: 1,
    },
    currentValue: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: "count",
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "paused", "cancelled"],
      default: "active",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    milestones: [
      {
        value: Number,
        description: String,
        achieved: {
          type: Boolean,
          default: false,
        },
        achievedDate: Date,
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
    completedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Calculate progress percentage
goalSchema.virtual("progressPercentage").get(function () {
  return Math.min(Math.round((this.currentValue / this.targetValue) * 100), 100)
})

// Check if goal is overdue
goalSchema.virtual("isOverdue").get(function () {
  return this.deadline < new Date() && this.status !== "completed"
})

// Update status based on progress
goalSchema.methods.updateStatus = function () {
  if (this.currentValue >= this.targetValue) {
    this.status = "completed"
    this.completedDate = new Date()
  } else if (this.deadline < new Date()) {
    // Don't automatically mark as failed, let user decide
  }
}

// Index for better query performance
goalSchema.index({ user: 1, status: 1 })
goalSchema.index({ user: 1, category: 1 })
goalSchema.index({ user: 1, deadline: 1 })

module.exports = mongoose.model("Goal", goalSchema)
