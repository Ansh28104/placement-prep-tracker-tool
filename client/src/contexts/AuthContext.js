"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Set up axios defaults
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }
  }, [])

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const response = await axios.get("/api/auth/me")
          setUser(response.data.user)
        } catch (error) {
          localStorage.removeItem("token")
          delete axios.defaults.headers.common["Authorization"]
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(user)

      toast.success("Welcome back!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed"
      toast.error(message)
      return { success: false, message }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await axios.post("/api/auth/register", { name, email, password })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(user)

      toast.success("Account created successfully!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed"
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
    toast.success("Logged out successfully")
  }

  const addPoints = async (points) => {
    try {
      const response = await axios.post("/api/auth/add-points", { points })
      setUser((prev) => ({
        ...prev,
        points: response.data.points,
        level: response.data.level,
      }))
      toast.success(response.data.message)
    } catch (error) {
      console.error("Add points error:", error)
    }
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put("/api/auth/profile", profileData)
      setUser(response.data.user)
      toast.success("Profile updated successfully")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Update failed"
      toast.error(message)
      return { success: false, message }
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    addPoints,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
