import React, { useState } from 'react'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import { extractTextFromPDF, validatePDF } from '../../lib/pdfExtractor'
import { dataAPI } from '../../lib/supabase'
import { aiService } from '../../lib/aiService'

const CourseUpload = () => {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [extractedText, setExtractedText] = useState('')
  const [subject, setSubject] = useState('')
  const [showTextPreview, setShowTextPreview] = useState(false)

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setError('')
    setSuccess('')
    
    selectedFiles.forEach(file => {
      try {
        validatePDF(file)
        setFiles(prev => [...prev, file])
      } catch (error) {
        setError(error.message)
      }
    })
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const extractText = async () => {
    if (files.length === 0) {
      setError('Veuillez sélectionner au moins un fichier PDF')
      return
    }

    if (!subject.trim()) {
      setError('Veuillez saisir une matière')
      return
    }

    setProcessing(true)
    setError('')
    setSuccess('')

    try {
      let allText = ''
      
      for (const file of files) {
        const text = await extractTextFromPDF(file)
        allText += `\n\n--- ${file.name} ---\n\n${text}`
      }

      setExtractedText(allText)
      setShowTextPreview(true)
      setSuccess('Texte extrait avec succès !')
    } catch (error) {
      setError(error.message)
    } finally {
      setProcessing(false)
    }
  }

  const processWithAI = async () => {
    if (!extractedText.trim()) {
      setError('Aucun texte à traiter')
      return
    }

    setProcessing(true)
    setError('')

    try {
      // Sauvegarder le cours
      const course = await dataAPI.addCourse({
        subject,
        content: extractedText,
        files: files.map(f => f.name)
      })

      // Générer QCM, flashcards et résumé
      const [qcm, flashcards, summary] = await Promise.all([
        aiService.generateQCM(extractedText, subject),
        aiService.generateFlashcards(extractedText, subject),
        aiService.generateSummary(extractedText, subject)
      ])

      // Sauvegarder les résultats
      await Promise.all([
        dataAPI.addQCM(qcm),
        dataAPI.addFlashcards(flashcards),
        dataAPI.addStats({
          type: 'course_processed',
          subject,
          courseId: course.id
        })
      ])

      setSuccess(`Cours traité avec succès ! ${qcm.totalQuestions} QCM et ${flashcards.totalCards} flashcards générés.`)
      
      // Reset form
      setFiles([])
      setSubject('')
      setExtractedText('')
      setShowTextPreview(false)
    } catch (error) {
      setError('Erreur lors du traitement : ' + error.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Importer vos cours</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}

        {/* Sélection de matière */}
        <div className="mb-6">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Matière *
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input"
            placeholder="Ex: Cardiologie, Anatomie, Physiologie..."
            required
          />
        </div>

        {/* Upload de fichiers */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fichiers PDF *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Glissez vos fichiers PDF ici ou cliquez pour sélectionner
              </p>
              <p className="text-sm text-gray-500">
                Taille maximale : 10MB par fichier
              </p>
            </label>
          </div>
        </div>

        {/* Liste des fichiers */}
        {files.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Fichiers sélectionnés :</h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(file.size / 1024 / 1024).toFixed(1)} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex space-x-4">
          <button
            onClick={extractText}
            disabled={files.length === 0 || !subject.trim() || processing}
            className="btn btn-primary"
          >
            {processing ? (
              <>
                <div className="loading"></div>
                Extraction...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Extraire le texte
              </>
            )}
          </button>

          {extractedText && (
            <button
              onClick={processWithAI}
              disabled={processing}
              className="btn btn-secondary"
            >
              {processing ? (
                <>
                  <div className="loading"></div>
                  Traitement IA...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Générer QCM & Flashcards
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Aperçu du texte extrait */}
      {showTextPreview && extractedText && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Aperçu du texte extrait</h3>
            <button
              onClick={() => setShowTextPreview(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">{extractedText}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseUpload