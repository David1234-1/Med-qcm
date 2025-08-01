// Gestionnaire de résumés pour QCM Médecine 9
class ResumesManager {
  constructor() {
    this.currentResume = null;
  }

  async init() {
    this.container = document.getElementById('resumes-page');
    if (!this.container) return;

    this.render();
    this.loadResumes();
  }

  render() {
    this.container.innerHTML = `
      <div class="resumes-container">
        <div class="resumes-header">
          <h2>Résumés</h2>
          <p>Consultez les résumés intelligents générés à partir de vos cours</p>
        </div>

        <div class="resumes-selection" id="resumes-selection">
          <h3>Sélectionner un résumé</h3>
          <div class="resumes-filters">
            <select id="resumes-subject-filter">
              <option value="">Toutes les matières</option>
              <option value="Anatomie">Anatomie</option>
              <option value="Physiologie">Physiologie</option>
              <option value="Biochimie">Biochimie</option>
              <option value="Histologie">Histologie</option>
              <option value="Embryologie">Embryologie</option>
              <option value="Immunologie">Immunologie</option>
              <option value="Microbiologie">Microbiologie</option>
              <option value="Pharmacologie">Pharmacologie</option>
              <option value="Pathologie">Pathologie</option>
              <option value="Sémiologie">Sémiologie</option>
              <option value="Autre">Autre</option>
            </select>
            <button class="btn btn-primary" onclick="resumesManager.generateNewResume()">
              <i class="fas fa-plus"></i> Nouveau résumé
            </button>
          </div>
          <div class="resumes-list" id="resumes-list"></div>
        </div>

        <div class="resume-viewer" id="resume-viewer" style="display: none;">
          <div class="resume-header">
            <h3 id="resume-title">Chargement...</h3>
            <div class="resume-meta">
              <span id="resume-subject">Matière</span>
              <span id="resume-date">Date</span>
            </div>
            <button class="btn btn-secondary" onclick="resumesManager.backToSelection()">
              <i class="fas fa-arrow-left"></i> Retour
            </button>
          </div>

          <div class="resume-content" id="resume-content">
            <div class="loading-spinner">
              <i class="fas fa-spinner fa-spin"></i>
              <p>Chargement du résumé...</p>
            </div>
          </div>

          <div class="resume-actions">
            <button class="btn btn-primary" onclick="resumesManager.printResume()">
              <i class="fas fa-print"></i> Imprimer
            </button>
            <button class="btn btn-secondary" onclick="resumesManager.downloadResume()">
              <i class="fas fa-download"></i> Télécharger
            </button>
            <button class="btn btn-info" onclick="resumesManager.shareResume()">
              <i class="fas fa-share"></i> Partager
            </button>
          </div>
        </div>
      </div>
    `;
  }

  async loadResumes() {
    try {
      const userData = await window.QCMMedicineApp.getUserData();
      const documents = userData?.documents || [];
      const resumesList = document.getElementById('resumes-list');

      if (documents.length === 0) {
        resumesList.innerHTML = `
          <div class="no-resumes">
            <i class="fas fa-file-alt"></i>
            <h4>Aucun résumé disponible</h4>
            <p>Importez d'abord des documents pour générer des résumés</p>
            <button class="btn btn-primary" onclick="window.QCMMedicineApp.navigateToPage('import')">
              Importer des documents
            </button>
          </div>
        `;
        return;
      }

      // Créer des résumés à partir des documents
      const resumes = [];
      documents.forEach(doc => {
        if (doc.summary) {
          resumes.push({
            id: `resume_${doc.id}`,
            title: `Résumé - ${doc.name}`,
            subject: doc.subject,
            documentId: doc.id,
            summary: doc.summary,
            createdAt: doc.processedAt || doc.importedAt
          });
        }
      });

      this.renderResumesList(resumes);
    } catch (error) {
      console.error('Erreur lors du chargement des résumés:', error);
      this.showNotification('Erreur lors du chargement des résumés', 'error');
    }
  }

  renderResumesList(resumes) {
    const resumesList = document.getElementById('resumes-list');
    
    if (resumes.length === 0) {
      resumesList.innerHTML = `
        <div class="no-resumes">
          <i class="fas fa-file-alt"></i>
          <h4>Aucun résumé généré</h4>
          <p>Les résumés seront générés automatiquement après l'import de documents</p>
        </div>
      `;
      return;
    }

    resumesList.innerHTML = resumes.map(resume => `
      <div class="resume-card" onclick="resumesManager.viewResume('${resume.id}')">
        <div class="resume-card-header">
          <h4>${resume.title}</h4>
          <span class="resume-subject">${resume.subject}</span>
        </div>
        <div class="resume-card-body">
          <p class="resume-preview">${this.truncateText(resume.summary, 150)}</p>
          <div class="resume-meta">
            <span><i class="fas fa-calendar"></i> ${new Date(resume.createdAt).toLocaleDateString()}</span>
          </div>
          <button class="btn btn-primary">Lire</button>
        </div>
      </div>
    `).join('');
  }

