// Gestionnaire de flashcards pour QCM Médecine 9
class FlashcardsManager {
  constructor() {
    this.currentDeck = null;
    this.currentCardIndex = 0;
    this.isFlipped = false;
    this.markedCards = new Set();
  }

  async init() {
    this.container = document.getElementById('flashcards-page');
    if (!this.container) return;

    this.render();
    this.loadFlashcards();
  }

  render() {
    this.container.innerHTML = `
      <div class="flashcards-container">
        <div class="flashcards-header">
          <h2>Flashcards</h2>
          <p>Mémorisez efficacement avec des flashcards interactives</p>
        </div>

        <div class="flashcards-selection" id="flashcards-selection">
          <h3>Sélectionner un jeu de flashcards</h3>
          <div class="flashcards-filters">
            <select id="flashcards-subject-filter">
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
            <button class="btn btn-primary" onclick="flashcardsManager.generateNewDeck()">
              <i class="fas fa-plus"></i> Nouveau jeu
            </button>
          </div>
          <div class="flashcards-list" id="flashcards-list"></div>
        </div>

        <div class="flashcards-interface" id="flashcards-interface" style="display: none;">
          <div class="flashcards-progress">
            <div class="progress-bar">
              <div class="progress-fill" id="flashcards-progress-fill"></div>
            </div>
            <span id="flashcards-progress-text">Carte 1 sur 10</span>
          </div>

          <div class="flashcard-container">
            <div class="flashcard" id="flashcard" onclick="flashcardsManager.flipCard()">
              <div class="flashcard-inner">
                <div class="flashcard-front">
                  <h3 id="card-front-text">Chargement...</h3>
                </div>
                <div class="flashcard-back">
                  <h3 id="card-back-text">Chargement...</h3>
                </div>
              </div>
            </div>
          </div>

          <div class="flashcards-controls">
            <button class="btn btn-secondary" onclick="flashcardsManager.previousCard()">
              <i class="fas fa-arrow-left"></i> Précédent
            </button>
            
            <div class="flashcards-actions">
              <button class="btn btn-warning" id="mark-btn" onclick="flashcardsManager.toggleMark()">
                <i class="fas fa-bookmark"></i> Marquer
              </button>
              <button class="btn btn-info" onclick="flashcardsManager.shuffleDeck()">
                <i class="fas fa-random"></i> Mélanger
              </button>
            </div>
            
            <button class="btn btn-secondary" onclick="flashcardsManager.nextCard()">
              Suivant <i class="fas fa-arrow-right"></i>
            </button>
          </div>

          <div class="flashcards-info">
            <div class="info-item">
              <i class="fas fa-bookmark"></i>
              <span id="marked-count">0</span> marquées
            </div>
            <div class="info-item">
              <i class="fas fa-clock"></i>
              <span id="study-time">0 min</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async loadFlashcards() {
    try {
      const userData = await window.QCMMedicineApp.getUserData();
      const documents = userData?.documents || [];
      const flashcardsList = document.getElementById('flashcards-list');

      if (documents.length === 0) {
        flashcardsList.innerHTML = `
          <div class="no-flashcards">
            <i class="fas fa-layer-group"></i>
            <h4>Aucune flashcard disponible</h4>
            <p>Importez d'abord des documents pour générer des flashcards</p>
            <button class="btn btn-primary" onclick="window.QCMMedicineApp.navigateToPage('import')">
              Importer des documents
            </button>
          </div>
        `;
        return;
      }

      // Créer des jeux de flashcards à partir des documents
      const decks = [];
      documents.forEach(doc => {
        if (doc.flashcards && doc.flashcards.length > 0) {
          decks.push({
            id: `deck_${doc.id}`,
            title: `Flashcards - ${doc.name}`,
            subject: doc.subject,
            cardCount: doc.flashcards.length,
            documentId: doc.id,
            cards: doc.flashcards
          });
        }
      });

      this.renderFlashcardsList(decks);
    } catch (error) {
      console.error('Erreur lors du chargement des flashcards:', error);
      this.showNotification('Erreur lors du chargement des flashcards', 'error');
    }
  }

  renderFlashcardsList(decks) {
    const flashcardsList = document.getElementById('flashcards-list');
    
    if (decks.length === 0) {
      flashcardsList.innerHTML = `
        <div class="no-flashcards">
          <i class="fas fa-layer-group"></i>
          <h4>Aucune flashcard générée</h4>
          <p>Les flashcards seront générées automatiquement après l'import de documents</p>
        </div>
      `;
      return;
    }

    flashcardsList.innerHTML = decks.map(deck => `
      <div class="flashcard-deck" onclick="flashcardsManager.startDeck('${deck.id}')">
        <div class="deck-header">
          <h4>${deck.title}</h4>
          <span class="deck-subject">${deck.subject}</span>
        </div>
        <div class="deck-body">
          <p><i class="fas fa-layer-group"></i> ${deck.cardCount} cartes</p>
          <button class="btn btn-primary">Commencer</button>
        </div>
      </div>
    `).join('');
  }

  async startDeck(deckId) {
    try {
      const userData = await window.QCMMedicineApp.getUserData();
      const documents = userData?.documents || [];
      
      // Trouver le jeu correspondant
      const documentId = deckId.replace('deck_', '');
      const document = documents.find(doc => doc.id === documentId);
      
      if (!document || !document.flashcards) {
        this.showNotification('Jeu de flashcards non trouvé', 'error');
        return;
      }

      this.currentDeck = {
        id: deckId,
        title: `Flashcards - ${document.name}`,
        subject: document.subject,
        cards: document.flashcards,
        documentId: document.id
      };

      this.currentCardIndex = 0;
      this.isFlipped = false;
      this.markedCards.clear();
      this.startTime = new Date();

      this.showFlashcardsInterface();
      this.displayCard();
    } catch (error) {
      console.error('Erreur lors du démarrage du jeu:', error);
      this.showNotification('Erreur lors du démarrage du jeu', 'error');
    }
  }

  showFlashcardsInterface() {
    document.getElementById('flashcards-selection').style.display = 'none';
    document.getElementById('flashcards-interface').style.display = 'block';
  }

  displayCard() {
    const card = this.currentDeck.cards[this.currentCardIndex];
    const frontText = document.getElementById('card-front-text');
    const backText = document.getElementById('card-back-text');
    const progressFill = document.getElementById('flashcards-progress-fill');
    const progressText = document.getElementById('flashcards-progress-text');
    const markBtn = document.getElementById('mark-btn');

    // Mettre à jour le contenu des cartes
    frontText.textContent = card.front;
    backText.textContent = card.back;

    // Mettre à jour la progression
    const progress = ((this.currentCardIndex + 1) / this.currentDeck.cards.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Carte ${this.currentCardIndex + 1} sur ${this.currentDeck.cards.length}`;

    // Mettre à jour le bouton de marquage
    const isMarked = this.markedCards.has(this.currentCardIndex);
    markBtn.innerHTML = isMarked ? 
      '<i class="fas fa-bookmark"></i> Désactiver' : 
      '<i class="fas fa-bookmark"></i> Marquer';
    markBtn.classList.toggle('btn-warning', !isMarked);
    markBtn.classList.toggle('btn-success', isMarked);

    // Mettre à jour les compteurs
    this.updateCounters();

    // Remettre la carte face avant
    this.isFlipped = false;
    this.updateCardDisplay();
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
    this.updateCardDisplay();
  }

