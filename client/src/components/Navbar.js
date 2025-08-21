"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Bell, User, Settings, LogOut, Trophy, Menu, X } from "lucide-react"

const Navbar = () => {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex-shrink-0 flex items-center ml-2 md:ml-0">
              <Trophy className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">PlacementTracker</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Points and Level */}
            <div className="hidden sm:flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                <Trophy className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">{user?.points || 0} pts</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-purple-700">Level {user?.level || 1}</span>
              </div>
            </div>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full">
              <Bell className="h-5 w-5" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium">{user?.name}</span>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                <Trophy className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">{user?.points || 0} pts</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-purple-700">Level {user?.level || 1}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
