// Gestionnaire d'import de documents pour QCM Médecine 9
class ImportManager {
  constructor() {
    this.supportedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
  }

  async init() {
    this.container = document.getElementById('import-page');
    if (!this.container) return;

    this.render();
    this.initEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="import-container">
        <div class="import-header">
          <h2>Importer vos cours</h2>
          <p>Importez vos documents PDF ou Word pour générer automatiquement des QCM, flashcards et résumés</p>
        </div>

        <div class="import-area">
          <div class="file-drop-zone" id="file-drop-zone">
            <div class="drop-zone-content">
              <i class="fas fa-cloud-upload-alt"></i>
              <h3>Glissez vos fichiers ici</h3>
              <p>ou cliquez pour sélectionner</p>
              <input type="file" id="file-input" multiple accept=".pdf,.doc,.docx" style="display: none;">
            </div>
          </div>

          <div class="import-options">
            <h4>Options d'import</h4>
            <div class="form-group">
              <label for="subject-select">Matière :</label>
              <select id="subject-select">
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
            </div>
            <div class="form-group">
              <label for="custom-subject">Matière personnalisée :</label>
              <input type="text" id="custom-subject" placeholder="Entrez une matière personnalisée">
            </div>
          </div>
        </div>

        <div class="imported-files" id="imported-files">
          <h3>Documents importés</h3>
          <div class="files-list" id="files-list"></div>
        </div>

        <div class="processing-status" id="processing-status" style="display: none;">
          <div class="processing-content">
            <i class="fas fa-spinner fa-spin"></i>
            <h4>Traitement en cours...</h4>
            <p id="processing-message">Extraction du texte...</p>
            <div class="progress-bar">
              <div class="progress-fill" id="progress-fill"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  initEvents() {
    const dropZone = document.getElementById('file-drop-zone');
    const fileInput = document.getElementById('file-input');
    const customSubject = document.getElementById('custom-subject');
    const subjectSelect = document.getElementById('subject-select');

    // Gestion du drag & drop
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      const files = Array.from(e.dataTransfer.files);
      this.handleFiles(files);
    });

    // Clic sur la zone de drop
    dropZone.addEventListener('click', () => {
      fileInput.click();
    });

