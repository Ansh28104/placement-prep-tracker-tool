const express = require("express")
const { body, validationResult } = require("express-validator")
const Application = require("../models/Application")
const auth = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/applications
// @desc    Get all applications for user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { status, company, page = 1, limit = 10, sort = "-createdAt" } = req.query

    const query = { user: req.user.id }

    if (status) query.status = status
    if (company) query.company = new RegExp(company, "i")

    const applications = await Application.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Application.countDocuments(query)

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get applications error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/applications
// @desc    Create new application
// @access  Private
router.post(
  "/",
  auth,
  [
    body("company").trim().notEmpty().withMessage("Company name is required"),
    body("position").trim().notEmpty().withMessage("Position is required"),
    body("location").trim().notEmpty().withMessage("Location is required"),
    body("status").optional().isIn(["applied", "screening", "interview", "offer", "rejected"]),
    body("salary").optional().trim(),
    body("deadline").optional().isISO8601().withMessage("Invalid deadline date"),
    body("notes").optional().trim(),
    body("nextStep").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const applicationData = {
        ...req.body,
        user: req.user.id,
      }

      const application = new Application(applicationData)
      await application.save()

      res.status(201).json(application)
    } catch (error) {
      console.error("Create application error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// @route   PUT /api/applications/:id
// @desc    Update application
// @access  Private
router.put(
  "/:id",
  auth,
  [
    body("company").optional().trim().notEmpty().withMessage("Company name cannot be empty"),
    body("position").optional().trim().notEmpty().withMessage("Position cannot be empty"),
    body("location").optional().trim().notEmpty().withMessage("Location cannot be empty"),
    body("status").optional().isIn(["applied", "screening", "interview", "offer", "rejected"]),
    body("deadline").optional().isISO8601().withMessage("Invalid deadline date"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const application = await Application.findOne({
        _id: req.params.id,
        user: req.user.id,
      })

      if (!application) {
        return res.status(404).json({ message: "Application not found" })
      }

      Object.assign(application, req.body)
      await application.save()

      res.json(application)
    } catch (error) {
      console.error("Update application error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// @route   DELETE /api/applications/:id
// @desc    Delete application
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    await Application.findByIdAndDelete(req.params.id)
    res.json({ message: "Application deleted successfully" })
  } catch (error) {
    console.error("Delete application error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/applications/stats
// @desc    Get application statistics
// @access  Private
router.get("/stats", auth, async (req, res) => {
  try {
    const stats = await Application.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    const total = await Application.countDocuments({ user: req.user.id })

    const formattedStats = {
      total,
      applied: 0,
      screening: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    }

    stats.forEach((stat) => {
      formattedStats[stat._id] = stat.count
    })

    res.json(formattedStats)
  } catch (error) {
    console.error("Get application stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
