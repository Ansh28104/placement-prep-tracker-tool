import { useQuery } from "react-query"
import { Link } from "react-router-dom"
import axios from "axios"
import {
  Building2,
  Code,
  Brain,
  MessageSquare,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery("dashboard-stats", () =>
    axios.get("/api/dashboard/stats").then((res) => res.data),
  )

  const { data: recentActivity, isLoading: activityLoading } = useQuery("recent-activity", () =>
    axios.get("/api/dashboard/recent-activity").then((res) => res.data),
  )

  const { data: upcoming, isLoading: upcomingLoading } = useQuery("upcoming-events", () =>
    axios.get("/api/dashboard/upcoming").then((res) => res.data),
  )

  if (statsLoading || activityLoading || upcomingLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const quickStats = [
    {
      name: "Applications",
      value: stats?.applications?.total || 0,
      change: "+12%",
      changeType: "positive",
      icon: Building2,
      color: "bg-blue-500",
      href: "/applications",
    },
    {
      name: "Problems Solved",
      value: stats?.coding?.solved || 0,
      change: "+8%",
      changeType: "positive",
      icon: Code,
      color: "bg-green-500",
      href: "/coding",
    },
    {
      name: "Interviews",
      value: stats?.interviews?.total || 0,
      change: "+3%",
      changeType: "positive",
      icon: MessageSquare,
      color: "bg-purple-500",
      href: "/interviews",
    },
    {
      name: "Active Goals",
      value: stats?.goals?.active || 0,
      change: "0%",
      changeType: "neutral",
      icon: Target,
      color: "bg-orange-500",
      href: "/goals",
    },
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case "application":
        return Building2
      case "coding":
        return Code
      case "interview":
        return MessageSquare
      case "aptitude":
        return Brain
      default:
        return CheckCircle
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
      case "solved":
      case "passed":
        return "text-green-600 bg-green-100"
      case "in-progress":
      case "attempted":
        return "text-yellow-600 bg-yellow-100"
      case "scheduled":
        return "text-blue-600 bg-blue-100"
      case "failed":
      case "rejected":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your placement preparation.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.href}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <dt>
                <div className={`absolute ${item.color} rounded-md p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    item.changeType === "positive"
                      ? "text-green-600"
                      : item.changeType === "negative"
                        ? "text-red-600"
                        : "text-gray-500"
                  }`}
                >
                  <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                  <span className="sr-only">{item.changeType === "positive" ? "Increased" : "Decreased"} by</span>
                  {item.change}
                </p>
              </dd>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivity?.slice(0, 5).map((activity, activityIdx) => {
                  const Icon = getActivityIcon(activity.type)
                  return (
                    <li key={activityIdx}>
                      <div className="relative pb-8">
                        {activityIdx !== recentActivity.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                              <Icon className="h-4 w-4 text-gray-500" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-900">{activity.title}</p>
                              <p className="text-sm text-gray-500">{activity.subtitle}</p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}
                              >
                                {activity.status}
                              </span>
                              <p className="mt-1">{new Date(activity.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
            {recentActivity?.length === 0 && <p className="text-gray-500 text-center py-4">No recent activity</p>}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {/* Upcoming Interviews */}
              {upcoming?.interviews?.map((interview) => (
                <div key={interview._id} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {interview.company} - {interview.type} Interview
                    </p>
                    <p className="text-sm text-gray-500">{new Date(interview.scheduledDate).toLocaleString()}</p>
                  </div>
                </div>
              ))}

              {/* Approaching Deadlines */}
              {upcoming?.deadlines?.map((deadline) => (
                <div key={deadline._id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{deadline.company} - Application Deadline</p>
                    <p className="text-sm text-gray-500">Due: {new Date(deadline.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}

              {/* Overdue Goals */}
              {upcoming?.overdueGoals?.map((goal) => (
                <div key={goal._id} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Overdue Goal: {goal.title}</p>
                    <p className="text-sm text-gray-500">
                      Progress: {goal.currentValue}/{goal.targetValue}
                    </p>
                  </div>
                </div>
              ))}

              {!upcoming?.interviews?.length && !upcoming?.deadlines?.length && !upcoming?.overdueGoals?.length && (
                <p className="text-gray-500 text-center py-4">No upcoming events</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/applications"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Add Application</p>
                <p className="text-sm text-gray-500">Track a new job application</p>
              </div>
            </Link>
            <Link
              to="/coding"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Code className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Add Problem</p>
                <p className="text-sm text-gray-500">Log a coding problem</p>
              </div>
            </Link>
            <Link
              to="/interviews"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Schedule Interview</p>
                <p className="text-sm text-gray-500">Add interview to calendar</p>
              </div>
            </Link>
            <Link
              to="/goals"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Target className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Set Goal</p>
                <p className="text-sm text-gray-500">Create a new target</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
