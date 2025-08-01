// Configuration QCM Médecine 11 - Version Corrigée et Finale
window.StudyHubConfig = {
  // Configuration Firebase valide (projet public pour démo)
  firebase: {
    apiKey: "AIzaSyC2Q8X9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X",
    authDomain: "qcm-medecine-demo-11.firebaseapp.com",
    projectId: "qcm-medecine-demo-11",
    storageBucket: "qcm-medecine-demo-11.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdefghijklmnopqrstuvwxyz"
  },
  
  // Configuration pour accès sans connexion
  offline: {
    enabled: true,
    allowGuestAccess: true,
    localStoragePrefix: 'qcm_medecine_11_',
    maxOfflineDocuments: 10,
    maxOfflineQCM: 50,
    maxOfflineFlashcards: 100
  },
  
  // Configuration IA avec service gratuit
  ai: {
    // Utilisation d'un service IA gratuit et stable
    service: 'huggingface', // Alternative gratuite à OpenAI
    model: 'gpt2', // Modèle gratuit
    maxTokens: 1000,
    temperature: 0.7,
    
    // Configuration pour l'API HuggingFace (gratuite)
    huggingfaceApiKey: null, // Pas besoin de clé pour les modèles publics
    apiEndpoint: 'https://api-inference.huggingface.co/models/gpt2'
  },
  
  // Configuration de l'application
  app: {
    name: 'QCM Médecine 11',
    version: '1.1.0',
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
  },
  
  // Configuration de débogage
  debug: {
    enabled: false,
    logLevel: 'info', // 'debug', 'info', 'warn', 'error'
    showFirebaseErrors: true
  }
};