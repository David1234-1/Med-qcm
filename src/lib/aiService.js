// Service IA simulé pour la démo
// Dans une vraie application, cela utiliserait une API comme OpenAI

export const aiService = {
  // Générer des QCM à partir du contenu
  generateQCM: async (content, subject) => {
    // Simulation d'un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const questions = [
      {
        id: 1,
        question: "Quelle est la fonction principale du système cardiovasculaire ?",
        options: [
          "Transport de l'oxygène et des nutriments",
          "Digestion des aliments",
          "Production d'hormones",
          "Élimination des déchets"
        ],
        correctAnswer: 0,
        explanation: "Le système cardiovasculaire a pour fonction principale de transporter l'oxygène et les nutriments vers les cellules du corps."
      },
      {
        id: 2,
        question: "Quel est le nombre normal de battements cardiaques par minute au repos ?",
        options: [
          "40-60 bpm",
          "60-100 bpm",
          "100-140 bpm",
          "140-180 bpm"
        ],
        correctAnswer: 1,
        explanation: "La fréquence cardiaque normale au repos est comprise entre 60 et 100 battements par minute."
      },
      {
        id: 3,
        question: "Quelle est la structure responsable de la conduction électrique dans le cœur ?",
        options: [
          "Le myocarde",
          "Le nœud sinusal",
          "Les valves cardiaques",
          "Le péricarde"
        ],
        correctAnswer: 1,
        explanation: "Le nœud sinusal est le pacemaker naturel du cœur et initie l'impulsion électrique."
      },
      {
        id: 4,
        question: "Quel vaisseau transporte le sang oxygéné vers les tissus ?",
        options: [
          "Les veines",
          "Les artères",
          "Les capillaires",
          "Les lymphatiques"
        ],
        correctAnswer: 1,
        explanation: "Les artères transportent le sang oxygéné du cœur vers les tissus."
      },
      {
        id: 5,
        question: "Qu'est-ce que la pression artérielle systolique ?",
        options: [
          "La pression lors de la relaxation du cœur",
          "La pression lors de la contraction du cœur",
          "La différence entre pression max et min",
          "La pression moyenne"
        ],
        correctAnswer: 1,
        explanation: "La pression systolique correspond à la pression lors de la contraction du ventricule gauche."
      },
      {
        id: 6,
        question: "Quel est le rôle des valves cardiaques ?",
        options: [
          "Produire l'énergie cardiaque",
          "Assurer la conduction électrique",
          "Empêcher le reflux sanguin",
          "Filtrer le sang"
        ],
        correctAnswer: 2,
        explanation: "Les valves cardiaques empêchent le reflux sanguin et assurent un flux unidirectionnel."
      },
      {
        id: 7,
        question: "Qu'est-ce que l'athérosclérose ?",
        options: [
          "Une inflammation du myocarde",
          "Un épaississement des parois artérielles",
          "Une arythmie cardiaque",
          "Une insuffisance valvulaire"
        ],
        correctAnswer: 1,
        explanation: "L'athérosclérose est caractérisée par l'épaississement et la rigidification des parois artérielles."
      },
      {
        id: 8,
        question: "Quel est le principal facteur de risque cardiovasculaire modifiable ?",
        options: [
          "L'âge",
          "Le sexe",
          "Le tabagisme",
          "Les antécédents familiaux"
        ],
        correctAnswer: 2,
        explanation: "Le tabagisme est le principal facteur de risque cardiovasculaire modifiable."
      },
      {
        id: 9,
        question: "Qu'est-ce que l'ECG mesure ?",
        options: [
          "La pression artérielle",
          "L'activité électrique du cœur",
          "Le débit cardiaque",
          "La saturation en oxygène"
        ],
        correctAnswer: 1,
        explanation: "L'électrocardiogramme (ECG) mesure l'activité électrique du cœur."
      },
      {
        id: 10,
        question: "Quel est le rôle du système lymphatique ?",
        options: [
          "Transport de l'oxygène",
          "Défense immunitaire et drainage",
          "Production d'hormones",
          "Digestion des graisses"
        ],
        correctAnswer: 1,
        explanation: "Le système lymphatique participe à la défense immunitaire et au drainage des fluides."
      }
    ]
    
    return {
      id: Date.now(),
      subject,
      questions,
      totalQuestions: questions.length,
      created_at: new Date().toISOString()
    }
  },

  // Générer des flashcards
  generateFlashcards: async (content, subject) => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const flashcards = [
      {
        id: 1,
        question: "Qu'est-ce que le système cardiovasculaire ?",
        answer: "Un système qui comprend le cœur et les vaisseaux sanguins, responsable du transport du sang dans l'organisme."
      },
      {
        id: 2,
        question: "Quelle est la fréquence cardiaque normale au repos ?",
        answer: "Entre 60 et 100 battements par minute (bpm)."
      },
      {
        id: 3,
        question: "Quel est le rôle du nœud sinusal ?",
        answer: "Il est le pacemaker naturel du cœur et initie l'impulsion électrique qui déclenche les battements cardiaques."
      },
      {
        id: 4,
        question: "Quelle est la différence entre artères et veines ?",
        answer: "Les artères transportent le sang oxygéné du cœur vers les tissus, les veines ramènent le sang désoxygéné vers le cœur."
      },
      {
        id: 5,
        question: "Qu'est-ce que la pression artérielle ?",
        answer: "La force exercée par le sang sur les parois des artères, mesurée en mmHg."
      },
      {
        id: 6,
        question: "Quel est le rôle des valves cardiaques ?",
        answer: "Empêcher le reflux sanguin et assurer un flux unidirectionnel dans le cœur."
      },
      {
        id: 7,
        question: "Qu'est-ce que l'athérosclérose ?",
        answer: "Une maladie caractérisée par l'épaississement et la rigidification des parois artérielles due à l'accumulation de plaques."
      },
      {
        id: 8,
        question: "Quels sont les facteurs de risque cardiovasculaire ?",
        answer: "Tabagisme, hypertension, diabète, hypercholestérolémie, obésité, sédentarité, âge, sexe, antécédents familiaux."
      },
      {
        id: 9,
        question: "Qu'est-ce qu'un ECG ?",
        answer: "Un électrocardiogramme qui mesure et enregistre l'activité électrique du cœur."
      },
      {
        id: 10,
        question: "Quel est le rôle du système lymphatique ?",
        answer: "Participer à la défense immunitaire et au drainage des fluides interstitiels."
      }
    ]
    
    return {
      id: Date.now(),
      subject,
      flashcards,
      totalCards: flashcards.length,
      created_at: new Date().toISOString()
    }
  },

  // Générer un résumé
  generateSummary: async (content, subject) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      id: Date.now(),
      subject,
      summary: `# Résumé - ${subject}

## Système Cardiovasculaire

### Anatomie du cœur
- **Cœur** : Organe musculaire creux divisé en 4 cavités (2 oreillettes, 2 ventricules)
- **Valves cardiaques** : Assurent un flux unidirectionnel (tricuspide, mitrale, pulmonaire, aortique)
- **Myocarde** : Muscle cardiaque responsable des contractions

### Physiologie
- **Fréquence cardiaque normale** : 60-100 bpm au repos
- **Débit cardiaque** : Volume de sang éjecté par minute
- **Pression artérielle** : Systolique (contraction) et diastolique (relaxation)

### Conduction électrique
- **Nœud sinusal** : Pacemaker naturel (60-100 impulsions/min)
- **Nœud auriculo-ventriculaire** : Ralentit l'impulsion
- **Faisceau de His** : Conduit l'impulsion aux ventricules

### Vaisseaux sanguins
- **Artères** : Transportent le sang oxygéné (pression élevée)
- **Veines** : Ramènent le sang désoxygéné (pression faible)
- **Capillaires** : Échanges gazeux et nutritifs

### Pathologies principales
- **Athérosclérose** : Épaississement des parois artérielles
- **Hypertension** : Pression artérielle > 140/90 mmHg
- **Infarctus du myocarde** : Nécrose du muscle cardiaque
- **Insuffisance cardiaque** : Incapacité du cœur à assurer le débit

### Facteurs de risque
- **Modifiables** : Tabagisme, hypertension, diabète, obésité, sédentarité
- **Non modifiables** : Âge, sexe, antécédents familiaux

### Examens complémentaires
- **ECG** : Activité électrique du cœur
- **Échographie cardiaque** : Imagerie du cœur
- **Coronarographie** : Visualisation des artères coronaires`,
      created_at: new Date().toISOString()
    }
  },

  // Assistant IA pour répondre aux questions
  chatWithAI: async (message, context = '') => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const responses = {
      "cœur": "Le cœur est un organe musculaire creux qui pompe le sang dans tout l'organisme. Il est divisé en 4 cavités : 2 oreillettes (réception) et 2 ventricules (éjection).",
      "artère": "Les artères sont des vaisseaux sanguins qui transportent le sang oxygéné du cœur vers les tissus. Elles ont des parois épaisses et élastiques pour résister à la pression élevée.",
      "veine": "Les veines ramènent le sang désoxygéné des tissus vers le cœur. Elles ont des parois plus minces et contiennent des valves pour empêcher le reflux.",
      "pression": "La pression artérielle se mesure en mmHg et comprend deux valeurs : la systolique (contraction) et la diastolique (relaxation). La normale est < 140/90 mmHg.",
      "ecg": "L'électrocardiogramme (ECG) enregistre l'activité électrique du cœur. Il permet de diagnostiquer les arythmies, infarctus et autres pathologies cardiaques.",
      "infarctus": "L'infarctus du myocarde est la nécrose d'une partie du muscle cardiaque due à l'obstruction d'une artère coronaire. C'est une urgence vitale.",
      "athérosclérose": "L'athérosclérose est l'épaississement et la rigidification des parois artérielles par accumulation de plaques lipidiques. C'est la cause principale des maladies cardiovasculaires."
    }
    
    const lowerMessage = message.toLowerCase()
    let response = "Je suis votre assistant médical. Je peux vous aider avec vos questions sur l'anatomie, la physiologie et les pathologies. Posez-moi une question spécifique !"
    
    for (const [keyword, answer] of Object.entries(responses)) {
      if (lowerMessage.includes(keyword)) {
        response = answer
        break
      }
    }
    
    return {
      id: Date.now(),
      message,
      response,
      timestamp: new Date().toISOString()
    }
  }
}