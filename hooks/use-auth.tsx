"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("socialflow_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Mock authentication - in real app, this would call your auth API
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

    const mockUser: User = {
      id: "1",
      name: "Gokul",
      email: email,
      avatar: "/user-avatar.avif",
    }

    setUser(mockUser)
    localStorage.setItem("socialflow_user", JSON.stringify(mockUser))
  }

  const signup = async (name: string, email: string, password: string) => {
    // Mock authentication - in real app, this would call your auth API
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

    const mockUser: User = {
      id: "1",
      name: name,
      email: email,
      avatar: "/user-avatar.avif",
    }

    setUser(mockUser)
    localStorage.setItem("socialflow_user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("socialflow_user")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