    // Sélection de fichiers
    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      this.handleFiles(files);
    });

    // Gestion de la matière personnalisée
    customSubject.addEventListener('input', () => {
      if (customSubject.value.trim()) {
        subjectSelect.value = 'Autre';
      }
    });

    subjectSelect.addEventListener('change', () => {
      if (subjectSelect.value !== 'Autre') {
        customSubject.value = '';
      }
    });
  }

  async handleFiles(files) {
    const validFiles = files.filter(file => this.validateFile(file));
    
    if (validFiles.length === 0) {
      this.showNotification('Aucun fichier valide sélectionné', 'error');
      return;
    }

    this.showProcessingStatus();
    
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const progress = ((i + 1) / validFiles.length) * 100;
      
      this.updateProgress(progress, `Traitement de ${file.name}...`);
      
      try {
        await this.processFile(file);
      } catch (error) {
        console.error(`Erreur lors du traitement de ${file.name}:`, error);
        this.showNotification(`Erreur lors du traitement de ${file.name}`, 'error');
      }
    }

    this.hideProcessingStatus();
    this.showNotification(`${validFiles.length} document(s) importé(s) avec succès`, 'success');
    this.updateFilesList();
  }

  validateFile(file) {
    if (!this.supportedTypes.includes(file.type)) {
      this.showNotification(`${file.name} : Type de fichier non supporté`, 'error');
      return false;
    }

    if (file.size > this.maxFileSize) {
      this.showNotification(`${file.name} : Fichier trop volumineux (max 10MB)`, 'error');
      return false;
    }

    return true;
  }

  async processFile(file) {
    const subject = this.getSelectedSubject();
    const text = await this.extractText(file);
    
    if (!text || text.trim().length < 100) {
      throw new Error('Texte insuffisant extrait du document');
    }

    // Sauvegarder le document
    const document = {
      id: this.generateId(),
      name: file.name,
      type: file.type,
      size: file.size,
      subject: subject,
      content: text,
      importedAt: new Date().toISOString(),
      processed: false
    };

    await this.saveDocument(document);

    // Traiter avec l'IA
    await this.processWithAI(document);
  }

  async extractText(file) {
    if (file.type === 'application/pdf') {
      return await this.extractTextFromPDF(file);
    } else {
      return await this.extractTextFromWord(file);
    }
  }

  async extractTextFromPDF(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const typedarray = new Uint8Array(e.target.result);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          let text = '';

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(' ');
            text += pageText + '\n';
          }

          resolve(text);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  async extractTextFromWord(file) {
    // Pour les fichiers Word, on simule l'extraction
    // En production, utiliser une bibliothèque comme mammoth.js
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        // Simulation d'extraction de texte
        const text = `Contenu extrait de ${file.name}\n\nCeci est un exemple de contenu extrait d'un document Word. En production, cette fonction utiliserait une bibliothèque spécialisée pour extraire le texte réel du document.\n\nLe contenu serait analysé par l'IA pour générer des QCM, flashcards et résumés pertinents.`;
        resolve(text);
      };

      reader.readAsText(file);
    });
  }

  async processWithAI(document) {
    try {
      // Générer QCM
      const qcm = await window.QCMMedicineApp.aiService.generateQCM(document.content, document.subject);
      
      // Générer flashcards
      const flashcards = await window.QCMMedicineApp.aiService.generateFlashcards(document.content, document.subject);
      
      // Générer résumé
      const summary = await window.QCMMedicineApp.aiService.generateSummary(document.content, document.subject);

      // Sauvegarder les résultats
      document.qcm = qcm;
      document.flashcards = flashcards;
      document.summary = summary;
      document.processed = true;
      document.processedAt = new Date().toISOString();

      await this.saveDocument(document);
      
    } catch (error) {
      console.error('Erreur lors du traitement IA:', error);
      throw error;
    }
  }

  getSelectedSubject() {
    const subjectSelect = document.getElementById('subject-select');
    const customSubject = document.getElementById('custom-subject');
    
    if (subjectSelect.value === 'Autre' && customSubject.value.trim()) {
      return customSubject.value.trim();
    }
    
    return subjectSelect.value;
  }

  async saveDocument(document) {
    const userData = await window.QCMMedicineApp.getUserData() || {};
    userData.documents = userData.documents || [];
    userData.documents.push(document);
    
    await window.QCMMedicineApp.saveUserData(userData);
  }

  async updateFilesList() {
    const filesList = document.getElementById('files-list');
    const userData = await window.QCMMedicineApp.getUserData();
    const documents = userData?.documents || [];

    if (documents.length === 0) {
      filesList.innerHTML = '<p class="no-files">Aucun document importé</p>';
      return;
    }

    filesList.innerHTML = documents.map(doc => `
      <div class="file-item">
        <div class="file-info">
          <i class="fas fa-file-alt"></i>
          <div class="file-details">
            <h4>${doc.name}</h4>
            <p>Matière: ${doc.subject}</p>
            <p>Importé le: ${new Date(doc.importedAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div class="file-status">
          ${doc.processed ? 
            '<span class="status-success"><i class="fas fa-check"></i> Traité</span>' : 
            '<span class="status-pending"><i class="fas fa-clock"></i> En attente</span>'
          }
        </div>
      </div>
    `).join('');
  }

  showProcessingStatus() {
    document.getElementById('processing-status').style.display = 'flex';
  }

  hideProcessingStatus() {
    document.getElementById('processing-status').style.display = 'none';
  }

  updateProgress(percent, message) {
    document.getElementById('progress-fill').style.width = `${percent}%`;
    document.getElementById('processing-message').textContent = message;
  }

  generateId() {
    return 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  showNotification(message, type = 'info') {
    if (window.QCMMedicineApp && window.QCMMedicineApp.notificationManager) {
      window.QCMMedicineApp.notificationManager.show(message, type);
    }
  }
}