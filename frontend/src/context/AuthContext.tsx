"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { auth, isDemoMode } from "@/lib/firebase.client"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    if (isDemoMode) {
      console.log("[v0] Demo mode: Simulating login for", email)
      // Create a mock user for demo purposes
      const mockUser = {
        uid: "demo-user",
        email: email,
        displayName: "Demo User",
      } as User
      setUser(mockUser)
      return
    }

    await signInWithEmailAndPassword(auth, email, password)
  }

  const signup = async (email: string, password: string, displayName: string) => {
    if (isDemoMode) {
      console.log("[v0] Demo mode: Simulating signup for", email)
      // Create a mock user for demo purposes
      const mockUser = {
        uid: "demo-user",
        email: email,
        displayName: displayName,
      } as User
      setUser(mockUser)
      return
    }

    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(user, { displayName })
  }

  const logout = async () => {
    if (isDemoMode) {
      setUser(null)
      return
    }

    await signOut(auth)
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
