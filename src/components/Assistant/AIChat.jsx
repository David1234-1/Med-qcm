import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Copy, Trash2, Edit3 } from 'lucide-react'
import { aiService } from '../../lib/aiService'
import { dataAPI } from '../../lib/supabase'

const AIChat = () => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await aiService.chatWithAI(inputMessage)
      
      const aiMessage = {
        id: response.id,
        type: 'ai',
        content: response.response,
        timestamp: response.timestamp
      }

      setMessages(prev => [...prev, aiMessage])

      // Sauvegarder la conversation
      await dataAPI.addChat({
        messages: [userMessage, aiMessage],
        subject: 'Assistant IA'
      })
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const deleteMessage = (messageId) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
  }

  const editMessage = (messageId, newContent) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, content: newContent } : msg
    ))
    setEditingMessageId(null)
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="card max-w-4xl mx-auto h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
        <div className="bg-primary p-2 rounded-lg">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Assistant IA</h2>
          <p className="text-sm text-gray-600">Posez vos questions médicales</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Bonjour ! Je suis votre assistant médical.</p>
            <p className="text-sm">Posez-moi vos questions sur l'anatomie, la physiologie ou les pathologies.</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-primary text-white'
                  : message.type === 'error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.type === 'user' ? (
                  <User className="w-4 h-4 mt-1 flex-shrink-0" />
                ) : (
                  <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                )}
                
                <div className="flex-1">
                  {editingMessageId === message.id ? (
                    <input
                      type="text"
                      value={message.content}
                      onChange={(e) => {
                        setMessages(prev => prev.map(msg => 
                          msg.id === message.id ? { ...msg, content: e.target.value } : msg
                        ))
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          editMessage(message.id, message.content)
                        }
                      }}
                      onBlur={() => editMessage(message.id, message.content)}
                      className="w-full bg-transparent border-none outline-none"
                      autoFocus
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {formatTimestamp(message.timestamp)}
                    </span>
                    
                    <div className="flex items-center space-x-1">
                      {message.type === 'ai' && (
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Copier"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      )}
                      
                      {message.type === 'user' && (
                        <button
                          onClick={() => setEditingMessageId(message.id)}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                          title="Modifier"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteMessage(message.id)}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Posez votre question..."
            className="flex-1 input resize-none"
            rows="2"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="btn btn-primary px-4"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
        </p>
      </div>
    </div>
  )
}

export default AIChat