// Gestionnaire d'authentification local pour QCM Médecine 9
class AuthManager {
  constructor() {
    this.currentUser = null;
    this.authOverlay = null;
    this.mainApp = null;
    this.loginAttempts = 0;
    this.maxLoginAttempts = 5;
    this.init();
  }

  init() {
    this.authOverlay = document.getElementById('auth-overlay');
    this.mainApp = document.getElementById('main-app');
    
    // Initialiser les événements
    this.initEvents();
    
    // Vérifier si l'utilisateur est déjà connecté
    this.checkExistingSession();
  }

  initEvents() {
    // Formulaires d'authentification
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.login();
      });
    }
    
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.register();
      });
    }
    
    // Lien mot de passe oublié
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.showForgotPassword();
      });
    }

    // Gestion des onglets d'authentification
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

  checkExistingSession() {
    const sessionData = localStorage.getItem('qcm_session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        const now = new Date().getTime();
        
        // Vérifier si la session n'est pas expirée
        if (session.expiresAt > now) {
          this.currentUser = session.user;
          this.showMainApp();
          this.updateUserInfo();
          this.showNotification('Session restaurée', 'info');
        } else {
          // Session expirée, la supprimer
          localStorage.removeItem('qcm_session');
        }
      } catch (error) {
        console.error('Erreur lors de la restauration de session:', error);
        localStorage.removeItem('qcm_session');
      }
    }
  }

  async login() {
    try {
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      
      if (!email || !password) {
        this.showNotification('Veuillez remplir tous les champs', 'error');
        return;
      }
      
      // Vérifier le nombre de tentatives
      if (this.loginAttempts >= this.maxLoginAttempts) {
        this.showNotification('Trop de tentatives. Réessayez plus tard.', 'error');
        return;
      }
      
      this.showLoading();
      
      // Vérifier les identifiants
      const user = await this.verifyCredentials(email, password);
      
      if (user) {
        this.currentUser = user;
        this.loginAttempts = 0;
        this.createSession(user);
        this.showMainApp();
        this.updateUserInfo();
        this.showNotification('Connexion réussie !', 'success');
      } else {
        this.loginAttempts++;
        this.showNotification('Email ou mot de passe incorrect', 'error');
      }
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
      this.showNotification('Erreur lors de la connexion', 'error');
    } finally {
      this.hideLoading();
    }
  }

  async register() {
    try {
      const name = document.getElementById('register-name').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm-password').value;
      
      if (!name || !email || !password || !confirmPassword) {
        this.showNotification('Veuillez remplir tous les champs', 'error');
        return;
      }
      
      if (password !== confirmPassword) {
        this.showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
      }
      
      if (password.length < 6) {
        this.showNotification('Le mot de passe doit contenir au moins 6 caractères', 'error');
        return;
      }
      
      if (!this.isValidEmail(email)) {
        this.showNotification('Veuillez entrer une adresse email valide', 'error');
        return;
      }
      
      this.showLoading();
      
      // Vérifier si l'email existe déjà
      const existingUser = await this.getUserByEmail(email);
      if (existingUser) {
        this.showNotification('Un compte existe déjà avec cet email', 'error');
        return;
      }
      
      // Créer le nouvel utilisateur
      const newUser = await this.createUser(name, email, password);
      
      if (newUser) {
        this.currentUser = newUser;
        this.createSession(newUser);
        this.showMainApp();
        this.updateUserInfo();
        this.showNotification('Compte créé avec succès !', 'success');
      }
      
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      this.showNotification('Erreur lors de la création du compte', 'error');
    } finally {
      this.hideLoading();
    }
  }

  async verifyCredentials(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user && await this.verifyPassword(password, user.password)) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      };
    }
    
    return null;
  }

  async getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  async createUser(name, email, password) {
    const users = this.getUsers();
    
    // Vérifier si l'email existe déjà
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return null;
    }
    
    const newUser = {
      id: this.generateUserId(),
      name: name,
      email: email,
      password: await this.hashPassword(password),
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    this.saveUsers(users);
    
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt
    };
  }

  getUsers() {
    const usersData = localStorage.getItem('qcm_users');
    return usersData ? JSON.parse(usersData) : [];
  }

  saveUsers(users) {
    localStorage.setItem('qcm_users', JSON.stringify(users));
  }

  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async hashPassword(password) {
    // Hachage simple pour la démo (en production, utiliser bcrypt)
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'qcm_medecine_salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async verifyPassword(password, hashedPassword) {
    const hashedInput = await this.hashPassword(password);
    return hashedInput === hashedPassword;
  }

  createSession(user) {
    const session = {
      user: user,
      createdAt: new Date().getTime(),
      expiresAt: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 heures
    };
    
    localStorage.setItem('qcm_session', JSON.stringify(session));
  }

  async logout() {
    this.currentUser = null;
    localStorage.removeItem('qcm_session');
    this.showAuthOverlay();
    this.showNotification('Déconnexion réussie', 'info');
  }

  showForgotPassword() {
    const email = document.getElementById('login-email').value;
    if (!email) {
      this.showNotification('Veuillez d\'abord saisir votre email', 'error');
      return;
    }
    
    this.showNotification('Fonctionnalité en cours de développement', 'info');
  }

  showMainApp() {
    if (this.authOverlay) {
      this.authOverlay.style.display = 'none';
    }
    if (this.mainApp) {
      this.mainApp.style.display = 'block';
    }
  }

  showAuthOverlay() {
    if (this.authOverlay) {
      this.authOverlay.style.display = 'flex';
    }
    if (this.mainApp) {
      this.mainApp.style.display = 'none';
    }
  }

  updateUserInfo() {
    if (this.currentUser) {
      const userNameElement = document.getElementById('user-name');
      const userEmailElement = document.getElementById('user-email');
      
      if (userNameElement) {
        userNameElement.textContent = this.currentUser.name;
      }
      
      if (userEmailElement) {
        userEmailElement.textContent = this.currentUser.email;
      }
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showLoading() {
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

  showNotification(message, type = 'info') {
    // Utiliser le gestionnaire de notifications global s'il existe
    if (window.QCMMedicineApp && window.QCMMedicineApp.notificationManager) {
      window.QCMMedicineApp.notificationManager.show(message, type);
    } else {
      // Fallback simple
      const notification = document.createElement('div');
      notification.className = `alert alert-${type}`;
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 1rem;
        border-radius: 8px;
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow-lg);
        max-width: 300px;
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 5000);
    }
  }

  // Méthodes utilitaires
  isAuthenticated() {
    return !!this.currentUser;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getUserId() {
    return this.currentUser ? this.currentUser.id : null;
  }

  getUserEmail() {
    return this.currentUser ? this.currentUser.email : null;
  }

  getUserDisplayName() {
    return this.currentUser ? this.currentUser.name : null;
  }
}