  updateCardDisplay() {
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.toggle('flipped', this.isFlipped);
  }

  previousCard() {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
      this.displayCard();
    }
  }

  nextCard() {
    if (this.currentCardIndex < this.currentDeck.cards.length - 1) {
      this.currentCardIndex++;
      this.displayCard();
    }
  }

  toggleMark() {
    if (this.markedCards.has(this.currentCardIndex)) {
      this.markedCards.delete(this.currentCardIndex);
    } else {
      this.markedCards.add(this.currentCardIndex);
    }
    
    this.displayCard();
  }

  shuffleDeck() {
    // Mélanger les cartes
    for (let i = this.currentDeck.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.currentDeck.cards[i], this.currentDeck.cards[j]] = [this.currentDeck.cards[j], this.currentDeck.cards[i]];
    }
    
    this.currentCardIndex = 0;
    this.displayCard();
    this.showNotification('Cartes mélangées !', 'success');
  }

  updateCounters() {
    const markedCount = document.getElementById('marked-count');
    const studyTime = document.getElementById('study-time');
    
    markedCount.textContent = this.markedCards.size;
    
    if (this.startTime) {
      const elapsed = Math.round((new Date() - this.startTime) / 1000 / 60);
      studyTime.textContent = `${elapsed} min`;
    }
  }

  async generateNewDeck() {
    try {
      const userData = await window.QCMMedicineApp.getUserData();
      const documents = userData?.documents || [];

      if (documents.length === 0) {
        this.showNotification('Aucun document disponible. Importez d\'abord des documents.', 'error');
        return;
      }

      // Générer un jeu aléatoire
      const randomDoc = documents[Math.floor(Math.random() * documents.length)];
      const deckId = `deck_${randomDoc.id}`;
      
      this.startDeck(deckId);
    } catch (error) {
      console.error('Erreur lors de la génération du jeu:', error);
      this.showNotification('Erreur lors de la génération du jeu', 'error');
    }
  }

  showNotification(message, type = 'info') {
    if (window.QCMMedicineApp && window.QCMMedicineApp.notificationManager) {
      window.QCMMedicineApp.notificationManager.show(message, type);
    }
  }
}

// Rendre le gestionnaire global
window.flashcardsManager = new FlashcardsManager();
