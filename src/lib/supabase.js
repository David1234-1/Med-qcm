import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Configuration pour le stockage local en cas d'absence de Supabase
export const localStorage = {
  get: (key) => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  },
  
  set: (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  },
  
  remove: (key) => {
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  }
}

// Simulation d'une base de données locale
export const localDB = {
  users: [],
  courses: [],
  qcm: [],
  flashcards: [],
  chats: [],
  stats: []
}

// Initialiser les données depuis localStorage
const initLocalDB = () => {
  const savedUsers = localStorage.get('users') || []
  const savedCourses = localStorage.get('courses') || []
  const savedQCM = localStorage.get('qcm') || []
  const savedFlashcards = localStorage.get('flashcards') || []
  const savedChats = localStorage.get('chats') || []
  const savedStats = localStorage.get('stats') || []
  
  localDB.users = savedUsers
  localDB.courses = savedCourses
  localDB.qcm = savedQCM
  localDB.flashcards = savedFlashcards
  localDB.chats = savedChats
  localDB.stats = savedStats
}

// Sauvegarder les données dans localStorage
const saveToLocalStorage = () => {
  localStorage.set('users', localDB.users)
  localStorage.set('courses', localDB.courses)
  localStorage.set('qcm', localDB.qcm)
  localStorage.set('flashcards', localDB.flashcards)
  localStorage.set('chats', localDB.chats)
  localStorage.set('stats', localDB.stats)
}

// API simulée pour l'authentification
export const authAPI = {
  signUp: async (email, password) => {
    const existingUser = localDB.users.find(user => user.email === email)
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà')
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      password: btoa(password), // Encodage simple pour la démo
      created_at: new Date().toISOString()
    }
    
    localDB.users.push(newUser)
    saveToLocalStorage()
    
    return { user: { id: newUser.id, email: newUser.email }, session: { access_token: 'demo-token' } }
  },
  
  signIn: async (email, password) => {
    const user = localDB.users.find(u => u.email === email && atob(u.password) === password)
    if (!user) {
      throw new Error('Email ou mot de passe incorrect')
    }
    
    return { user: { id: user.id, email: user.email }, session: { access_token: 'demo-token' } }
  },
  
  signOut: async () => {
    localStorage.remove('currentUser')
    return { error: null }
  },
  
  getCurrentUser: () => {
    return localStorage.get('currentUser')
  }
}

// API simulée pour les données
export const dataAPI = {
  // Cours
  addCourse: async (course) => {
    const newCourse = {
      id: Date.now().toString(),
      ...course,
      created_at: new Date().toISOString()
    }
    localDB.courses.push(newCourse)
    saveToLocalStorage()
    return newCourse
  },
  
  getCourses: async () => {
    return localDB.courses
  },
  
  // QCM
  addQCM: async (qcm) => {
    const newQCM = {
      id: Date.now().toString(),
      ...qcm,
      created_at: new Date().toISOString()
    }
    localDB.qcm.push(newQCM)
    saveToLocalStorage()
    return newQCM
  },
  
  getQCM: async () => {
    return localDB.qcm
  },
  
  // Flashcards
  addFlashcards: async (flashcards) => {
    const newFlashcards = {
      id: Date.now().toString(),
      ...flashcards,
      created_at: new Date().toISOString()
    }
    localDB.flashcards.push(newFlashcards)
    saveToLocalStorage()
    return newFlashcards
  },
  
  getFlashcards: async () => {
    return localDB.flashcards
  },
  
  // Chats
  addChat: async (chat) => {
    const newChat = {
      id: Date.now().toString(),
      ...chat,
      created_at: new Date().toISOString()
    }
    localDB.chats.push(newChat)
    saveToLocalStorage()
    return newChat
  },
  
  getChats: async () => {
    return localDB.chats
  },
  
  // Stats
  addStats: async (stats) => {
    const newStats = {
      id: Date.now().toString(),
      ...stats,
      created_at: new Date().toISOString()
    }
    localDB.stats.push(newStats)
    saveToLocalStorage()
    return newStats
  },
  
  getStats: async () => {
    return localDB.stats
  }
}

// Initialiser la base de données locale
initLocalDB()