  async viewResume(resumeId) {
    try {
      const userData = await window.QCMMedicineApp.getUserData();
      const documents = userData?.documents || [];
      
      // Trouver le résumé correspondant
      const documentId = resumeId.replace('resume_', '');
      const document = documents.find(doc => doc.id === documentId);
      
      if (!document || !document.summary) {
        this.showNotification('Résumé non trouvé', 'error');
        return;
      }

      this.currentResume = {
        id: resumeId,
        title: `Résumé - ${document.name}`,
        subject: document.subject,
        summary: document.summary,
        createdAt: document.processedAt || document.importedAt
      };

      this.showResumeViewer();
      this.displayResume();
    } catch (error) {
      console.error('Erreur lors du chargement du résumé:', error);
      this.showNotification('Erreur lors du chargement du résumé', 'error');
    }
  }

  showResumeViewer() {
    document.getElementById('resumes-selection').style.display = 'none';
    document.getElementById('resume-viewer').style.display = 'block';
  }

  displayResume() {
    const title = document.getElementById('resume-title');
    const subject = document.getElementById('resume-subject');
    const date = document.getElementById('resume-date');
    const content = document.getElementById('resume-content');

    title.textContent = this.currentResume.title;
    subject.textContent = this.currentResume.subject;
    date.textContent = new Date(this.currentResume.createdAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Formater le contenu du résumé
    const formattedContent = this.formatResumeContent(this.currentResume.summary);
    content.innerHTML = formattedContent;
  }

  formatResumeContent(summary) {
    // Diviser le résumé en sections
    const sections = summary.split('\n\n').filter(section => section.trim());
    
    return sections.map(section => {
      const lines = section.split('\n');
      const title = lines[0];
      const content = lines.slice(1).join('\n');
      
      return `
        <div class="resume-section">
          <h4 class="section-title">${title}</h4>
          <div class="section-content">
            ${content.split('\n').map(line => `<p>${line}</p>`).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  backToSelection() {
    document.getElementById('resume-viewer').style.display = 'none';
    document.getElementById('resumes-selection').style.display = 'block';
    this.currentResume = null;
  }

  printResume() {
    if (!this.currentResume) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${this.currentResume.title}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
            h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
            h2 { color: #1e40af; margin-top: 30px; }
            .meta { color: #6b7280; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <h1>${this.currentResume.title}</h1>
          <div class="meta">
            <strong>Matière:</strong> ${this.currentResume.subject}<br>
            <strong>Date:</strong> ${new Date(this.currentResume.createdAt).toLocaleDateString('fr-FR')}
          </div>
          <div class="content">
            ${this.formatResumeContent(this.currentResume.summary)}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  downloadResume() {
    if (!this.currentResume) return;

    const content = `
Résumé - ${this.currentResume.title}
Matière: ${this.currentResume.subject}
Date: ${new Date(this.currentResume.createdAt).toLocaleDateString('fr-FR')}

${this.currentResume.summary}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.currentResume.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showNotification('Résumé téléchargé avec succès', 'success');
  }

  shareResume() {
    if (!this.currentResume) return;

    if (navigator.share) {
      navigator.share({
        title: this.currentResume.title,
        text: this.currentResume.summary.substring(0, 200) + '...',
        url: window.location.href
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      const textArea = document.createElement('textarea');
      textArea.value = this.currentResume.summary;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      this.showNotification('Résumé copié dans le presse-papiers', 'success');
    }
  }

  async generateNewResume() {
    try {
      const userData = await window.QCMMedicineApp.getUserData();
      const documents = userData?.documents || [];

      if (documents.length === 0) {
        this.showNotification('Aucun document disponible. Importez d\'abord des documents.', 'error');
        return;
      }

      // Générer un résumé aléatoire
      const randomDoc = documents[Math.floor(Math.random() * documents.length)];
      const resumeId = `resume_${randomDoc.id}`;
      
      this.viewResume(resumeId);
    } catch (error) {
      console.error('Erreur lors de la génération du résumé:', error);
      this.showNotification('Erreur lors de la génération du résumé', 'error');
    }
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  showNotification(message, type = 'info') {
    if (window.QCMMedicineApp && window.QCMMedicineApp.notificationManager) {
      window.QCMMedicineApp.notificationManager.show(message, type);
    }
  }
}

// Rendre le gestionnaire global
window.resumesManager = new ResumesManager();