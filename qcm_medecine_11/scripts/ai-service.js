// Service IA pour QCM Médecine 8 - Version gratuite et autonome
class AIService {
  constructor() {
    this.config = window.StudyHubConfig?.ai || {};
    this.medicalKnowledge = this.initializeMedicalKnowledge();
  }

  // Base de connaissances médicales pré-générées
  initializeMedicalKnowledge() {
    return {
      anatomie: {
        questions: [
          {
            question: "Quel est l'os le plus long du corps humain ?",
            options: ["Fémur", "Humérus", "Tibia", "Fibula"],
            correct: 0,
            explanation: "Le fémur est l'os le plus long du corps humain, situé dans la cuisse."
          },
          {
            question: "Quel muscle est responsable de la flexion du coude ?",
            options: ["Biceps brachial", "Triceps brachial", "Deltoïde", "Pectoral"],
            correct: 0,
            explanation: "Le biceps brachial est le principal muscle responsable de la flexion du coude."
          },
          {
            question: "Quel organe produit la bile ?",
            options: ["Foie", "Pancréas", "Rate", "Rein"],
            correct: 0,
            explanation: "Le foie produit la bile qui aide à la digestion des graisses."
          }
        ],
        flashcards: [
          { question: "Qu'est-ce que l'anatomie ?", answer: "L'étude de la structure du corps humain et de ses organes." },
          { question: "Combien d'os y a-t-il dans le corps humain adulte ?", answer: "206 os." },
          { question: "Quel est le plus grand organe du corps ?", answer: "La peau." }
        ]
      },
      physiologie: {
        questions: [
          {
            question: "Quel est le rythme cardiaque normal au repos ?",
            options: ["60-100 bpm", "40-60 bpm", "100-140 bpm", "140-180 bpm"],
            correct: 0,
            explanation: "Le rythme cardiaque normal au repos est de 60 à 100 battements par minute."
          },
          {
            question: "Quel système contrôle la température corporelle ?",
            options: ["Système nerveux", "Système endocrinien", "Système immunitaire", "Système digestif"],
            correct: 0,
            explanation: "Le système nerveux, notamment l'hypothalamus, contrôle la température corporelle."
          }
        ],
        flashcards: [
          { question: "Qu'est-ce que la physiologie ?", answer: "L'étude du fonctionnement des organes et systèmes du corps." },
          { question: "Quel est le pH normal du sang ?", answer: "7,35-7,45 (légèrement alcalin)." }
        ]
      },
      biochimie: {
        questions: [
          {
            question: "Quel est le sucre principal dans le sang ?",
            options: ["Glucose", "Fructose", "Saccharose", "Lactose"],
            correct: 0,
            explanation: "Le glucose est le sucre principal circulant dans le sang."
          },
          {
            question: "Quel acide aminé est essentiel ?",
            options: ["Lysine", "Alanine", "Glycine", "Proline"],
            correct: 0,
            explanation: "La lysine est un acide aminé essentiel qui doit être apporté par l'alimentation."
          }
        ],
        flashcards: [
          { question: "Qu'est-ce que la biochimie ?", answer: "L'étude des réactions chimiques dans les organismes vivants." },
          { question: "Quel est le rôle de l'ATP ?", answer: "Molécule de stockage et de transfert d'énergie dans la cellule." }
        ]
      }
    };
  }

