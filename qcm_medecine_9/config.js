// Configuration QCM Médecine 9 - Version avec authentification locale
window.StudyHubConfig = {
  // Configuration d'authentification locale (pas besoin de Firebase)
  auth: {
    type: 'local', // Authentification locale
    enableGoogle: false, // Désactivé pour simplifier
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 heures
    maxLoginAttempts: 5
  },
  
  // Configuration IA avec service gratuit
  ai: {
    // Utilisation d'un service IA gratuit et stable
    service: 'local', // Service IA local intégré
    model: 'medical', // Modèle médical spécialisé
    maxTokens: 1000,
    temperature: 0.7,
    
    // Base de connaissances médicales intégrée
    knowledgeBase: 'medical'
  },
  
  // Configuration de l'application
  app: {
    name: 'QCM Médecine 9',
    version: '1.0.0',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedFileTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ],
    syncInterval: 5 * 60 * 1000, // 5 minutes
    maxQCMQuestions: 50,
    maxFlashcards: 100
  },
  
  // Configuration des notifications
  notifications: {
    enabled: true,
    duration: 5000, // 5 secondes
    position: 'top-right'
  },
  
  // Configuration du thème
  theme: {
    default: 'light',
    autoDetect: true
  },
  
  // Configuration spécifique médecine
  medicine: {
    subjects: [
      'Anatomie',
      'Physiologie', 
      'Biochimie',
      'Histologie',
      'Embryologie',
      'Immunologie',
      'Microbiologie',
      'Pharmacologie',
      'Pathologie',
      'Sémiologie',
      'Autre'
    ],
    defaultSubject: 'Anatomie'
  }
};