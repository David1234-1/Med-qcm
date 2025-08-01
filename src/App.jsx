import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import { Brain, Heart } from 'lucide-react'
import { dataAPI } from './lib/supabase'

// Pages
import AuthPage from './components/Auth/AuthPage'
import Dashboard from './pages/Dashboard'
import CourseUpload from './components/Courses/CourseUpload'
import QCMQuiz from './components/QCM/QCMQuiz'
import FlashcardViewer from './components/Flashcards/FlashcardViewer'
import AIChat from './components/Assistant/AIChat'
import StatsDashboard from './components/Stats/StatsDashboard'

// Layout
import Header from './components/Layout/Header'

// Composant de protection des routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return children
}

// Layout principal avec header
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>{children}</main>
    </div>
  )
}

// Pages avec layout
const CoursesPage = () => (
  <MainLayout>
    <div className="container mx-auto px-4 py-8">
      <CourseUpload />
    </div>
  </MainLayout>
)

const QCMPage = () => {
  const [selectedQCM, setSelectedQCM] = useState(null)
  const [qcmList, setQcmList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQCMList()
  }, [])

  const loadQCMList = async () => {
    try {
      const data = await dataAPI.getQCM()
      setQcmList(data)
    } catch (error) {
      console.error('Erreur lors du chargement des QCM:', error)
    } finally {
      setLoading(false)
    }
  }

  if (selectedQCM) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <QCMQuiz 
            qcmData={selectedQCM} 
            onComplete={() => setSelectedQCM(null)}
          />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">QCM</h1>
          <p className="text-gray-600">Testez vos connaissances avec nos QCM générés par IA</p>
        </div>

        {loading ? (
          <div className="card">
            <div className="flex items-center justify-center py-8">
              <div className="loading"></div>
              <span className="ml-2">Chargement des QCM...</span>
            </div>
          </div>
        ) : qcmList.length === 0 ? (
          <div className="card text-center py-12">
            <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun QCM disponible</h3>
            <p className="text-gray-600 mb-6">Importez un cours pour générer des QCM automatiquement</p>
            <Link to="/courses" className="btn btn-primary">
              Importer un cours
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qcmList.map((qcm) => (
              <div key={qcm.id} className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedQCM(qcm)}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-secondary p-2 rounded-lg">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{qcm.subject}</h3>
                    <p className="text-sm text-gray-600">{qcm.totalQuestions} questions</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Créé le {new Date(qcm.created_at).toLocaleDateString('fr-FR')}
                </div>
                <button className="btn btn-primary w-full mt-4">
                  Commencer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

const FlashcardsPage = () => {
  const [selectedFlashcards, setSelectedFlashcards] = useState(null)
  const [flashcardsList, setFlashcardsList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFlashcardsList()
  }, [])

  const loadFlashcardsList = async () => {
    try {
      const data = await dataAPI.getFlashcards()
      setFlashcardsList(data)
    } catch (error) {
      console.error('Erreur lors du chargement des flashcards:', error)
    } finally {
      setLoading(false)
    }
  }

  if (selectedFlashcards) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <FlashcardViewer 
            flashcardData={selectedFlashcards} 
            onComplete={() => setSelectedFlashcards(null)}
          />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Flashcards</h1>
          <p className="text-gray-600">Révisez efficacement avec nos flashcards intelligentes</p>
        </div>

        {loading ? (
          <div className="card">
            <div className="flex items-center justify-center py-8">
              <div className="loading"></div>
              <span className="ml-2">Chargement des flashcards...</span>
            </div>
          </div>
        ) : flashcardsList.length === 0 ? (
          <div className="card text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune flashcard disponible</h3>
            <p className="text-gray-600 mb-6">Importez un cours pour générer des flashcards automatiquement</p>
            <Link to="/courses" className="btn btn-primary">
              Importer un cours
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashcardsList.map((flashcard) => (
              <div key={flashcard.id} className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedFlashcards(flashcard)}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-success p-2 rounded-lg">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{flashcard.subject}</h3>
                    <p className="text-sm text-gray-600">{flashcard.totalCards} cartes</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Créé le {new Date(flashcard.created_at).toLocaleDateString('fr-FR')}
                </div>
                <button className="btn btn-primary w-full mt-4">
                  Commencer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

const AssistantPage = () => (
  <MainLayout>
    <div className="container mx-auto px-4 py-8">
      <AIChat />
    </div>
  </MainLayout>
)

const StatsPage = () => (
  <MainLayout>
    <div className="container mx-auto px-4 py-8">
      <StatsDashboard />
    </div>
  </MainLayout>
)

const DashboardPage = () => (
  <MainLayout>
    <Dashboard />
  </MainLayout>
)

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/courses" element={
              <ProtectedRoute>
                <CoursesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/qcm" element={
              <ProtectedRoute>
                <QCMPage />
              </ProtectedRoute>
            } />
            
            <Route path="/flashcards" element={
              <ProtectedRoute>
                <FlashcardsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/assistant" element={
              <ProtectedRoute>
                <AssistantPage />
              </ProtectedRoute>
            } />
            
            <Route path="/stats" element={
              <ProtectedRoute>
                <StatsPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App