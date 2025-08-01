import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, Target } from 'lucide-react'
import Confetti from 'react-confetti'
import { dataAPI } from '../../lib/supabase'

const QCMQuiz = ({ qcmData, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [timeStarted, setTimeStarted] = useState(null)
  const [timeElapsed, setTimeElapsed] = useState(0)

  const currentQuestion = qcmData.questions[currentQuestionIndex]
  const totalQuestions = qcmData.questions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  useEffect(() => {
    if (!timeStarted) {
      setTimeStarted(Date.now())
    }
  }, [timeStarted])

  useEffect(() => {
    if (timeStarted && !showResults) {
      const interval = setInterval(() => {
        setTimeElapsed(Date.now() - timeStarted)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timeStarted, showResults])

  const handleAnswerSelect = (answerIndex) => {
    if (showResults) return

    setSelectedAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[currentQuestionIndex] = answerIndex
      return newAnswers
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      finishQuiz()
    }
  }

  const finishQuiz = () => {
    const correctAnswers = qcmData.questions.reduce((count, question, index) => {
      return count + (selectedAnswers[index] === question.correctAnswer ? 1 : 0)
    }, 0)

    const finalScore = Math.round((correctAnswers / totalQuestions) * 100)
    setScore(finalScore)
    setShowResults(true)

    // Sauvegarder les statistiques
    dataAPI.addStats({
      type: 'qcm_completed',
      subject: qcmData.subject,
      score: finalScore,
      totalQuestions,
      correctAnswers,
      timeElapsed: Math.round(timeElapsed / 1000),
      qcmId: qcmData.id
    })

    // Afficher les confettis si score > 80%
    if (finalScore >= 80) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }

    if (onComplete) {
      onComplete({
        score: finalScore,
        totalQuestions,
        correctAnswers,
        timeElapsed: Math.round(timeElapsed / 1000)
      })
    }
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers([])
    setShowResults(false)
    setScore(0)
    setTimeStarted(Date.now())
    setTimeElapsed(0)
  }

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (showResults) {
    return (
      <div className="card max-w-2xl mx-auto">
        {showConfetti && <Confetti />}
        
        <div className="text-center">
          <div className="mb-6">
            {score >= 80 ? (
              <div className="flex justify-center mb-4">
                <Trophy className="w-16 h-16 text-yellow-500" />
              </div>
            ) : (
              <div className="flex justify-center mb-4">
                <Target className="w-16 h-16 text-blue-500" />
              </div>
            )}
            
            <h2 className="text-3xl font-bold mb-2">
              {score >= 80 ? 'Excellent !' : score >= 60 ? 'Bien joué !' : 'Continuez vos efforts !'}
            </h2>
            
            <div className="text-6xl font-bold mb-4" style={{ color: score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444' }}>
              {score}%
            </div>
            
            <p className="text-gray-600 mb-6">
              {score} bonnes réponses sur {totalQuestions} questions
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{Math.round(timeElapsed / 1000)}s</div>
                <div className="text-sm text-gray-600">Temps total</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round((timeElapsed / 1000) / totalQuestions)}s
                </div>
                <div className="text-sm text-gray-600">Temps par question</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={restartQuiz}
              className="btn btn-primary w-full"
            >
              <RotateCcw className="w-4 h-4" />
              Recommencer
            </button>
            
            <button
              onClick={() => window.location.href = '/qcm'}
              className="btn btn-secondary w-full"
            >
              Retour aux QCM
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card max-w-4xl mx-auto">
      {/* Header avec progression */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Question {currentQuestionIndex + 1} sur {totalQuestions}
          </h2>
          <div className="text-sm text-gray-500">
            {formatTime(timeElapsed)}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestionIndex] === index
            const isCorrect = index === currentQuestion.correctAnswer
            const showCorrect = showResults && isCorrect
            const showIncorrect = showResults && isSelected && !isCorrect

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResults}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                } ${
                  showCorrect ? 'border-success bg-success/10' : ''
                } ${
                  showIncorrect ? 'border-error bg-error/10' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">{option}</span>
                  <div className="flex items-center space-x-2">
                    {showCorrect && <CheckCircle className="w-5 h-5 text-success" />}
                    {showIncorrect && <XCircle className="w-5 h-5 text-error" />}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Explication (si résultats affichés) */}
      {showResults && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Explication :</h4>
          <p className="text-blue-800">{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Boutons de navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="btn btn-secondary"
        >
          Précédent
        </button>

        <button
          onClick={handleNextQuestion}
          disabled={selectedAnswers[currentQuestionIndex] === undefined}
          className="btn btn-primary"
        >
          {currentQuestionIndex === totalQuestions - 1 ? (
            'Terminer'
          ) : (
            <>
              Suivant
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default QCMQuiz