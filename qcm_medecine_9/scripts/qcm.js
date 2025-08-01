// Gestionnaire de QCM pour QCM Médecine 9
class QCMManager {
  constructor() {
    this.currentQCM = null;
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.startTime = null;
    this.endTime = null;
  }

  async init() {
    this.container = document.getElementById('qcm-page');
    if (!this.container) return;

    this.render();
    this.loadQCMs();
  }

  render() {
    this.container.innerHTML = `
      <div class="qcm-container">
        <div class="qcm-header">
          <h2>QCM - Questions à Choix Multiples</h2>
          <p>Testez vos connaissances avec des QCM générés automatiquement</p>
        </div>

        <div class="qcm-selection" id="qcm-selection">
          <h3>Sélectionner un QCM</h3>
          <div class="qcm-filters">
            <select id="subject-filter">
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
            <button class="btn btn-primary" onclick="qcmManager.generateNewQCM()">
              <i class="fas fa-plus"></i> Nouveau QCM
            </button>
          </div>
          <div class="qcm-list" id="qcm-list"></div>
        </div>

        <div class="qcm-interface" id="qcm-interface" style="display: none;">
          <div class="qcm-progress">
            <div class="progress-bar">
              <div class="progress-fill" id="qcm-progress-fill"></div>
            </div>
            <span id="qcm-progress-text">Question 1 sur 10</span>
          </div>

          <div class="qcm-question" id="qcm-question">
            <h3 id="question-text">Chargement de la question...</h3>
            <div class="qcm-answers" id="qcm-answers"></div>
          </div>

          <div class="qcm-navigation">
            <button class="btn btn-secondary" id="prev-btn" onclick="qcmManager.previousQuestion()">
              <i class="fas fa-arrow-left"></i> Précédent
            </button>
            <button class="btn btn-primary" id="next-btn" onclick="qcmManager.nextQuestion()">
              Suivant <i class="fas fa-arrow-right"></i>
            </button>
            <button class="btn btn-success" id="finish-btn" onclick="qcmManager.finishQCM()" style="display: none;">
              Terminer <i class="fas fa-check"></i>
            </button>
          </div>
        </div>

        <div class="qcm-results" id="qcm-results" style="display: none;">
          <div class="results-header">
            <h3>Résultats du QCM</h3>
            <div class="score-display">
              <div class="score-circle">
                <span id="score-percentage">0%</span>
              </div>
              <div class="score-details">
                <p><strong>Score:</strong> <span id="score-text">0/10</span></p>
                <p><strong>Temps:</strong> <span id="time-taken">0 min</span></p>
              </div>
            </div>
          </div>

          <div class="results-actions">
            <button class="btn btn-primary" onclick="qcmManager.reviewAnswers()">
              <i class="fas fa-eye"></i> Voir les réponses
            </button>
            <button class="btn btn-secondary" onclick="qcmManager.retryQCM()">
              <i class="fas fa-redo"></i> Recommencer
            </button>
            <button class="btn btn-success" onclick="qcmManager.newQCM()">
              <i class="fas fa-plus"></i> Nouveau QCM
            </button>
          </div>

          <div class="answers-review" id="answers-review" style="display: none;">
            <h4>Détail des réponses</h4>
            <div id="review-list"></div>
          </div>
        </div>
      </div>
    `;
  }

  async loadQCMs() {
    try {
      const userData = await window.QCMMedicineApp.getUserData();
      const documents = userData?.documents || [];
      const qcmList = document.getElementById('qcm-list');

      if (documents.length === 0) {
        qcmList.innerHTML = `
          <div class="no-qcm">
            <i class="fas fa-question-circle"></i>
            <h4>Aucun QCM disponible</h4>
            <p>Importez d'abord des documents pour générer des QCM</p>
            <button class="btn btn-primary" onclick="window.QCMMedicineApp.navigateToPage('import')">
              Importer des documents
            </button>
          </div>
        `;
        return;
      }

      // Créer des QCM à partir des documents
      const qcms = [];
      documents.forEach(doc => {
        if (doc.qcm && doc.qcm.length > 0) {
          qcms.push({
            id: `qcm_${doc.id}`,
            title: `QCM - ${doc.name}`,
            subject: doc.subject,
            questionCount: doc.qcm.length,
            documentId: doc.id,
            questions: doc.qcm
          });
        }
      });

      this.renderQCMList(qcms);
    } catch (error) {
      console.error('Erreur lors du chargement des QCM:', error);
      this.showNotification('Erreur lors du chargement des QCM', 'error');
    }
  }

