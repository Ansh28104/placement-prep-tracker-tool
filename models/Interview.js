const mongoose = require("mongoose")

const interviewSchema = new mongoose.Schema(
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
    type: {
      type: String,
      required: true,
      enum: ["technical", "behavioral", "system-design", "hr", "final"],
    },
    mode: {
      type: String,
      required: true,
      enum: ["in-person", "video", "phone"],
    },
    interviewer: {
      type: String,
      required: true,
      trim: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 15,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "rescheduled"],
      default: "scheduled",
    },
    result: {
      type: String,
      enum: ["passed", "failed", "pending"],
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    preparationTime: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    questions: [
      {
        question: String,
        answer: String,
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
        },
      },
    ],
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    followUpActions: [
      {
        action: String,
        completed: {
          type: Boolean,
          default: false,
        },
        dueDate: Date,
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
interviewSchema.index({ user: 1, scheduledDate: 1 })
interviewSchema.index({ user: 1, status: 1 })
interviewSchema.index({ user: 1, company: 1 })

module.exports = mongoose.model("Interview", interviewSchema)
