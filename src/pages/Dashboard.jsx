import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Brain, 
  Heart, 
  MessageSquare, 
  BarChart3, 
  Plus,
  Play,
  Clock,
  Target
} from 'lucide-react'
import { dataAPI } from '../lib/supabase'

const Dashboard = () => {
  const [courses, setCourses] = useState([])
  const [qcmList, setQcmList] = useState([])
  const [flashcardsList, setFlashcardsList] = useState([])
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [coursesData, qcmData, flashcardsData, statsData] = await Promise.all([
        dataAPI.getCourses(),
        dataAPI.getQCM(),
        dataAPI.getFlashcards(),
        dataAPI.getStats()
      ])

      setCourses(coursesData)
      setQcmList(qcmData)
      setFlashcardsList(flashcardsData)
      setStats(statsData)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRecentActivity = () => {
    const allStats = [...stats]
    return allStats
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
  }

  const getQuickStats = () => {
    const qcmStats = stats.filter(s => s.type === 'qcm_completed')
    const totalQCM = qcmStats.length
    const averageScore = qcmStats.length > 0 
      ? Math.round(qcmStats.reduce((sum, s) => sum + s.score, 0) / qcmStats.length)
      : 0
    const totalTime = qcmStats.reduce((sum, s) => sum + (s.timeElapsed || 0), 0)

    return { totalQCM, averageScore, totalTime }
  }

  const quickStats = getQuickStats()
  const recentActivity = getRecentActivity()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card">
          <div className="flex items-center justify-center py-8">
            <div className="loading"></div>
            <span className="ml-2">Chargement du tableau de bord...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue sur votre plateforme d'étude médicale</p>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/courses" className="card hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="flex items-center space-x-4">
            <div className="bg-primary p-3 rounded-lg group-hover:bg-primary-dark transition-colors">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Importer un cours</h3>
              <p className="text-sm text-gray-600">Ajouter un nouveau PDF</p>
            </div>
            <Plus className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </Link>

        <Link to="/qcm" className="card hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="flex items-center space-x-4">
            <div className="bg-secondary p-3 rounded-lg group-hover:bg-secondary/80 transition-colors">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Faire un QCM</h3>
              <p className="text-sm text-gray-600">{qcmList.length} séries disponibles</p>
            </div>
            <Play className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </Link>

        <Link to="/flashcards" className="card hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="flex items-center space-x-4">
            <div className="bg-success p-3 rounded-lg group-hover:bg-success/80 transition-colors">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Révisez</h3>
              <p className="text-sm text-gray-600">{flashcardsList.length} séries de flashcards</p>
            </div>
            <Play className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </Link>

        <Link to="/assistant" className="card hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="flex items-center space-x-4">
            <div className="bg-warning p-3 rounded-lg group-hover:bg-warning/80 transition-colors">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Assistant IA</h3>
              <p className="text-sm text-gray-600">Posez vos questions</p>
            </div>
            <Play className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistiques rapides */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Vos statistiques</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{quickStats.totalQCM}</div>
                <div className="text-sm text-gray-600">QCM complétés</div>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{quickStats.averageScore}%</div>
                <div className="text-sm text-gray-600">Score moyen</div>
              </div>
              
              <div className="text-center">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(quickStats.totalTime / 60)}min
                </div>
                <div className="text-sm text-gray-600">Temps d'étude</div>
              </div>
            </div>
          </div>
        </div>

        {/* Activité récente */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Activité récente</h2>
          
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <BarChart3 className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-500">Aucune activité récente</p>
              <p className="text-sm text-gray-400">Commencez par importer un cours !</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {activity.type === 'qcm_completed' ? 'QCM terminé' : 'Cours traité'}
                    </div>
                    <div className="text-xs text-gray-600">
                      {activity.subject} • {new Date(activity.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  {activity.score && (
                    <div className="text-sm font-medium" style={{ color: activity.score >= 80 ? '#10b981' : activity.score >= 60 ? '#f59e0b' : '#ef4444' }}>
                      {activity.score}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cours et contenus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Cours récents */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Cours récents</h2>
            <Link to="/courses" className="text-primary hover:text-primary-dark text-sm font-medium">
              Voir tout
            </Link>
          </div>
          
          {courses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun cours importé</p>
              <Link to="/courses" className="btn btn-primary mt-4">
                Importer un cours
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {courses.slice(-3).reverse().map((course, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{course.subject}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(course.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {course.files?.length || 0} fichier(s)
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QCM disponibles */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">QCM disponibles</h2>
            <Link to="/qcm" className="text-primary hover:text-primary-dark text-sm font-medium">
              Voir tout
            </Link>
          </div>
          
          {qcmList.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun QCM disponible</p>
              <p className="text-sm text-gray-400">Importez un cours pour générer des QCM</p>
            </div>
          ) : (
            <div className="space-y-3">
              {qcmList.slice(-3).reverse().map((qcm, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{qcm.subject}</div>
                    <div className="text-sm text-gray-600">
                      {qcm.totalQuestions} questions
                    </div>
                  </div>
                  <Link to={`/qcm/${qcm.id}`} className="btn btn-primary text-sm">
                    Commencer
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard