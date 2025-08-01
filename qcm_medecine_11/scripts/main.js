// Script principal pour QCM Médecine 8
class QCMMedicineApp {
  constructor() {
    this.currentPage = 'dashboard';
    this.pages = {};
    this.userData = null;
    this.init();
  }

  async init() {
    // Initialiser les services
    this.aiService = new AIService();
    this.notificationManager = new NotificationManager();
    
    // Attendre que Firebase soit initialisé
    await this.waitForFirebase();
    
    // Initialiser l'authentification
    this.authManager = new AuthManager();
    await this.authManager.init();
    
    // Initialiser la synchronisation cloud
    this.cloudSync = new CloudSync();
    await this.cloudSync.init();
    
    // Initialiser les gestionnaires de pages
    this.initPageManagers();
    
    // Initialiser l'interface
    this.initUI();
    
    // Charger les données utilisateur
    await this.loadUserData();
    
    // Initialiser les événements
    this.initEvents();
    
    console.log('QCM Médecine 8 initialisé avec succès');
  }

  async waitForFirebase() {
    return new Promise((resolve) => {
      const checkFirebase = () => {
        if (window.Firebase && window.Firebase.auth) {
          resolve();
        } else {
          setTimeout(checkFirebase, 100);
        }
      };
      checkFirebase();
    });
  }

  initPageManagers() {
    // Initialiser les gestionnaires de pages
    this.pages.import = new ImportManager();
    this.pages.qcm = new QCMManager();
    this.pages.flashcards = new FlashcardsManager();
    this.pages.resumes = new ResumesManager();
    this.pages.aiChat = new AIChatManager();
    this.pages.statistics = new StatisticsManager();
  }

  initUI() {
    // Initialiser le thème
    this.initTheme();
    
    // Initialiser la navigation
    this.initNavigation();
    
    // Initialiser les onglets d'authentification
    this.initAuthTabs();
  }

  initTheme() {
    const themeSwitch = document.getElementById('theme-switch');
    const html = document.documentElement;
    
    // Charger le thème sauvegardé
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);
    
    // Événement de changement de thème
    themeSwitch.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      this.updateThemeIcon(newTheme);
    });
  }

  updateThemeIcon(theme) {
    const themeSwitch = document.getElementById('theme-switch');
    const icon = themeSwitch.querySelector('i');
    
    if (theme === 'dark') {
      icon.className = 'fas fa-moon';
    } else {
      icon.className = 'fas fa-sun';
    }
  }

  initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        this.navigateToPage(page);
      });
    });
  }

  initAuthTabs() {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    authTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Mettre à jour les onglets actifs
        authTabs.forEach(t => t.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(`${targetTab}-form`).classList.add('active');
      });
    });
  }

  async loadUserData() {
    try {
      const user = window.Firebase.auth.currentUser;
      if (user) {
        this.userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Étudiant en médecine'
        };
        
        // Mettre à jour l'interface utilisateur
        this.updateUserInterface();
        
        // Charger les statistiques
        await this.loadStatistics();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
    }
  }

  updateUserInterface() {
    if (this.userData) {
      document.getElementById('user-name').textContent = this.userData.displayName;
      document.getElementById('user-email').textContent = this.userData.email;
    }
  }

  async loadStatistics() {
    try {
      const stats = await this.cloudSync.getUserStatistics();
      this.updateDashboardStats(stats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  }

  updateDashboardStats(stats) {
    document.getElementById('documents-count').textContent = stats.documents || 0;
    document.getElementById('qcm-count').textContent = stats.qcm || 0;
    document.getElementById('flashcards-count').textContent = stats.flashcards || 0;
    document.getElementById('average-score').textContent = `${stats.averageScore || 0}%`;
  }

  initEvents() {
    // Événement de déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
      this.authManager.logout();
    });

    // Événements de navigation
    window.navigateToPage = (page) => {
      this.navigateToPage(page);
    };

    // Événements de raccourcis clavier
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            this.navigateToPage('dashboard');
            break;
          case '2':
            e.preventDefault();
            this.navigateToPage('import');
            break;
          case '3':
            e.preventDefault();
            this.navigateToPage('qcm');
            break;
          case '4':
            e.preventDefault();
            this.navigateToPage('flashcards');
            break;
          case '5':
            e.preventDefault();
            this.navigateToPage('ai-chat');
            break;
        }
      }
    });
  }

  async navigateToPage(pageName) {
    try {
      // Mettre à jour la navigation active
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

      // Masquer toutes les pages
      document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
      });

      // Afficher la page demandée
      const targetPage = document.getElementById(`${pageName}-page`);
      if (targetPage) {
        targetPage.classList.add('active');
        
        // Initialiser la page si nécessaire
        if (this.pages[pageName] && typeof this.pages[pageName].init === 'function') {
          await this.pages[pageName].init();
        }
        
        this.currentPage = pageName;
        
        // Mettre à jour l'URL sans recharger la page
        window.history.pushState({ page: pageName }, '', `/${pageName}`);
      }
    } catch (error) {
      console.error(`Erreur lors de la navigation vers ${pageName}:`, error);
      this.notificationManager.show('Erreur de navigation', 'error');
    }
  }

  // Méthodes utilitaires
  showLoading() {
    // Afficher un indicateur de chargement
    const loading = document.createElement('div');
    loading.className = 'loading-overlay';
    loading.innerHTML = `
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Chargement...</p>
      </div>
    `;
    document.body.appendChild(loading);
  }

  hideLoading() {
    const loading = document.querySelector('.loading-overlay');
    if (loading) {
      loading.remove();
    }
  }

  // Gestion des erreurs
  handleError(error, context = '') {
    console.error(`Erreur ${context}:`, error);
    this.notificationManager.show(
      `Une erreur est survenue${context ? ` lors de ${context}` : ''}`,
      'error'
    );
  }

  // Méthodes de données
  async saveUserData(data) {
    try {
      await this.cloudSync.saveUserData(data);
    } catch (error) {
      this.handleError(error, 'la sauvegarde des données');
    }
  }

  async getUserData() {
    try {
      return await this.cloudSync.getUserData();
    } catch (error) {
      this.handleError(error, 'la récupération des données');
      return null;
    }
  }
}

// Initialiser l'application quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  window.QCMMedicineApp = new QCMMedicineApp();
});

// Gestion de l'historique du navigateur
window.addEventListener('popstate', (event) => {
  if (event.state && event.state.page) {
    window.QCMMedicineApp.navigateToPage(event.state.page);
  }
});