  // Génération de QCM basée sur le contenu
  async generateQCM(content, subject = 'anatomie', count = 10) {
    try {
      // Analyse du contenu pour extraire les mots-clés
      const keywords = this.extractKeywords(content);
      
      // Génération de questions basées sur le contenu et la matière
      const questions = this.generateQuestionsFromContent(content, subject, count);
      
      return {
        success: true,
        questions: questions,
        subject: subject,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur lors de la génération QCM:', error);
      return {
        success: false,
        error: 'Erreur lors de la génération des questions',
        questions: this.getFallbackQuestions(subject, count)
      };
    }
  }

  // Génération de flashcards
  async generateFlashcards(content, subject = 'anatomie', count = 10) {
    try {
      const flashcards = this.generateFlashcardsFromContent(content, subject, count);
      
      return {
        success: true,
        flashcards: flashcards,
        subject: subject,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur lors de la génération flashcards:', error);
      return {
        success: false,
        error: 'Erreur lors de la génération des flashcards',
        flashcards: this.getFallbackFlashcards(subject, count)
      };
    }
  }

  // Génération de résumé
  async generateSummary(content, subject = 'anatomie') {
    try {
      const summary = this.generateSummaryFromContent(content, subject);
      
      return {
        success: true,
        summary: summary,
        subject: subject,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur lors de la génération résumé:', error);
      return {
        success: false,
        error: 'Erreur lors de la génération du résumé',
        summary: this.getFallbackSummary(subject)
      };
    }
  }

  // Réponse aux questions de l'utilisateur
  async answerQuestion(question, context = '', subject = 'anatomie') {
    try {
      const answer = this.generateAnswer(question, context, subject);
      
      return {
        success: true,
        answer: answer,
        question: question,
        subject: subject,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur lors de la réponse:', error);
      return {
        success: false,
        error: 'Erreur lors de la génération de la réponse',
        answer: this.getFallbackAnswer(question, subject)
      };
    }
  }

  // Méthodes privées pour la génération de contenu
  extractKeywords(content) {
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const stopWords = ['dans', 'avec', 'pour', 'sont', 'cette', 'comme', 'plus', 'tout', 'fait', 'bien'];
    return words.filter(word => !stopWords.includes(word));
  }

  generateQuestionsFromContent(content, subject, count) {
    const questions = [];
    const subjectData = this.medicalKnowledge[subject] || this.medicalKnowledge.anatomie;
    
    // Utiliser les questions pré-générées de la matière
    const baseQuestions = subjectData.questions || [];
    
    // Générer des questions supplémentaires basées sur le contenu
    const contentQuestions = this.createQuestionsFromText(content, subject);
    
    // Combiner et mélanger les questions
    const allQuestions = [...baseQuestions, ...contentQuestions];
    const shuffled = this.shuffleArray(allQuestions);
    
    return shuffled.slice(0, count).map((q, index) => ({
      id: `qcm_${Date.now()}_${index}`,
      ...q
    }));
  }

  generateFlashcardsFromContent(content, subject, count) {
    const flashcards = [];
    const subjectData = this.medicalKnowledge[subject] || this.medicalKnowledge.anatomie;
    
    // Utiliser les flashcards pré-générées
    const baseFlashcards = subjectData.flashcards || [];
    
    // Générer des flashcards supplémentaires
    const contentFlashcards = this.createFlashcardsFromText(content, subject);
    
    const allFlashcards = [...baseFlashcards, ...contentFlashcards];
    const shuffled = this.shuffleArray(allFlashcards);
    
    return shuffled.slice(0, count).map((fc, index) => ({
      id: `flashcard_${Date.now()}_${index}`,
      ...fc
    }));
  }

  generateSummaryFromContent(content, subject) {
    // Extraire les points clés du contenu
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const keyPoints = sentences.slice(0, 5); // Prendre les 5 premières phrases significatives
    
    return {
      title: `Résumé - ${subject.charAt(0).toUpperCase() + subject.slice(1)}`,
      content: keyPoints.join('. ') + '.',
      keyPoints: keyPoints,
      wordCount: content.split(/\s+/).length,
      generatedAt: new Date().toISOString()
    };
  }

  generateAnswer(question, context, subject) {
    // Réponses pré-générées pour les questions courantes
    const commonAnswers = {
      'anatomie': {
        'os': 'Les os forment le squelette qui soutient et protège les organes.',
        'muscle': 'Les muscles permettent le mouvement et maintiennent la posture.',
        'organe': 'Les organes sont des structures spécialisées qui remplissent des fonctions spécifiques.'
      },
      'physiologie': {
        'fonction': 'La physiologie étudie comment les organes fonctionnent ensemble.',
        'système': 'Les systèmes organiques travaillent en coordination pour maintenir l\'homéostasie.'
      }
    };
    
    const subjectAnswers = commonAnswers[subject] || commonAnswers.anatomie;
    
    // Chercher une réponse appropriée
    for (const [keyword, answer] of Object.entries(subjectAnswers)) {
      if (question.toLowerCase().includes(keyword)) {
        return answer;
      }
    }
    
    // Réponse générique
    return `En ${subject}, ${question} est un concept important à maîtriser. Je vous recommande de consulter vos cours et de pratiquer avec les QCM pour mieux comprendre ce sujet.`;
  }

  createQuestionsFromText(content, subject) {
    const questions = [];
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30);
    
    sentences.slice(0, 5).forEach((sentence, index) => {
      const words = sentence.split(/\s+/);
      if (words.length > 5) {
        const question = `Qu'est-ce qui est décrit dans cette phrase : "${sentence.trim()}" ?`;
        const options = [
          `Option A - Concept ${subject}`,
          `Option B - Structure anatomique`,
          `Option C - Processus physiologique`,
          `Option D - Mécanisme biochimique`
        ];
        
        questions.push({
          question: question,
          options: options,
          correct: 0,
          explanation: `Cette question porte sur un concept de ${subject}.`
        });
      }
    });
    
    return questions;
  }

  createFlashcardsFromText(content, subject) {
    const flashcards = [];
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    sentences.slice(0, 3).forEach((sentence, index) => {
      const words = sentence.split(/\s+/);
      if (words.length > 3) {
        flashcards.push({
          question: `Que signifie ce concept en ${subject} ?`,
          answer: sentence.trim()
        });
      }
    });
    
    return flashcards;
  }

  getFallbackQuestions(subject, count) {
    const subjectData = this.medicalKnowledge[subject] || this.medicalKnowledge.anatomie;
    const questions = subjectData.questions || [];
    return questions.slice(0, count).map((q, index) => ({
      id: `fallback_qcm_${index}`,
      ...q
    }));
  }

  getFallbackFlashcards(subject, count) {
    const subjectData = this.medicalKnowledge[subject] || this.medicalKnowledge.anatomie;
    const flashcards = subjectData.flashcards || [];
    return flashcards.slice(0, count).map((fc, index) => ({
      id: `fallback_flashcard_${index}`,
      ...fc
    }));
  }

  getFallbackSummary(subject) {
    return {
      title: `Résumé - ${subject.charAt(0).toUpperCase() + subject.slice(1)}`,
      content: `Ce résumé couvre les concepts fondamentaux de ${subject}. Consultez vos cours pour plus de détails.`,
      keyPoints: [`Introduction à ${subject}`, 'Concepts fondamentaux', 'Applications pratiques'],
      wordCount: 0,
      generatedAt: new Date().toISOString()
    };
  }

  getFallbackAnswer(question, subject) {
    return `Je ne peux pas répondre à cette question spécifique pour le moment. Je vous recommande de consulter vos cours de ${subject} ou de poser une question plus générale.`;
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// Rendre le service disponible globalement
window.AIService = AIService;