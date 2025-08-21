const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/applications", require("./routes/applications"))
app.use("/api/coding", require("./routes/coding"))
app.use("/api/aptitude", require("./routes/aptitude"))
app.use("/api/resume", require("./routes/resume"))
app.use("/api/interviews", require("./routes/interviews"))
app.use("/api/goals", require("./routes/goals"))
app.use("/api/resources", require("./routes/resources"))
app.use("/api/rewards", require("./routes/rewards"))
app.use("/api/dashboard", require("./routes/dashboard"))

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"))
  })
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/placement-tracker", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
