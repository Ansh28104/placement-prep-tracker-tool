"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  points: number
  level: number
  streak: number
  joinDate: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  addPoints: (points: number) => void
  updateStreak: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = localStorage.getItem("placement-tracker-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Redirect logic
    if (!isLoading) {
      const isAuthPage = pathname?.startsWith("/auth")

      if (!user && !isAuthPage) {
        router.push("/auth/login")
      } else if (user && isAuthPage) {
        router.push("/")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - accept any email/password
    const mockUser: User = {
      id: "1",
      name: email.split("@")[0],
      email,
      points: 1250,
      level: 3,
      streak: 15,
      joinDate: "2024-01-01",
    }

    setUser(mockUser)
    localStorage.setItem("placement-tracker-user", JSON.stringify(mockUser))
    return true
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: "1",
      name,
      email,
      points: 100,
      level: 1,
      streak: 0,
      joinDate: new Date().toISOString().split("T")[0],
    }

    setUser(mockUser)
    localStorage.setItem("placement-tracker-user", JSON.stringify(mockUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("placement-tracker-user")
    router.push("/auth/login")
  }

  const addPoints = (points: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        points: user.points + points,
        level: Math.floor((user.points + points) / 500) + 1,
      }
      setUser(updatedUser)
      localStorage.setItem("placement-tracker-user", JSON.stringify(updatedUser))
    }
  }

  const updateStreak = () => {
    if (user) {
      const updatedUser = { ...user, streak: user.streak + 1 }
      setUser(updatedUser)
      localStorage.setItem("placement-tracker-user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        addPoints,
        updateStreak,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
