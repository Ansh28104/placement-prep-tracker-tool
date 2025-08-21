const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["applied", "screening", "interview", "offer", "rejected"],
      default: "applied",
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
    nextStep: {
      type: String,
      trim: true,
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      default: "full-time",
    },
    applicationUrl: {
      type: String,
      trim: true,
    },
    referral: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
applicationSchema.index({ user: 1, company: 1 })
applicationSchema.index({ user: 1, status: 1 })

module.exports = mongoose.model("Application", applicationSchema)