  renderQCMList(qcms) {
    const qcmList = document.getElementById('qcm-list');
    
    if (qcms.length === 0) {
      qcmList.innerHTML = `
        <div class="no-qcm">
          <i class="fas fa-question-circle"></i>
          <h4>Aucun QCM généré</h4>
          <p>Les QCM seront générés automatiquement après l'import de documents</p>
        </div>
      `;
      return;
    }

    qcmList.innerHTML = qcms.map(qcm => `
      <div class="qcm-card" onclick="qcmManager.startQCM('${qcm.id}')">
        <div class="qcm-card-header">
          <h4>${qcm.title}</h4>
          <span class="qcm-subject">${qcm.subject}</span>
        </div>
        <div class="qcm-card-body">
          <p><i class="fas fa-question-circle"></i> ${qcm.questionCount} questions</p>
          <button class="btn btn-primary">Commencer</button>
        </div>
      </div>
    `).join('');
  }

  async startQCM(qcmId) {
    try {
      const userData = await window.QCMMedicineApp.getUserData();
      const documents = userData?.documents || [];
      
      // Trouver le QCM correspondant
      const documentId = qcmId.replace('qcm_', '');
      const document = documents.find(doc => doc.id === documentId);
      
      if (!document || !document.qcm) {
        this.showNotification('QCM non trouvé', 'error');
        return;
      }

      this.currentQCM = {
        id: qcmId,
        title: `QCM - ${document.name}`,
        subject: document.subject,
        questions: document.qcm,
        documentId: document.id
      };

      this.currentQuestionIndex = 0;
      this.userAnswers = new Array(this.currentQCM.questions.length).fill(null);
      this.startTime = new Date();

      this.showQCMInterface();
      this.displayQuestion();
    } catch (error) {
      console.error('Erreur lors du démarrage du QCM:', error);
      this.showNotification('Erreur lors du démarrage du QCM', 'error');
    }
  }

  showQCMInterface() {
    document.getElementById('qcm-selection').style.display = 'none';
    document.getElementById('qcm-interface').style.display = 'block';
    document.getElementById('qcm-results').style.display = 'none';
  }

