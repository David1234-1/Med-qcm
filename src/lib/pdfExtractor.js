import * as pdfjsLib from 'pdfjs-dist'

// Configuration de pdfjs-dist pour fonctionner dans le navigateur
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let fullText = ''
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map(item => item.str).join(' ')
      fullText += pageText + '\n'
    }
    
    return fullText.trim()
  } catch (error) {
    console.error('Erreur lors de l\'extraction du PDF:', error)
    throw new Error('Impossible d\'extraire le texte du PDF. Vérifiez que le fichier est valide.')
  }
}

export const validatePDF = (file) => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['application/pdf']
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Seuls les fichiers PDF sont acceptés.')
  }
  
  if (file.size > maxSize) {
    throw new Error('Le fichier est trop volumineux. Taille maximale: 10MB.')
  }
  
  return true
}