// Gestionnaire de notifications pour QCM Médecine 8
class NotificationManager {
  constructor() {
    this.container = null;
    this.notifications = [];
    this.init();
  }

  init() {
    this.createContainer();
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'notification-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', duration = 5000) {
    const notification = this.createNotification(message, type);
    this.container.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
    }, 100);

    // Auto-suppression
    if (duration > 0) {
      setTimeout(() => {
        this.hide(notification);
      }, duration);
    }

    return notification;
  }

  createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = this.getIconForType(type);
    const color = this.getColorForType(type);
    
    notification.style.cssText = `
      background: var(--bg-primary);
      border: 1px solid ${color};
      border-left: 4px solid ${color};
      border-radius: var(--radius-lg);
      padding: var(--spacing-md);
      box-shadow: var(--shadow-lg);
      transform: translateX(100%);
      opacity: 0;
      transition: all var(--transition-normal);
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      max-width: 100%;
    `;

    notification.innerHTML = `
      <div class="notification-icon" style="color: ${color}; font-size: 1.2rem; flex-shrink: 0;">
        <i class="${icon}"></i>
      </div>
      <div class="notification-content" style="flex: 1;">
        <div class="notification-message" style="color: var(--text-primary); font-size: 0.9rem; line-height: 1.4;">
          ${message}
        </div>
      </div>
      <button class="notification-close" style="
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: var(--radius-sm);
        transition: color var(--transition-fast);
        flex-shrink: 0;
      ">
        <i class="fas fa-times"></i>
      </button>
    `;

    // Événement de fermeture
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      this.hide(notification);
    });

    // Événement de survol pour arrêter l'auto-suppression
    notification.addEventListener('mouseenter', () => {
      notification.dataset.paused = 'true';
    });

    notification.addEventListener('mouseleave', () => {
      delete notification.dataset.paused;
    });

    return notification;
  }

  hide(notification) {
    if (notification.dataset.paused) {
      return; // Ne pas fermer si en pause
    }

    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  getIconForType(type) {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
  }

  getColorForType(type) {
    const colors = {
      success: 'var(--secondary-color)',
      error: 'var(--danger-color)',
      warning: 'var(--warning-color)',
      info: 'var(--primary-color)'
    };
    return colors[type] || colors.info;
  }

  // Méthodes utilitaires
  success(message, duration = 5000) {
    return this.show(message, 'success', duration);
  }

  error(message, duration = 7000) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration = 6000) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration = 5000) {
    return this.show(message, 'info', duration);
  }

  // Notification avec progression
  showProgress(message, progress = 0) {
    const notification = this.createNotification(message, 'info');
    
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      width: 100%;
      height: 4px;
      background: var(--bg-secondary);
      border-radius: 2px;
      margin-top: var(--spacing-sm);
      overflow: hidden;
    `;
    
    const progressFill = document.createElement('div');
    progressFill.style.cssText = `
      height: 100%;
      background: var(--primary-color);
      width: ${progress}%;
      transition: width var(--transition-normal);
    `;
    
    progressBar.appendChild(progressFill);
    notification.querySelector('.notification-content').appendChild(progressBar);
    
    this.container.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
    }, 100);

    return {
      notification,
      updateProgress: (newProgress) => {
        progressFill.style.width = `${newProgress}%`;
      },
      complete: () => {
        this.hide(notification);
      }
    };
  }

  // Notification persistante (sans auto-suppression)
  showPersistent(message, type = 'info') {
    return this.show(message, type, 0);
  }

  // Effacer toutes les notifications
  clear() {
    const notifications = this.container.querySelectorAll('.notification');
    notifications.forEach(notification => {
      this.hide(notification);
    });
  }
}