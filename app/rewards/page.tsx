"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  points: number
  unlocked: boolean
  unlockedDate?: string
  category: "coding" | "applications" | "interviews" | "general"
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface DailyTask {
  id: number
  title: string
  description: string
  points: number
  completed: boolean
  category: "coding" | "applications" | "interviews" | "general"
}

interface Reward {
  id: number
  title: string
  description: string
  cost: number
  category: "templates" | "courses" | "tools" | "premium"
  available: boolean
}

export default function RewardsPage() {
  const { user, addPoints } = useAuth()
  const { toast } = useToast()

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first coding problem",
      icon: "🎯",
      points: 10,
      unlocked: true,
      unlockedDate: "2024-01-10",
      category: "coding",
      rarity: "common",
    },
    {
      id: 2,
      title: "Problem Solver",
      description: "Solve 50 coding problems",
      icon: "🧩",
      points: 100,
      unlocked: true,
      unlockedDate: "2024-01-14",
      category: "coding",
      rarity: "rare",
    },
    {
      id: 3,
      title: "Application Master",
      description: "Apply to 25 companies",
      icon: "📋",
      points: 150,
      unlocked: false,
      category: "applications",
      rarity: "epic",
    },
    {
      id: 4,
      title: "Interview Ace",
      description: "Pass 10 interviews",
      icon: "🎤",
      points: 200,
      unlocked: false,
      category: "interviews",
      rarity: "legendary",
    },
    {
      id: 5,
      title: "Streak Master",
      description: "Maintain a 30-day practice streak",
      icon: "🔥",
      points: 300,
      unlocked: false,
      category: "general",
      rarity: "legendary",
    },
    {
      id: 6,
      title: "Early Bird",
      description: "Complete daily tasks for 7 consecutive days",
      icon: "🌅",
      points: 75,
      unlocked: true,
      unlockedDate: "2024-01-12",
      category: "general",
      rarity: "rare",
    },
  ])

  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([
    {
      id: 1,
      title: "Solve 3 coding problems",
      description: "Complete 3 problems on any platform",
      points: 30,
      completed: true,
      category: "coding",
    },
    {
      id: 2,
      title: "Apply to 2 companies",
      description: "Submit applications to 2 new companies",
      points: 40,
      completed: false,
      category: "applications",
    },
    {
      id: 3,
      title: "Practice aptitude for 30 minutes",
      description: "Spend at least 30 minutes on aptitude preparation",
      points: 25,
      completed: true,
      category: "general",
    },
    {
      id: 4,
      title: "Update your resume",
      description: "Make improvements to your resume",
      points: 20,
      completed: false,
      category: "general",
    },
    {
      id: 5,
      title: "Schedule an interview",
      description: "Schedule or complete an interview",
      points: 50,
      completed: false,
      category: "interviews",
    },
  ])

  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: 1,
      title: "Premium Resume Template",
      description: "Access to professional resume templates",
      cost: 100,
      category: "templates",
      available: true,
    },
    {
      id: 2,
      title: "System Design Course",
      description: "Complete system design interview course",
      cost: 500,
      category: "courses",
      available: true,
    },
    {
      id: 3,
      title: "Mock Interview Session",
      description: "1-on-1 mock interview with expert",
      cost: 800,
      category: "premium",
      available: true,
    },
    {
      id: 4,
      title: "Coding Interview Toolkit",
      description: "Collection of coding interview resources",
      cost: 300,
      category: "tools",
      available: true,
    },
    {
      id: 5,
      title: "Premium Dashboard Theme",
      description: "Unlock premium dashboard themes",
      cost: 150,
      category: "premium",
      available: true,
    },
  ])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800"
      case "rare":
        return "bg-blue-100 text-blue-800"
      case "epic":
        return "bg-purple-100 text-purple-800"
      case "legendary":
        return "bg-yellow-100 text-yellow-800"
      default:
        return \"bg-gray-100 text
