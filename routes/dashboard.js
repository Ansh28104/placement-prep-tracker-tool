const express = require("express")
const Application = require("../models/Application")
const CodingProblem = require("../models/CodingProblem")
const AptitudeTest = require("../models/AptitudeTest")
const Interview = require("../models/Interview")
const Goal = require("../models/Goal")
const auth = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get("/stats", auth, async (req, res) => {
  try {
    // Get application stats
    const applicationStats = await Application.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    // Get coding stats
    const codingStats = await CodingProblem.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    // Get interview stats
    const interviewStats = await Interview.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    // Get aptitude stats
    const aptitudeStats = await AptitudeTest.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          avgScore: { $avg: "$score" },
        },
      },
    ])

    // Get goal stats
    const goalStats = await Goal.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    // Format stats
    const formatStats = (stats) => {
      const result = {}
      stats.forEach((stat) => {
        result[stat._id] = stat.count
      })
      return result
    }

    const dashboardStats = {
      applications: {
        total: applicationStats.reduce((sum, stat) => sum + stat.count, 0),
        ...formatStats(applicationStats),
      },
      coding: {
        total: codingStats.reduce((sum, stat) => sum + stat.count, 0),
        ...formatStats(codingStats),
      },
      interviews: {
        total: interviewStats.reduce((sum, stat) => sum + stat.count, 0),
        ...formatStats(interviewStats),
      },
      aptitude: {
        total: aptitudeStats.reduce((sum, stat) => sum + stat.count, 0),
        avgScore: aptitudeStats.find((s) => s._id === "completed")?.avgScore || 0,
        ...formatStats(aptitudeStats),
      },
      goals: {
        total: goalStats.reduce((sum, stat) => sum + stat.count, 0),
        ...formatStats(goalStats),
      },
    }

    res.json(dashboardStats)
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/dashboard/recent-activity
// @desc    Get recent activity
// @access  Private
router.get("/recent-activity", auth, async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit) || 10

    // Get recent applications
    const recentApplications = await Application.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("company position status createdAt")

    // Get recent coding problems
    const recentCoding = await CodingProblem.find({ user: req.user.id, status: "solved" })
      .sort({ solvedDate: -1 })
      .limit(3)
      .select("title platform difficulty solvedDate")

    // Get recent interviews
    const recentInterviews = await Interview.find({ user: req.user.id })
      .sort({ scheduledDate: -1 })
      .limit(3)
      .select("company position type status scheduledDate")

    // Get recent aptitude tests
    const recentAptitude = await AptitudeTest.find({ user: req.user.id, status: "completed" })
      .sort({ completedDate: -1 })
      .limit(3)
      .select("title category score completedDate")

    const activities = []

    // Format activities
    recentApplications.forEach((app) => {
      activities.push({
        type: "application",
        title: `Applied to ${app.company}`,
        subtitle: app.position,
        status: app.status,
        date: app.createdAt,
        icon: "building",
      })
    })

    recentCoding.forEach((problem) => {
      activities.push({
        type: "coding",
        title: `Solved ${problem.title}`,
        subtitle: `${problem.platform} - ${problem.difficulty}`,
        status: "solved",
        date: problem.solvedDate,
        icon: "code",
      })
    })

    recentInterviews.forEach((interview) => {
      activities.push({
        type: "interview",
        title: `${interview.company} Interview`,
        subtitle: `${interview.type} - ${interview.position}`,
        status: interview.status,
        date: interview.scheduledDate,
        icon: "message-square",
      })
    })

    recentAptitude.forEach((test) => {
      activities.push({
        type: "aptitude",
        title: `Completed ${test.title}`,
        subtitle: `${test.category} - Score: ${test.score}%`,
        status: "completed",
        date: test.completedDate,
        icon: "brain",
      })
    })

    // Sort by date and limit
    activities.sort((a, b) => new Date(b.date) - new Date(a.date))
    const limitedActivities = activities.slice(0, limit)

    res.json(limitedActivities)
  } catch (error) {
    console.error("Get recent activity error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/dashboard/upcoming
// @desc    Get upcoming events
// @access  Private
router.get("/upcoming", auth, async (req, res) => {
  try {
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    // Get upcoming interviews
    const upcomingInterviews = await Interview.find({
      user: req.user.id,
      status: "scheduled",
      scheduledDate: { $gte: now, $lte: nextWeek },
    })
      .sort({ scheduledDate: 1 })
      .select("company position type scheduledDate")

    // Get approaching deadlines
    const approachingDeadlines = await Application.find({
      user: req.user.id,
      deadline: { $gte: now, $lte: nextWeek },
      status: { $nin: ["offer", "rejected"] },
    })
      .sort({ deadline: 1 })
      .select("company position deadline")

    // Get overdue goals
    const overdueGoals = await Goal.find({
      user: req.user.id,
      status: "active",
      deadline: { $lt: now },
    })
      .sort({ deadline: 1 })
      .select("title deadline currentValue targetValue")

    const upcoming = {
      interviews: upcomingInterviews,
      deadlines: approachingDeadlines,
      overdueGoals,
    }

    res.json(upcoming)
  } catch (error) {
    console.error("Get upcoming events error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
