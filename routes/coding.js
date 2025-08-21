const express = require("express")
const { body, validationResult } = require("express-validator")
const CodingProblem = require("../models/CodingProblem")
const auth = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/coding
// @desc    Get all coding problems for user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { status, difficulty, platform, category, page = 1, limit = 10, sort = "-createdAt" } = req.query

    const query = { user: req.user.id }

    if (status) query.status = status
    if (difficulty) query.difficulty = difficulty
    if (platform) query.platform = platform
    if (category) query.category = new RegExp(category, "i")

    const problems = await CodingProblem.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await CodingProblem.countDocuments(query)

    res.json({
      problems,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get coding problems error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/coding
// @desc    Create new coding problem
// @access  Private
router.post(
  "/",
  auth,
  [
    body("title").trim().notEmpty().withMessage("Problem title is required"),
    body("platform")
      .isIn(["LeetCode", "HackerRank", "CodeChef", "Codeforces", "GeeksforGeeks", "InterviewBit", "Other"])
      .withMessage("Invalid platform"),
    body("difficulty").isIn(["easy", "medium", "hard"]).withMessage("Invalid difficulty"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("tags").optional().isArray(),
    body("url").optional().isURL().withMessage("Invalid URL"),
    body("notes").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const problemData = {
        ...req.body,
        user: req.user.id,
      }

      const problem = new CodingProblem(problemData)
      await problem.save()

      res.status(201).json(problem)
    } catch (error) {
      console.error("Create coding problem error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// @route   PUT /api/coding/:id
// @desc    Update coding problem
// @access  Private
router.put(
  "/:id",
  auth,
  [
    body("title").optional().trim().notEmpty().withMessage("Problem title cannot be empty"),
    body("platform")
      .optional()
      .isIn(["LeetCode", "HackerRank", "CodeChef", "Codeforces", "GeeksforGeeks", "InterviewBit", "Other"]),
    body("difficulty").optional().isIn(["easy", "medium", "hard"]),
    body("status").optional().isIn(["todo", "attempted", "solved"]),
    body("timeSpent").optional().isInt({ min: 0 }),
    body("url").optional().isURL().withMessage("Invalid URL"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const problem = await CodingProblem.findOne({
        _id: req.params.id,
        user: req.user.id,
      })

      if (!problem) {
        return res.status(404).json({ message: "Problem not found" })
      }

      // Update solved date if status changed to solved
      if (req.body.status === "solved" && problem.status !== "solved") {
        req.body.solvedDate = new Date()
      }

      // Update last attempt date if status changed to attempted
      if (req.body.status === "attempted") {
        req.body.lastAttemptDate = new Date()
        req.body.attempts = (problem.attempts || 0) + 1
      }

      Object.assign(problem, req.body)
      await problem.save()

      res.json(problem)
    } catch (error) {
      console.error("Update coding problem error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// @route   DELETE /api/coding/:id
// @desc    Delete coding problem
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const problem = await CodingProblem.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" })
    }

    await CodingProblem.findByIdAndDelete(req.params.id)
    res.json({ message: "Problem deleted successfully" })
  } catch (error) {
    console.error("Delete coding problem error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/coding/stats
// @desc    Get coding statistics
// @access  Private
router.get("/stats", auth, async (req, res) => {
  try {
    const stats = await CodingProblem.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          solved: { $sum: { $cond: [{ $eq: ["$status", "solved"] }, 1, 0] } },
          attempted: { $sum: { $cond: [{ $eq: ["$status", "attempted"] }, 1, 0] } },
          todo: { $sum: { $cond: [{ $eq: ["$status", "todo"] }, 1, 0] } },
          totalTime: { $sum: "$timeSpent" },
          easy: {
            $sum: { $cond: [{ $and: [{ $eq: ["$difficulty", "easy"] }, { $eq: ["$status", "solved"] }] }, 1, 0] },
          },
          medium: {
            $sum: { $cond: [{ $and: [{ $eq: ["$difficulty", "medium"] }, { $eq: ["$status", "solved"] }] }, 1, 0] },
          },
          hard: {
            $sum: { $cond: [{ $and: [{ $eq: ["$difficulty", "hard"] }, { $eq: ["$status", "solved"] }] }, 1, 0] },
          },
        },
      },
    ])

    const result = stats[0] || {
      total: 0,
      solved: 0,
      attempted: 0,
      todo: 0,
      totalTime: 0,
      easy: 0,
      medium: 0,
      hard: 0,
    }

    res.json(result)
  } catch (error) {
    console.error("Get coding stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
