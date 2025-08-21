"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Code, Plus, Search, Calendar, Clock, CheckCircle, Target, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CodingProblem {
  id: number
  title: string
  platform: string
  difficulty: "easy" | "medium" | "hard"
  category: string
  status: "solved" | "attempted" | "todo"
  solvedDate?: string
  timeSpent: number
  notes: string
  url: string
}

export default function CodingPage() {
  const { toast } = useToast()
  const [problems, setProblems] = useState<CodingProblem[]>([
    {
      id: 1,
      title: "Two Sum",
      platform: "LeetCode",
      difficulty: "easy",
      category: "Array",
      status: "solved",
      solvedDate: "2024-01-15",
      timeSpent: 30,
      notes: "Used hash map approach for O(n) solution",
      url: "https://leetcode.com/problems/two-sum/",
    },
    {
      id: 2,
      title: "Binary Tree Inorder Traversal",
      platform: "LeetCode",
      difficulty: "easy",
      category: "Tree",
      status: "solved",
      solvedDate: "2024-01-14",
      timeSpent: 45,
      notes: "Implemented both recursive and iterative solutions",
      url: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      platform: "LeetCode",
      difficulty: "medium",
      category: "String",
      status: "solved",
      solvedDate: "2024-01-13",
      timeSpent: 60,
      notes: "Sliding window technique worked well",
      url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    },
    {
      id: 4,
      title: "Merge k Sorted Lists",
      platform: "LeetCode",
      difficulty: "hard",
      category: "Linked List",
      status: "attempted",
      timeSpent: 90,
      notes: "Need to review divide and conquer approach",
      url: "https://leetcode.com/problems/merge-k-sorted-lists/",
    },
    {
      id: 5,
      title: "Valid Parentheses",
      platform: "LeetCode",
      difficulty: "easy",
      category: "Stack",
      status: "todo",
      timeSpent: 0,
      notes: "",
      url: "https://leetcode.com/problems/valid-parentheses/",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newProblem, setNewProblem] = useState({
    title: "",
    platform: "LeetCode",
    difficulty: "easy",
    category: "",
    url: "",
    notes: "",
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "solved":
        return "bg-green-100 text-green-800"
      case "attempted":
        return "bg-yellow-100 text-yellow-800"
      case "todo":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "solved":
        return <CheckCircle className="w-4 h-4" />
      case "attempted":
        return <Clock className="w-4 h-4" />
      case "todo":
        return <Target className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = difficultyFilter === "all" || problem.difficulty === difficultyFilter
    const matchesStatus = statusFilter === "all" || problem.status === statusFilter
    const matchesPlatform = platformFilter === "all" || problem.platform === platformFilter
    return matchesSearch && matchesDifficulty && matchesStatus && matchesPlatform
  })

  const handleAddProblem = () => {
    const problem: CodingProblem = {
      ...newProblem,
      id: problems.length + 1,
      difficulty: newProblem.difficulty as "easy" | "medium" | "hard",
      status: "todo",
      timeSpent: 0,
    }

    setProblems([...problems, problem])
    setNewProblem({
      title: "",
      platform: "LeetCode",
      difficulty: "easy",
      category: "",
      url: "",
      notes: "",
    })
    setIsAddDialogOpen(false)
    toast({
      title: "Problem added!",
      description: "New coding problem has been added to your list.",
    })
  }

  const updateProblemStatus = (problemId: number, newStatus: "solved" | "attempted" | "todo") => {
    setProblems(
      problems.map((problem) =>
        problem.id === problemId
          ? {
              ...problem,
              status: newStatus,
              solvedDate: newStatus === "solved" ? new Date().toISOString().split("T")[0] : undefined,
            }
          : problem,
      ),
    )
    toast({
      title: "Status updated!",
      description: `Problem marked as ${newStatus}.`,
    })
  }

  const stats = {
    total: problems.length,
    solved: problems.filter((p) => p.status === "solved").length,
    attempted: problems.filter((p) => p.status === "attempted").length,
    todo: problems.filter((p) => p.status === "todo").length,
    easy: problems.filter((p) => p.difficulty === "easy" && p.status === "solved").length,
    medium: problems.filter((p) => p.difficulty === "medium" && p.status === "solved").length,
    hard: problems.filter((p) => p.difficulty === "hard" && p.status === "solved").length,
    totalTime: problems.reduce((acc, p) => acc + p.timeSpent, 0),
  }

  const completionRate = stats.total > 0 ? (stats.solved / stats.total) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Coding Practice</h1>
              <p className="text-gray-600 mt-1">Track your DSA problem solving progress</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Problem
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Problem</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="title">Problem Title</Label>
                    <Input
                      id="title"
                      value={newProblem.title}
                      onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                      placeholder="e.g., Two Sum"
                    />
                  </div>
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Select
                      value={newProblem.platform}
                      onValueChange={(value) => setNewProblem({ ...newProblem, platform: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LeetCode">LeetCode</SelectItem>
                        <SelectItem value="HackerRank">HackerRank</SelectItem>
                        <SelectItem value="CodeChef">CodeChef</SelectItem>
                        <SelectItem value="Codeforces">Codeforces</SelectItem>
                        <SelectItem value="GeeksforGeeks">GeeksforGeeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={newProblem.difficulty}
                      onValueChange={(value) => setNewProblem({ ...newProblem, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newProblem.category}
                      onChange={(e) => setNewProblem({ ...newProblem, category: e.target.value })}
                      placeholder="e.g., Array, Tree, Graph"
                    />
                  </div>
                  <div>
                    <Label htmlFor="url">Problem URL</Label>
                    <Input
                      id="url"
                      value={newProblem.url}
                      onChange={(e) => setNewProblem({ ...newProblem, url: e.target.value })}
                      placeholder="https://leetcode.com/problems/..."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newProblem.notes}
                      onChange={(e) => setNewProblem({ ...newProblem, notes: e.target.value })}
                      placeholder="Any notes about the problem..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddProblem}>Add Problem</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats.solved}</p>
                <p className="text-sm text-gray-600">Solved</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.attempted}</p>
                <p className="text-sm text-gray-600">Attempted</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-600">{stats.todo}</p>
                <p className="text-sm text-gray-600">To Do</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-lg font-bold text-green-600">{stats.easy}</p>
                <p className="text-sm text-gray-600">Easy</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-lg font-bold text-yellow-600">{stats.medium}</p>
                <p className="text-sm text-gray-600">Medium</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-lg font-bold text-red-600">{stats.hard}</p>
                <p className="text-sm text-gray-600">Hard</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Completion</span>
                    <span>{Math.round(completionRate)}%</span>
                  </div>
                  <Progress value={completionRate} className="h-3" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalTime}</p>
                    <p className="text-sm text-gray-600">Minutes Practiced</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{Math.round(completionRate)}%</p>
                    <p className="text-sm text-gray-600">Success Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      {stats.totalTime > 0 ? Math.round(stats.totalTime / Math.max(stats.solved, 1)) : 0}
                    </p>
                    <p className="text-sm text-gray-600">Avg Time/Problem</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search problems or categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="LeetCode">LeetCode</SelectItem>
                    <SelectItem value="HackerRank">HackerRank</SelectItem>
                    <SelectItem value="CodeChef">CodeChef</SelectItem>
                    <SelectItem value="Codeforces">Codeforces</SelectItem>
                    <SelectItem value="GeeksforGeeks">GeeksforGeeks</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="solved">Solved</SelectItem>
                    <SelectItem value="attempted">Attempted</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Problems List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProblems.map((problem) => (
              <Card key={problem.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Code className="w-5 h-5" />
                        {problem.title}
                      </CardTitle>
                      <p className="text-gray-600 text-sm">{problem.platform}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(problem.status)}>
                        {getStatusIcon(problem.status)}
                        <span className="ml-1 capitalize">{problem.status}</span>
                      </Badge>
                      <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{problem.category}</Badge>
                      {problem.timeSpent > 0 && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {problem.timeSpent} min
                        </div>
                      )}
                    </div>
                    {problem.solvedDate && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Solved: {new Date(problem.solvedDate).toLocaleDateString()}
                      </div>
                    )}
                    {problem.notes && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{problem.notes}</p>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex space-x-2">
                        {problem.status !== "solved" && (
                          <Button variant="outline" size="sm" onClick={() => updateProblemStatus(problem.id, "solved")}>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Solved
                          </Button>
                        )}
                        {problem.status === "todo" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateProblemStatus(problem.id, "attempted")}
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            Attempted
                          </Button>
                        )}
                      </div>
                      {problem.url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={problem.url} target="_blank" rel="noopener noreferrer">
                            View Problem
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProblems.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No problems found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || difficultyFilter !== "all" || statusFilter !== "all" || platformFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Start by adding your first coding problem."}
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Problem
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