  displayQuestion() {
    const question = this.currentQCM.questions[this.currentQuestionIndex];
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('qcm-answers');
    const progressFill = document.getElementById('qcm-progress-fill');
    const progressText = document.getElementById('qcm-progress-text');

    // Mettre à jour la question
    questionText.textContent = question.question;

    // Mettre à jour les réponses
    answersContainer.innerHTML = question.answers.map((answer, index) => `
      <div class="answer-option ${this.userAnswers[this.currentQuestionIndex] === index ? 'selected' : ''}" 
           onclick="qcmManager.selectAnswer(${index})">
        <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
        <span class="answer-text">${answer}</span>
      </div>
    `).join('');

    // Mettre à jour la progression
    const progress = ((this.currentQuestionIndex + 1) / this.currentQCM.questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Question ${this.currentQuestionIndex + 1} sur ${this.currentQCM.questions.length}`;

    // Mettre à jour les boutons de navigation
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const finishBtn = document.getElementById('finish-btn');

    prevBtn.style.display = this.currentQuestionIndex === 0 ? 'none' : 'inline-block';
    nextBtn.style.display = this.currentQuestionIndex === this.currentQCM.questions.length - 1 ? 'none' : 'inline-block';
    finishBtn.style.display = this.currentQuestionIndex === this.currentQCM.questions.length - 1 ? 'inline-block' : 'none';
  }

  selectAnswer(answerIndex) {
    this.userAnswers[this.currentQuestionIndex] = answerIndex;
    
    // Mettre à jour l'affichage
    const answerOptions = document.querySelectorAll('.answer-option');
    answerOptions.forEach((option, index) => {
      option.classList.toggle('selected', index === answerIndex);
    });
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.displayQuestion();
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.currentQCM.questions.length - 1) {
      this.currentQuestionIndex++;
      this.displayQuestion();
    }
  }

  finishQCM() {
    this.endTime = new Date();
    this.calculateResults();
    this.showResults();
  }

  calculateResults() {
    let correctAnswers = 0;
    const results = [];

    this.currentQCM.questions.forEach((question, index) => {
      const userAnswer = this.userAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
      }

      results.push({
        question: question.question,
        userAnswer: userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: isCorrect,
        answers: question.answers
      });
    });

    const score = Math.round((correctAnswers / this.currentQCM.questions.length) * 100);
    const timeTaken = Math.round((this.endTime - this.startTime) / 1000 / 60);

    this.results = {
      score: score,
      correctAnswers: correctAnswers,
      totalQuestions: this.currentQCM.questions.length,
      timeTaken: timeTaken,
      details: results
    };

    // Sauvegarder les résultats
    this.saveResults();
  }

  async saveResults() {
    try {
      const userData = await window.QCMMedicineApp.getUserData() || {};
      userData.qcmResults = userData.qcmResults || [];
      
      userData.qcmResults.push({
        id: this.generateId(),
        qcmId: this.currentQCM.id,
        title: this.currentQCM.title,
        subject: this.currentQCM.subject,
        score: this.results.score,
        correctAnswers: this.results.correctAnswers,
        totalQuestions: this.results.totalQuestions,
        timeTaken: this.results.timeTaken,
        completedAt: new Date().toISOString()
      });

      await window.QCMMedicineApp.saveUserData(userData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des résultats:', error);
    }
  }

  showResults() {
    document.getElementById('qcm-interface').style.display = 'none';
    document.getElementById('qcm-results').style.display = 'block';

    // Afficher le score
    document.getElementById('score-percentage').textContent = `${this.results.score}%`;
    document.getElementById('score-text').textContent = `${this.results.correctAnswers}/${this.results.totalQuestions}`;
    document.getElementById('time-taken').textContent = `${this.results.timeTaken} min`;

    // Animation du score
    this.animateScore();
  }

  animateScore() {
    const scoreElement = document.getElementById('score-percentage');
    const targetScore = this.results.score;
    let currentScore = 0;
    
    const interval = setInterval(() => {
      currentScore += 2;
      if (currentScore >= targetScore) {
        currentScore = targetScore;
        clearInterval(interval);
      }
      scoreElement.textContent = `${currentScore}%`;
    }, 50);
  }

  reviewAnswers() {
    const reviewList = document.getElementById('answers-review');
    const reviewContainer = document.getElementById('review-list');

    reviewList.style.display = 'block';
    reviewContainer.innerHTML = this.results.details.map((result, index) => `
      <div class="review-item ${result.isCorrect ? 'correct' : 'incorrect'}">
        <div class="review-question">
          <h5>Question ${index + 1}</h5>
          <p>${result.question}</p>
        </div>
        <div class="review-answers">
          ${result.answers.map((answer, i) => `
            <div class="review-answer ${i === result.correctAnswer ? 'correct-answer' : ''} ${i === result.userAnswer && !result.isCorrect ? 'wrong-answer' : ''}">
              <span class="answer-letter">${String.fromCharCode(65 + i)}</span>
              <span class="answer-text">${answer}</span>
              ${i === result.correctAnswer ? '<i class="fas fa-check correct-icon"></i>' : ''}
              ${i === result.userAnswer && !result.isCorrect ? '<i class="fas fa-times wrong-icon"></i>' : ''}
            </div>
          `).join('')}
        </div>
        <div class="review-status">
          ${result.isCorrect ? 
            '<span class="status-correct"><i class="fas fa-check"></i> Correct</span>' : 
            '<span class="status-incorrect"><i class="fas fa-times"></i> Incorrect</span>'
          }
        </div>
      </div>
    `).join('');
  }

  retryQCM() {
    this.startQCM(this.currentQCM.id);
  }

  newQCM() {
    document.getElementById('qcm-results').style.display = 'none';
    document.getElementById('qcm-selection').style.display = 'block';
    this.loadQCMs();
  }

  async generateNewQCM() {
    try {
      const userData = await window.QCMMedicineApp.getUserData();
      const documents = userData?.documents || [];

      if (documents.length === 0) {
        this.showNotification('Aucun document disponible. Importez d\'abord des documents.', 'error');
        return;
      }

      // Générer un QCM aléatoire
      const randomDoc = documents[Math.floor(Math.random() * documents.length)];
      const qcmId = `qcm_${randomDoc.id}`;
      
      this.startQCM(qcmId);
    } catch (error) {
      console.error('Erreur lors de la génération du QCM:', error);
      this.showNotification('Erreur lors de la génération du QCM', 'error');
    }
  }

  generateId() {
    return 'result_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  showNotification(message, type = 'info') {
    if (window.QCMMedicineApp && window.QCMMedicineApp.notificationManager) {
      window.QCMMedicineApp.notificationManager.show(message, type);
    }
  }
}

// Rendre le gestionnaire global
window.qcmManager = new QCMManager();