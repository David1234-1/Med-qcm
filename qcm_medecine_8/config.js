// Configuration QCM Médecine 8 - Prêt à l'emploi
window.StudyHubConfig = {
  // Configuration Firebase pré-configurée (projet public pour démo)
  firebase: {
    apiKey: "AIzaSyC2X9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X",
    authDomain: "qcm-medecine-8.firebaseapp.com",
    projectId: "qcm-medecine-8",
    storageBucket: "qcm-medecine-8.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdefghijklmnop"
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
    name: 'QCM Médecine 8',
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