import React, { useState } from 'react'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
import { BookOpen, Heart, Brain, Award } from 'lucide-react'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section de présentation */}
        <div className="hidden lg:flex flex-col justify-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              QCM Médecine
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Votre assistant d'étude intelligent pour réussir vos examens de médecine
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Importez vos cours</h3>
                  <p className="text-gray-600">Téléchargez vos PDF et laissez l'IA analyser le contenu</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-secondary/10 p-3 rounded-lg">
                  <Brain className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">QCM automatiques</h3>
                  <p className="text-gray-600">Générez des questions d'entraînement personnalisées</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-success/10 p-3 rounded-lg">
                  <Heart className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Flashcards intelligentes</h3>
                  <p className="text-gray-600">Révisez efficacement avec des cartes mémoire adaptées</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-warning/10 p-3 rounded-lg">
                  <Award className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Suivi de progression</h3>
                  <p className="text-gray-600">Visualisez vos progrès et débloquez des badges</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section d'authentification */}
        <div className="flex items-center justify-center">
          {isLogin ? (
            <LoginForm onSwitchToSignUp={() => setIsLogin(false)} />
          ) : (
            <SignUpForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPage