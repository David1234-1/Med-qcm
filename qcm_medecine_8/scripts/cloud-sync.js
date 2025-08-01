// Gestionnaire de synchronisation cloud pour QCM Médecine 8
class CloudSync {
  constructor() {
    this.db = null;
    this.auth = null;
    this.syncInterval = null;
    this.lastSync = null;
    this.init();
  }

  async init() {
    // Attendre que Firebase soit initialisé
    await this.waitForFirebase();
    
    this.db = window.Firebase.db;
    this.auth = window.Firebase.auth;
    
    // Démarrer la synchronisation automatique
    this.startAutoSync();
    
    // Synchroniser avant la fermeture de la page
    window.addEventListener('beforeunload', () => {
      this.syncUserData();
    });
  }

  async waitForFirebase() {
    return new Promise((resolve) => {
      const checkFirebase = () => {
        if (window.Firebase && window.Firebase.db && window.Firebase.auth) {
          resolve();
        } else {
          setTimeout(checkFirebase, 100);
        }
      };
      checkFirebase();
    });
  }

  startAutoSync() {
    // Synchroniser toutes les 5 minutes
    this.syncInterval = setInterval(() => {
      this.syncUserData();
    }, 5 * 60 * 1000);
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async syncUserData() {
    const user = this.auth.currentUser;
    if (!user) return;

    try {
      const userData = this.getLocalUserData();
      await this.saveUserDataToCloud(user.uid, userData);
      this.lastSync = new Date().toISOString();
      
      console.log('Synchronisation cloud réussie');
    } catch (error) {
      console.error('Erreur de synchronisation cloud:', error);
    }
  }

  getLocalUserData() {
    return {
      documents: this.getLocalDocuments(),
      qcm: this.getLocalQCM(),
      flashcards: this.getLocalFlashcards(),
      resumes: this.getLocalResumes(),
      statistics: this.getLocalStatistics(),
      settings: this.getLocalSettings(),
      lastSync: new Date().toISOString()
    };
  }

  getLocalDocuments() {
    return JSON.parse(localStorage.getItem('qcm_documents') || '[]');
  }

  getLocalQCM() {
    return JSON.parse(localStorage.getItem('qcm_data') || '{}');
  }

  getLocalFlashcards() {
    return JSON.parse(localStorage.getItem('qcm_flashcards') || '{}');
  }

  getLocalResumes() {
    return JSON.parse(localStorage.getItem('qcm_resumes') || '{}');
  }

  getLocalStatistics() {
    return JSON.parse(localStorage.getItem('qcm_statistics') || '{}');
  }

  getLocalSettings() {
    return JSON.parse(localStorage.getItem('qcm_settings') || '{}');
  }

  async saveUserDataToCloud(userId, data) {
    const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');
    
    const userDocRef = doc(this.db, 'users', userId);
    await setDoc(userDocRef, data, { merge: true });
  }

  async loadUserDataFromCloud() {
    const user = this.auth.currentUser;
    if (!user) return null;

    try {
      const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');
      
      const userDocRef = doc(this.db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        return userDoc.data();
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors du chargement des données cloud:', error);
      return null;
    }
  }

  async mergeCloudData() {
    const cloudData = await this.loadUserDataFromCloud();
    if (!cloudData) return;

    // Fusionner les données cloud avec les données locales
    this.mergeDocuments(cloudData.documents || []);
    this.mergeQCM(cloudData.qcm || {});
    this.mergeFlashcards(cloudData.flashcards || {});
    this.mergeResumes(cloudData.resumes || {});
    this.mergeStatistics(cloudData.statistics || {});
    this.mergeSettings(cloudData.settings || {});
  }

  mergeDocuments(cloudDocuments) {
    const localDocuments = this.getLocalDocuments();
    const merged = [...localDocuments];
    
    cloudDocuments.forEach(cloudDoc => {
      const existingIndex = merged.findIndex(doc => doc.id === cloudDoc.id);
      if (existingIndex === -1) {
        merged.push(cloudDoc);
      } else {
        // Garder la version la plus récente
        const localDoc = merged[existingIndex];
        if (cloudDoc.lastModified > localDoc.lastModified) {
          merged[existingIndex] = cloudDoc;
        }
      }
    });
    
    localStorage.setItem('qcm_documents', JSON.stringify(merged));
  }

  mergeQCM(cloudQCM) {
    const localQCM = this.getLocalQCM();
    const merged = { ...localQCM };
    
    Object.keys(cloudQCM).forEach(subject => {
      if (!merged[subject] || cloudQCM[subject].lastModified > merged[subject].lastModified) {
        merged[subject] = cloudQCM[subject];
      }
    });
    
    localStorage.setItem('qcm_data', JSON.stringify(merged));
  }

  mergeFlashcards(cloudFlashcards) {
    const localFlashcards = this.getLocalFlashcards();
    const merged = { ...localFlashcards };
    
    Object.keys(cloudFlashcards).forEach(subject => {
      if (!merged[subject] || cloudFlashcards[subject].lastModified > merged[subject].lastModified) {
        merged[subject] = cloudFlashcards[subject];
      }
    });
    
    localStorage.setItem('qcm_flashcards', JSON.stringify(merged));
  }

  mergeResumes(cloudResumes) {
    const localResumes = this.getLocalResumes();
    const merged = { ...localResumes };
    
    Object.keys(cloudResumes).forEach(subject => {
      if (!merged[subject] || cloudResumes[subject].lastModified > merged[subject].lastModified) {
        merged[subject] = cloudResumes[subject];
      }
    });
    
    localStorage.setItem('qcm_resumes', JSON.stringify(merged));
  }

  mergeStatistics(cloudStatistics) {
    const localStatistics = this.getLocalStatistics();
    const merged = { ...localStatistics };
    
    Object.keys(cloudStatistics).forEach(key => {
      if (!merged[key] || cloudStatistics[key].lastUpdated > merged[key].lastUpdated) {
        merged[key] = cloudStatistics[key];
      }
    });
    
    localStorage.setItem('qcm_statistics', JSON.stringify(merged));
  }

  mergeSettings(cloudSettings) {
    const localSettings = this.getLocalSettings();
    const merged = { ...localSettings, ...cloudSettings };
    localStorage.setItem('qcm_settings', JSON.stringify(merged));
  }

  // Méthodes de sauvegarde spécifiques
  async saveDocument(document) {
    const documents = this.getLocalDocuments();
    const existingIndex = documents.findIndex(doc => doc.id === document.id);
    
    if (existingIndex !== -1) {
      documents[existingIndex] = { ...document, lastModified: new Date().toISOString() };
    } else {
      documents.push({ ...document, lastModified: new Date().toISOString() });
    }
    
    localStorage.setItem('qcm_documents', JSON.stringify(documents));
    await this.syncUserData();
  }

  async saveQCM(subject, qcmData) {
    const qcm = this.getLocalQCM();
    qcm[subject] = { ...qcmData, lastModified: new Date().toISOString() };
    
    localStorage.setItem('qcm_data', JSON.stringify(qcm));
    await this.syncUserData();
  }

  async saveFlashcards(subject, flashcardsData) {
    const flashcards = this.getLocalFlashcards();
    flashcards[subject] = { ...flashcardsData, lastModified: new Date().toISOString() };
    
    localStorage.setItem('qcm_flashcards', JSON.stringify(flashcards));
    await this.syncUserData();
  }

  async saveResume(subject, resumeData) {
    const resumes = this.getLocalResumes();
    resumes[subject] = { ...resumeData, lastModified: new Date().toISOString() };
    
    localStorage.setItem('qcm_resumes', JSON.stringify(resumes));
    await this.syncUserData();
  }

  async saveStatistics(statistics) {
    const stats = this.getLocalStatistics();
    const updatedStats = { ...stats, ...statistics, lastUpdated: new Date().toISOString() };
    
    localStorage.setItem('qcm_statistics', JSON.stringify(updatedStats));
    await this.syncUserData();
  }

  async saveSettings(settings) {
    const currentSettings = this.getLocalSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    
    localStorage.setItem('qcm_settings', JSON.stringify(updatedSettings));
    await this.syncUserData();
  }

  // Méthodes de récupération
  async getUserData() {
    // Essayer de charger depuis le cloud d'abord
    await this.mergeCloudData();
    
    return {
      documents: this.getLocalDocuments(),
      qcm: this.getLocalQCM(),
      flashcards: this.getLocalFlashcards(),
      resumes: this.getLocalResumes(),
      statistics: this.getLocalStatistics(),
      settings: this.getLocalSettings()
    };
  }

  async getUserStatistics() {
    const stats = this.getLocalStatistics();
    return {
      documents: this.getLocalDocuments().length,
      qcm: Object.keys(this.getLocalQCM()).length,
      flashcards: Object.keys(this.getLocalFlashcards()).length,
      averageScore: stats.averageScore || 0,
      totalQuestions: stats.totalQuestions || 0,
      totalAnswers: stats.totalAnswers || 0
    };
  }

  // Méthodes de suppression
  async deleteDocument(documentId) {
    const documents = this.getLocalDocuments();
    const filtered = documents.filter(doc => doc.id !== documentId);
    
    localStorage.setItem('qcm_documents', JSON.stringify(filtered));
    await this.syncUserData();
  }

  async deleteQCM(subject) {
    const qcm = this.getLocalQCM();
    delete qcm[subject];
    
    localStorage.setItem('qcm_data', JSON.stringify(qcm));
    await this.syncUserData();
  }

  async deleteFlashcards(subject) {
    const flashcards = this.getLocalFlashcards();
    delete flashcards[subject];
    
    localStorage.setItem('qcm_flashcards', JSON.stringify(flashcards));
    await this.syncUserData();
  }

  // Méthodes utilitaires
  isOnline() {
    return navigator.onLine;
  }

  getLastSync() {
    return this.lastSync;
  }

  async forceSync() {
    await this.syncUserData();
  }

  // Export/Import de données
  exportUserData() {
    const data = {
      documents: this.getLocalDocuments(),
      qcm: this.getLocalQCM(),
      flashcards: this.getLocalFlashcards(),
      resumes: this.getLocalResumes(),
      statistics: this.getLocalStatistics(),
      settings: this.getLocalSettings(),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `qcm-medecine-8-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  async importUserData(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.documents) localStorage.setItem('qcm_documents', JSON.stringify(data.documents));
      if (data.qcm) localStorage.setItem('qcm_data', JSON.stringify(data.qcm));
      if (data.flashcards) localStorage.setItem('qcm_flashcards', JSON.stringify(data.flashcards));
      if (data.resumes) localStorage.setItem('qcm_resumes', JSON.stringify(data.resumes));
      if (data.statistics) localStorage.setItem('qcm_statistics', JSON.stringify(data.statistics));
      if (data.settings) localStorage.setItem('qcm_settings', JSON.stringify(data.settings));
      
      await this.syncUserData();
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      return false;
    }
  }
}