import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  BookOpen, 
  Brain, 
  Heart, 
  MessageSquare, 
  BarChart3, 
  User, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react'

const Header = () => {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Cours', href: '/courses', icon: BookOpen },
    { name: 'QCM', href: '/qcm', icon: Brain },
    { name: 'Flashcards', href: '/flashcards', icon: Heart },
    { name: 'Assistant', href: '/assistant', icon: MessageSquare },
    { name: 'Statistiques', href: '/stats', icon: BarChart3 },
  ]

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">QCM Médecine</span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Menu utilisateur */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{user?.email}</span>
            </div>
            
            <button
              onClick={handleSignOut}
              className="hidden md:flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>

            {/* Menu mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors w-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header