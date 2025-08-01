import React, { useState, useEffect } from 'react'
import { BarChart3, Trophy, Target, Clock, TrendingUp, Award } from 'lucide-react'
import { dataAPI } from '../../lib/supabase'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const StatsDashboard = () => {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const statsData = await dataAPI.getStats()
      setStats(statsData)
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    } finally {
      setLoading(false)
    }
  }

  const qcmStats = stats.filter(s => s.type === 'qcm_completed')
  const courseStats = stats.filter(s => s.type === 'course_processed')

  const totalQCM = qcmStats.length
  const averageScore = qcmStats.length > 0 
    ? Math.round(qcmStats.reduce((sum, s) => sum + s.score, 0) / qcmStats.length)
    : 0

  const totalTime = qcmStats.reduce((sum, s) => sum + (s.timeElapsed || 0), 0)
  const totalCourses = courseStats.length

  const subjectStats = qcmStats.reduce((acc, stat) => {
    acc[stat.subject] = (acc[stat.subject] || 0) + 1
    return acc
  }, {})

  const scoreDistribution = {
    excellent: qcmStats.filter(s => s.score >= 80).length,
    good: qcmStats.filter(s => s.score >= 60 && s.score < 80).length,
    needsImprovement: qcmStats.filter(s => s.score < 60).length
  }

  const chartData = {
    labels: Object.keys(subjectStats),
    datasets: [
      {
        label: 'QCM complétés',
        data: Object.values(subjectStats),
        backgroundColor: 'rgba(37, 99, 235, 0.8)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 1,
      },
    ],
  }

  const doughnutData = {
    labels: ['Excellent (80%+)', 'Bon (60-79%)', 'À améliorer (<60%)'],
    datasets: [
      {
        data: [scoreDistribution.excellent, scoreDistribution.good, scoreDistribution.needsImprovement],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'QCM par matière',
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Distribution des scores',
      },
    },
  }

  const getBadges = () => {
    const badges = []
    
    if (totalQCM >= 10) badges.push({ name: 'Débutant', icon: '🎯', color: 'bg-blue-100 text-blue-800' })
    if (totalQCM >= 25) badges.push({ name: 'Étudiant', icon: '📚', color: 'bg-green-100 text-green-800' })
    if (totalQCM >= 50) badges.push({ name: 'Expert', icon: '🏆', color: 'bg-yellow-100 text-yellow-800' })
    if (averageScore >= 80) badges.push({ name: 'Excellent', icon: '⭐', color: 'bg-purple-100 text-purple-800' })
    if (totalTime >= 3600) badges.push({ name: 'Persévérant', icon: '⏰', color: 'bg-indigo-100 text-indigo-800' })
    
    return badges
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="loading"></div>
          <span className="ml-2">Chargement des statistiques...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Tableau de bord</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">QCM complétés</span>
            </div>
            <div className="text-2xl font-bold text-blue-900 mt-1">{totalQCM}</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Score moyen</span>
            </div>
            <div className="text-2xl font-bold text-green-900 mt-1">{averageScore}%</div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-600">Temps total</span>
            </div>
            <div className="text-2xl font-bold text-yellow-900 mt-1">
              {Math.round(totalTime / 60)}min
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Cours traités</span>
            </div>
            <div className="text-2xl font-bold text-purple-900 mt-1">{totalCourses}</div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Award className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Badges obtenus</h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {getBadges().map((badge, index) => (
            <div
              key={index}
              className={`px-3 py-2 rounded-full text-sm font-medium ${badge.color}`}
            >
              <span className="mr-1">{badge.icon}</span>
              {badge.name}
            </div>
          ))}
          
          {getBadges().length === 0 && (
            <p className="text-gray-500">Aucun badge obtenu pour le moment. Continuez à étudier !</p>
          )}
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">QCM par matière</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Distribution des scores</h3>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      {/* Historique récent */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Activité récente</h3>
        
        {qcmStats.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Aucune activité récente. Commencez par faire un QCM !
          </p>
        ) : (
          <div className="space-y-3">
            {qcmStats.slice(-5).reverse().map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{stat.subject}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(stat.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold" style={{ color: stat.score >= 80 ? '#10b981' : stat.score >= 60 ? '#f59e0b' : '#ef4444' }}>
                    {stat.score}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.timeElapsed}s
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatsDashboard