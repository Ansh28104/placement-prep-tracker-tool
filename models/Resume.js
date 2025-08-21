const mongoose = require("mongoose")

const resumeSchema = new mongoose.Schema(
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
    version: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["master", "tailored", "template"],
    },
    targetRole: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "draft",
    },
    fileUrl: {
      type: String,
      trim: true,
    },
    fileSize: {
      type: String,
      trim: true,
    },
    format: {
      type: String,
      enum: ["PDF", "DOC", "DOCX"],
      default: "PDF",
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    feedback: [
      {
        reviewer: String,
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
    sections: {
      personalInfo: {
        name: String,
        email: String,
        phone: String,
        location: String,
        linkedin: String,
        github: String,
        portfolio: String,
      },
      summary: String,
      experience: [
        {
          company: String,
          position: String,
          location: String,
          startDate: Date,
          endDate: Date,
          current: Boolean,
          description: String,
        },
      ],
      education: [
        {
          institution: String,
          degree: String,
          field: String,
          startDate: Date,
          endDate: Date,
          gpa: String,
          location: String,
        },
      ],
      skills: [
        {
          category: String,
          items: [String],
        },
      ],
      projects: [
        {
          name: String,
          description: String,
          technologies: [String],
          url: String,
          github: String,
          startDate: Date,
          endDate: Date,
        },
      ],
      certifications: [
        {
          name: String,
          issuer: String,
          date: Date,
          url: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  },
)

// Calculate average rating
resumeSchema.virtual("averageRating").get(function () {
  if (this.feedback.length === 0) return 0
  const sum = this.feedback.reduce((acc, fb) => acc + fb.rating, 0)
  return Math.round((sum / this.feedback.length) * 10) / 10
})

// Index for better query performance
resumeSchema.index({ user: 1, status: 1 })
resumeSchema.index({ user: 1, type: 1 })

module.exports = mongoose.model("Resume", resumeSchema)
