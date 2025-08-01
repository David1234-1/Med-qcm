// Gestionnaire de statistiques pour QCM Médecine 9
class StatisticsManager {
  constructor() {
    this.stats = null;
  }

  async init() {
    this.container = document.getElementById('statistics-page');
    if (!this.container) return;

    this.render();
    await this.loadStatistics();
  }

  render() {
    this.container.innerHTML = `
      <div class="statistics-container">
        <div class="statistics-header">
          <h2>Statistiques et Progression</h2>
          <p>Suivez votre progression et vos performances d'apprentissage</p>
        </div>

        <div class="statistics-overview">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-file-alt"></i>
              </div>
              <div class="stat-content">
                <h3 id="total-documents">0</h3>
                <p>Documents importés</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-question-circle"></i>
              </div>
              <div class="stat-content">
                <h3 id="total-qcm">0</h3>
                <p>QCM complétés</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-layer-group"></i>
              </div>
              <div class="stat-content">
                <h3 id="total-flashcards">0</h3>
                <p>Flashcards étudiées</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-percentage"></i>
              </div>
              <div class="stat-content">
                <h3 id="average-score">0%</h3>
                <p>Score moyen</p>
              </div>
            </div>
          </div>
        </div>

        <div class="statistics-details">
          <div class="stats-section">
            <h3>Performance par matière</h3>
            <div class="subject-stats" id="subject-stats"></div>
          </div>

          <div class="stats-section">
            <h3>Progression récente</h3>
            <div class="recent-activity" id="recent-activity"></div>
          </div>

          <div class="stats-section">
            <h3>Badges et accomplissements</h3>
            <div class="badges-section" id="badges-section"></div>
          </div>

          <div class="stats-section">
            <h3>Graphiques de progression</h3>
            <div class="charts-section" id="charts-section"></div>
          </div>
        </div>
      </div>
    `;
  }

