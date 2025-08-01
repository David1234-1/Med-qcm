import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw, Eye, EyeOff, Bookmark, BookmarkCheck } from 'lucide-react'

const FlashcardViewer = ({ flashcardData, onComplete }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [markedCards, setMarkedCards] = useState(new Set())
  const [showOnlyMarked, setShowOnlyMarked] = useState(false)

  const currentCard = flashcardData.flashcards[currentCardIndex]
  const totalCards = flashcardData.flashcards.length
  const progress = ((currentCardIndex + 1) / totalCards) * 100

  const filteredCards = showOnlyMarked 
    ? flashcardData.flashcards.filter((_, index) => markedCards.has(index))
    : flashcardData.flashcards

  const handleNextCard = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(prev => prev + 1)
      setIsFlipped(false)
    }
  }

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1)
      setIsFlipped(false)
    }
  }

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped)
  }

  const handleMarkCard = () => {
    setMarkedCards(prev => {
      const newMarked = new Set(prev)
      if (newMarked.has(currentCardIndex)) {
        newMarked.delete(currentCardIndex)
      } else {
        newMarked.add(currentCardIndex)
      }
      return newMarked
    })
  }

  const handleRestart = () => {
    setCurrentCardIndex(0)
    setIsFlipped(false)
  }

  const handleToggleMarkedOnly = () => {
    setShowOnlyMarked(!showOnlyMarked)
    setCurrentCardIndex(0)
    setIsFlipped(false)
  }

  const isMarked = markedCards.has(currentCardIndex)

  return (
    <div className="card max-w-4xl mx-auto">
      {/* Header avec progression */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Carte {currentCardIndex + 1} sur {totalCards}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleMarkedOnly}
              className={`btn btn-secondary text-sm ${
                showOnlyMarked ? 'bg-primary text-white' : ''
              }`}
            >
              {showOnlyMarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              {showOnlyMarked ? 'Marquées' : 'Toutes'}
            </button>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Carte flashcard */}
      <div className="mb-8">
        <div 
          className="relative w-full h-96 cursor-pointer perspective-1000"
          onClick={handleFlipCard}
        >
          <div 
            className={`absolute inset-0 w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* Face avant - Question */}
            <div className="absolute inset-0 w-full h-full backface-hidden">
              <div className="w-full h-full bg-white border-2 border-gray-200 rounded-xl p-8 flex flex-col justify-center items-center shadow-lg">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-4">Question</div>
                  <h3 className="text-2xl font-medium text-gray-900 leading-relaxed">
                    {currentCard.question}
                  </h3>
                  <div className="mt-6 text-sm text-gray-500">
                    Cliquez pour voir la réponse
                  </div>
                </div>
              </div>
            </div>

            {/* Face arrière - Réponse */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-xl p-8 flex flex-col justify-center items-center shadow-lg">
                <div className="text-center">
                  <div className="text-sm text-blue-600 mb-4">Réponse</div>
                  <p className="text-xl text-gray-900 leading-relaxed">
                    {currentCard.answer}
                  </p>
                  <div className="mt-6 text-sm text-blue-600">
                    Cliquez pour voir la question
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contrôles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePreviousCard}
            disabled={currentCardIndex === 0}
            className="btn btn-secondary"
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </button>

          <button
            onClick={handleFlipCard}
            className="btn btn-primary"
          >
            {isFlipped ? (
              <>
                <EyeOff className="w-4 h-4" />
                Voir question
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Voir réponse
              </>
            )}
          </button>

          <button
            onClick={handleNextCard}
            disabled={currentCardIndex === totalCards - 1}
            className="btn btn-secondary"
          >
            Suivant
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleMarkCard}
            className={`p-2 rounded-lg transition-colors ${
              isMarked 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Bookmark className="w-5 h-5" />
          </button>

          <button
            onClick={handleRestart}
            className="btn btn-secondary"
          >
            <RotateCcw className="w-4 h-4" />
            Recommencer
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{totalCards}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-700">{markedCards.size}</div>
          <div className="text-sm text-yellow-600">Marquées</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-700">
            {Math.round((markedCards.size / totalCards) * 100)}%
          </div>
          <div className="text-sm text-blue-600">Progression</div>
        </div>
      </div>
    </div>
  )
}

export default FlashcardViewer