// Gestionnaire d'authentification pour QCM Médecine 8
class AuthManager {
  constructor() {
    this.auth = null;
    this.currentUser = null;
    this.authOverlay = null;
    this.mainApp = null;
    this.init();
  }

  async init() {
    // Attendre que Firebase soit initialisé
    await this.waitForFirebase();
    
    this.auth = window.Firebase.auth;
    this.authOverlay = document.getElementById('auth-overlay');
    this.mainApp = document.getElementById('main-app');
    
    // Initialiser les événements
    this.initEvents();
    
    // Écouter les changements d'état d'authentification
    this.auth.onAuthStateChanged((user) => {
      this.handleAuthStateChange(user);
    });
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
    
    // Bouton Google
    const googleButtons = document.querySelectorAll('.btn-google');
    googleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.loginWithGoogle();
      });
    });
    
    // Lien mot de passe oublié
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.showForgotPassword();
      });
    }
  }

  async login() {
    try {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      if (!email || !password) {
        this.showNotification('Veuillez remplir tous les champs', 'error');
        return;
      }
      
      this.showLoading();
      
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      this.currentUser = userCredential.user;
      
      this.showNotification('Connexion réussie !', 'success');
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
      this.handleAuthError(error);
    } finally {
      this.hideLoading();
    }
  }

  async register() {
    try {
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
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
      
      this.showLoading();
      
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      this.currentUser = userCredential.user;
      
      // Mettre à jour le nom d'affichage
      await this.currentUser.updateProfile({
        displayName: name
      });
      
      this.showNotification('Compte créé avec succès !', 'success');
      
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      this.handleAuthError(error);
    } finally {
      this.hideLoading();
    }
  }

  async loginWithGoogle() {
    try {
      const provider = new window.Firebase.auth.GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      this.showLoading();
      
      const result = await this.auth.signInWithPopup(provider);
      this.currentUser = result.user;
      
      this.showNotification('Connexion Google réussie !', 'success');
      
    } catch (error) {
      console.error('Erreur de connexion Google:', error);
      this.handleAuthError(error);
    } finally {
      this.hideLoading();
    }
  }

  async logout() {
    try {
      await this.auth.signOut();
      this.currentUser = null;
      this.showNotification('Déconnexion réussie', 'info');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      this.showNotification('Erreur lors de la déconnexion', 'error');
    }
  }

  async resetPassword(email) {
    try {
      await this.auth.sendPasswordResetEmail(email);
      this.showNotification('Email de réinitialisation envoyé', 'success');
    } catch (error) {
      console.error('Erreur de réinitialisation:', error);
      this.handleAuthError(error);
    }
  }

  showForgotPassword() {
    const email = document.getElementById('login-email').value;
    if (!email) {
      this.showNotification('Veuillez d\'abord saisir votre email', 'error');
      return;
    }
    
    this.resetPassword(email);
  }

  handleAuthStateChange(user) {
    if (user) {
      // Utilisateur connecté
      this.currentUser = user;
      this.showMainApp();
      this.updateUserInfo();
    } else {
      // Utilisateur déconnecté
      this.currentUser = null;
      this.showAuthOverlay();
    }
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
        userNameElement.textContent = this.currentUser.displayName || 'Étudiant en médecine';
      }
      
      if (userEmailElement) {
        userEmailElement.textContent = this.currentUser.email;
      }
    }
  }

  handleAuthError(error) {
    let message = 'Une erreur est survenue';
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'Aucun compte trouvé avec cet email';
        break;
      case 'auth/wrong-password':
        message = 'Mot de passe incorrect';
        break;
      case 'auth/email-already-in-use':
        message = 'Cet email est déjà utilisé';
        break;
      case 'auth/weak-password':
        message = 'Le mot de passe est trop faible';
        break;
      case 'auth/invalid-email':
        message = 'Email invalide';
        break;
      case 'auth/too-many-requests':
        message = 'Trop de tentatives. Réessayez plus tard';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Connexion annulée';
        break;
      default:
        message = error.message || 'Erreur d\'authentification';
    }
    
    this.showNotification(message, 'error');
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
    return this.currentUser ? this.currentUser.uid : null;
  }

  getUserEmail() {
    return this.currentUser ? this.currentUser.email : null;
  }

  getUserDisplayName() {
    return this.currentUser ? this.currentUser.displayName : null;
  }
}