  async loadStatistics() {
    try {
      const userData = await window.QCMMedicineApp.getUserData();
      this.stats = this.calculateStatistics(userData);
      this.displayStatistics();
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  }

  calculateStatistics(userData) {
    const documents = userData?.documents || [];
    const qcmResults = userData?.qcmResults || [];
    const conversations = userData?.conversations || [];

    // Statistiques générales
    const totalDocuments = documents.length;
    const totalQCM = qcmResults.length;
    const totalFlashcards = documents.reduce((sum, doc) => sum + (doc.flashcards?.length || 0), 0);
    
    // Score moyen
    const averageScore = qcmResults.length > 0 
      ? Math.round(qcmResults.reduce((sum, result) => sum + result.score, 0) / qcmResults.length)
      : 0;

    // Statistiques par matière
    const subjectStats = {};
    documents.forEach(doc => {
      if (!subjectStats[doc.subject]) {
        subjectStats[doc.subject] = {
          documents: 0,
          qcm: 0,
          flashcards: 0,
          averageScore: 0,
          totalTime: 0
        };
      }
      subjectStats[doc.subject].documents++;
      subjectStats[doc.subject].flashcards += doc.flashcards?.length || 0;
    });

    // Ajouter les résultats QCM par matière
    qcmResults.forEach(result => {
      if (subjectStats[result.subject]) {
        subjectStats[result.subject].qcm++;
        subjectStats[result.subject].totalTime += result.timeTaken || 0;
      }
    });

    // Calculer les scores moyens par matière
    Object.keys(subjectStats).forEach(subject => {
      const subjectQCM = qcmResults.filter(result => result.subject === subject);
      if (subjectQCM.length > 0) {
        subjectStats[subject].averageScore = Math.round(
          subjectQCM.reduce((sum, result) => sum + result.score, 0) / subjectQCM.length
        );
      }
    });

    // Activité récente
    const recentActivity = [];
    
    // Ajouter les documents récents
    documents.slice(0, 5).forEach(doc => {
      recentActivity.push({
        type: 'document',
        title: doc.name,
        subject: doc.subject,
        date: doc.importedAt,
        description: 'Document importé'
      });
    });

    // Ajouter les QCM récents
    qcmResults.slice(0, 5).forEach(result => {
      recentActivity.push({
        type: 'qcm',
        title: result.title,
        subject: result.subject,
        date: result.completedAt,
        description: `QCM complété - Score: ${result.score}%`
      });
    });

    // Ajouter les conversations récentes
    conversations.slice(0, 3).forEach(conv => {
      recentActivity.push({
        type: 'conversation',
        title: conv.title,
        subject: 'Assistant IA',
        date: conv.updatedAt,
        description: `${conv.messages.length} messages`
      });
    });

    // Trier par date
    recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Badges
    const badges = this.calculateBadges(totalDocuments, totalQCM, averageScore, totalFlashcards);

    return {
      totalDocuments,
      totalQCM,
      totalFlashcards,
      averageScore,
      subjectStats,
      recentActivity: recentActivity.slice(0, 10),
      badges
    };
  }

  calculateBadges(documents, qcm, score, flashcards) {
    const badges = [];

    // Badges de documents
    if (documents >= 1) badges.push({ name: 'Débutant', icon: 'fas fa-file', description: 'Premier document importé' });
    if (documents >= 5) badges.push({ name: 'Collectionneur', icon: 'fas fa-folder', description: '5 documents importés' });
    if (documents >= 10) badges.push({ name: 'Archiviste', icon: 'fas fa-archive', description: '10 documents importés' });

    // Badges de QCM
    if (qcm >= 1) badges.push({ name: 'Testeur', icon: 'fas fa-question', description: 'Premier QCM complété' });
    if (qcm >= 5) badges.push({ name: 'Quiz Master', icon: 'fas fa-trophy', description: '5 QCM complétés' });
    if (qcm >= 10) badges.push({ name: 'Champion', icon: 'fas fa-crown', description: '10 QCM complétés' });

    // Badges de score
    if (score >= 70) badges.push({ name: 'Bon élève', icon: 'fas fa-star', description: 'Score moyen ≥ 70%' });
    if (score >= 85) badges.push({ name: 'Excellent', icon: 'fas fa-medal', description: 'Score moyen ≥ 85%' });
    if (score >= 95) badges.push({ name: 'Parfait', icon: 'fas fa-gem', description: 'Score moyen ≥ 95%' });

    // Badges de flashcards
    if (flashcards >= 10) badges.push({ name: 'Mémorisation', icon: 'fas fa-brain', description: '10 flashcards créées' });
    if (flashcards >= 50) badges.push({ name: 'Mémoire d\'éléphant', icon: 'fas fa-memory', description: '50 flashcards créées' });

    return badges;
  }

  displayStatistics() {
    if (!this.stats) return;

    // Statistiques générales
    document.getElementById('total-documents').textContent = this.stats.totalDocuments;
    document.getElementById('total-qcm').textContent = this.stats.totalQCM;
    document.getElementById('total-flashcards').textContent = this.stats.totalFlashcards;
    document.getElementById('average-score').textContent = `${this.stats.averageScore}%`;

    // Statistiques par matière
    this.displaySubjectStats();

    // Activité récente
    this.displayRecentActivity();

    // Badges
    this.displayBadges();

    // Graphiques
    this.displayCharts();
  }

  displaySubjectStats() {
    const container = document.getElementById('subject-stats');
    
    if (Object.keys(this.stats.subjectStats).length === 0) {
      container.innerHTML = `
        <div class="no-stats">
          <i class="fas fa-chart-bar"></i>
          <p>Aucune statistique disponible</p>
          <p>Commencez par importer des documents et compléter des QCM</p>
        </div>
      `;
      return;
    }

    container.innerHTML = Object.entries(this.stats.subjectStats).map(([subject, stats]) => `
      <div class="subject-stat-card">
        <div class="subject-header">
          <h4>${subject}</h4>
          <span class="subject-score">${stats.averageScore}%</span>
        </div>
        <div class="subject-details">
          <div class="stat-item">
            <i class="fas fa-file-alt"></i>
            <span>${stats.documents} documents</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-question-circle"></i>
            <span>${stats.qcm} QCM</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-layer-group"></i>
            <span>${stats.flashcards} flashcards</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-clock"></i>
            <span>${Math.round(stats.totalTime)} min</span>
          </div>
        </div>
        <div class="subject-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${stats.averageScore}%"></div>
          </div>
        </div>
      </div>
    `).join('');
  }

  displayRecentActivity() {
    const container = document.getElementById('recent-activity');
    
    if (this.stats.recentActivity.length === 0) {
      container.innerHTML = `
        <div class="no-activity">
          <i class="fas fa-history"></i>
          <p>Aucune activité récente</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.stats.recentActivity.map(activity => {
      const icon = this.getActivityIcon(activity.type);
      const date = new Date(activity.date).toLocaleDateString('fr-FR');
      
      return `
        <div class="activity-item">
          <div class="activity-icon">
            <i class="${icon}"></i>
          </div>
          <div class="activity-content">
            <h5>${activity.title}</h5>
            <p>${activity.description}</p>
            <span class="activity-date">${date}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  getActivityIcon(type) {
    switch (type) {
      case 'document': return 'fas fa-file-alt';
      case 'qcm': return 'fas fa-question-circle';
      case 'conversation': return 'fas fa-comments';
      default: return 'fas fa-info-circle';
    }
  }

  displayBadges() {
    const container = document.getElementById('badges-section');
    
    if (this.stats.badges.length === 0) {
      container.innerHTML = `
        <div class="no-badges">
          <i class="fas fa-trophy"></i>
          <p>Aucun badge débloqué</p>
          <p>Continuez à utiliser l'application pour débloquer des badges !</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.stats.badges.map(badge => `
      <div class="badge-card">
        <div class="badge-icon">
          <i class="${badge.icon}"></i>
        </div>
        <div class="badge-info">
          <h4>${badge.name}</h4>
          <p>${badge.description}</p>
        </div>
      </div>
    `).join('');
  }

  displayCharts() {
    const container = document.getElementById('charts-section');
    
    // Graphique simple en CSS pour la progression
    const subjects = Object.keys(this.stats.subjectStats);
    
    if (subjects.length === 0) {
      container.innerHTML = `
        <div class="no-charts">
          <i class="fas fa-chart-line"></i>
          <p>Aucune donnée pour les graphiques</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="chart-container">
        <h4>Progression par matière</h4>
        <div class="chart-bars">
          ${subjects.map(subject => {
            const score = this.stats.subjectStats[subject].averageScore;
            return `
              <div class="chart-bar">
                <div class="bar-label">${subject}</div>
                <div class="bar-container">
                  <div class="bar-fill" style="width: ${score}%"></div>
                  <span class="bar-value">${score}%</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <div class="chart-container">
        <h4>Répartition des activités</h4>
        <div class="activity-pie">
          <div class="pie-segment documents" style="--percentage: ${this.calculatePercentage(this.stats.totalDocuments)}">
            <span>Documents</span>
          </div>
          <div class="pie-segment qcm" style="--percentage: ${this.calculatePercentage(this.stats.totalQCM)}">
            <span>QCM</span>
          </div>
          <div class="pie-segment flashcards" style="--percentage: ${this.calculatePercentage(this.stats.totalFlashcards)}">
            <span>Flashcards</span>
          </div>
        </div>
      </div>
    `;
  }

  calculatePercentage(value) {
    const total = this.stats.totalDocuments + this.stats.totalQCM + this.stats.totalFlashcards;
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }
}

// Rendre le gestionnaire global
window.statisticsManager = new StatisticsManager();