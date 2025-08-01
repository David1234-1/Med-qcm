import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, localStorage } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const currentUser = authAPI.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setLoading(false)
  }, [])

  const signUp = async (email, password) => {
    try {
      const { user: newUser } = await authAPI.signUp(email, password)
      setUser(newUser)
      localStorage.set('currentUser', newUser)
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { user: loggedUser } = await authAPI.signIn(email, password)
      setUser(loggedUser)
      localStorage.set('currentUser', loggedUser)
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  }

  const signOut = async () => {
    try {
      await authAPI.signOut()
      setUser(null)
      localStorage.remove('currentUser')
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}