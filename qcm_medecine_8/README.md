# QCM Médecine 8 - Plateforme de Révision Intelligente 🧠

Une plateforme complète de révision avec IA intégrée, authentification Firebase, et synchronisation cloud pour les étudiants en médecine.

## ✨ Fonctionnalités Principales

### 🔐 Authentification Complète
- **Création de compte** par email/mot de passe
- **Connexion Google OAuth2** intégrée
- **Sauvegarde sécurisée** avec Firebase Auth
- **Synchronisation** des données sur tous les appareils

### 📄 Analyse Intelligente des Documents
- **Import PDF/Word** avec extraction automatique du texte
- **Génération automatique** de QCM, flashcards et résumés
- **Analyse IA** du contenu pour identifier les concepts clés
- **Traitement en temps réel** avec barre de progression

### 🤖 IA Assistant Intégrée
- **Chat contextuel** basé sur vos documents
- **Réponses personnalisées** selon le contenu de vos cours
- **Service IA gratuit** sans clé API payante
- **Mode simulation** avec base de connaissances médicales

### 📚 Outils de Révision
- **QCM dynamiques** avec 10 questions générées automatiquement
- **Flashcards interactives** avec système de progression
- **Résumés intelligents** générés par IA
- **Statistiques détaillées** de vos progrès

### ☁️ Synchronisation Cloud
- **Sauvegarde automatique** dans Firebase Firestore
- **Synchronisation en temps réel** entre appareils
- **Gestion des conflits** intelligente
- **Données liées** à votre compte utilisateur

## 🚀 Déploiement Rapide

### Option 1 : Netlify Drop (Recommandé)
1. Téléchargez le fichier `QCM Médecine 8.zip`
2. Allez sur [Netlify Drop](https://app.netlify.com/drop)
3. Glissez-déposez le fichier zip
4. Votre site est en ligne ! 🎉

### Option 2 : Hébergement Local
1. Extrayez le fichier zip
2. Ouvrez `index.html` dans votre navigateur
3. Ou utilisez un serveur local :
   ```bash
   python -m http.server 8000
   ```

## 📱 Utilisation

### 1. Créer un compte
- Cliquez sur "Inscription"
- Entrez votre nom, email et mot de passe
- Ou utilisez "Continuer avec Google"

### 2. Importer des documents
- Allez dans "Importer"
- Sélectionnez un fichier PDF ou Word
- Choisissez la matière (Anatomie, Physiologie, etc.)
- Le traitement se fait automatiquement

### 3. Utiliser l'IA Assistant
- Allez dans "IA Assistant"
- Sélectionnez une matière
- Posez vos questions sur le contenu de vos cours

### 4. Réviser avec les outils
- **QCM** : Testez vos connaissances
- **Flashcards** : Mémorisez les concepts
- **Résumés** : Revoyez les points clés
- **Statistiques** : Suivez vos progrès

## 🎯 Fonctionnalités Spécifiques Médecine

### Matières Supportées
- **Anatomie** : Structure du corps humain
- **Physiologie** : Fonctionnement des organes
- **Biochimie** : Réactions chimiques
- **Histologie** : Étude des tissus
- **Embryologie** : Développement embryonnaire
- **Immunologie** : Système immunitaire
- **Microbiologie** : Étude des micro-organismes
- **Pharmacologie** : Médicaments et traitements
- **Pathologie** : Étude des maladies
- **Sémiologie** : Signes et symptômes

### IA Médicale
- **Base de connaissances** pré-générée pour la médecine
- **Questions QCM** spécifiques aux matières médicales
- **Flashcards** avec terminologie médicale
- **Résumés** adaptés au niveau PACES

## 🔧 Configuration

### Firebase (Optionnel)
Le projet fonctionne sans configuration Firebase, mais pour la synchronisation cloud :

1. Créez un projet sur [Firebase Console](https://console.firebase.google.com/)
2. Activez Authentication (Email/Password + Google)
3. Créez une base Firestore
4. Remplacez la configuration dans `config.js`

### IA (Gratuit)
- **Service intégré** : Fonctionne sans clé API
- **Base de connaissances** : Questions et réponses pré-générées
- **Génération automatique** : QCM et flashcards basés sur vos cours

## 📊 Statistiques et Gamification

### Système de Points
- **Points par bonne réponse** : 10 points
- **Bonus de rapidité** : +5 points pour réponse rapide
- **Série parfaite** : +50 points bonus

### Badges à Débloquer
- 🏆 **Premier QCM** : Complétez votre premier QCM
- 📚 **Érudit** : 100 bonnes réponses
- ⚡ **Rapide** : 10 réponses en moins de 30 secondes
- 🎯 **Précis** : 5 QCM parfaits
- 🔥 **En feu** : 20 bonnes réponses consécutives

### Statistiques Détaillées
- **Score moyen** par matière
- **Progression** dans le temps
- **Temps de révision** total
- **Questions les plus difficiles**

## 🎨 Interface et Design

### Thèmes
- **Mode clair/sombre** automatique
- **Design responsive** : Mobile, tablette, desktop
- **Animations fluides** et modernes
- **Couleurs médicales** : Bleu professionnel

### Navigation
- **Interface SPA** : Navigation fluide
- **Raccourcis clavier** : Ctrl+1 à Ctrl+5
- **Breadcrumbs** : Navigation intuitive
- **Recherche globale** : Trouvez rapidement

## 🔒 Sécurité et Confidentialité

### Données Utilisateur
- **Chiffrement** des mots de passe
- **Authentification** sécurisée Firebase
- **Données locales** : Stockage dans le navigateur
- **Synchronisation** : Chiffrement en transit

### Respect de la Vie Privée
- **Aucune collecte** de données personnelles
- **Données médicales** : Restent sur votre appareil
- **Pas de tracking** ou publicité
- **Contrôle total** de vos données

## 🛠️ Technologies Utilisées

### Frontend
- **HTML5** : Structure sémantique
- **CSS3** : Design moderne et responsive
- **JavaScript ES6+** : Fonctionnalités interactives
- **Font Awesome** : Icônes professionnelles

### Backend (Firebase)
- **Firebase Auth** : Authentification sécurisée
- **Firestore** : Base de données NoSQL
- **Firebase Hosting** : Hébergement rapide

### IA et Traitement
- **PDF.js** : Extraction de texte PDF
- **Service IA intégré** : Génération de contenu
- **Base de connaissances** : Données médicales

## 📱 Compatibilité

### Navigateurs Supportés
- ✅ **Chrome** 90+
- ✅ **Firefox** 88+
- ✅ **Safari** 14+
- ✅ **Edge** 90+

### Appareils
- ✅ **Desktop** : Windows, macOS, Linux
- ✅ **Tablette** : iPad, Android
- ✅ **Mobile** : iPhone, Android

## 🚀 Performance

### Optimisations
- **Chargement rapide** : < 2 secondes
- **Traitement PDF** : Optimisé pour gros fichiers
- **Synchronisation** : Incrémentale et intelligente
- **Cache local** : Données disponibles hors ligne

### Limites
- **Taille fichier** : 10MB maximum
- **Formats supportés** : PDF, DOCX, DOC
- **Stockage local** : Selon le navigateur
- **Synchronisation** : Toutes les 5 minutes

## 🆘 Support et Aide

### Problèmes Courants

**Q: Le site ne se charge pas**
A: Vérifiez votre connexion internet et essayez de rafraîchir la page.

**Q: Impossible d'importer un fichier**
A: Vérifiez que le fichier est en PDF, DOCX ou DOC et fait moins de 10MB.

**Q: Les QCM ne se génèrent pas**
A: Assurez-vous que le fichier contient du texte extractible.

**Q: Problème de synchronisation**
A: Vérifiez votre connexion et reconnectez-vous si nécessaire.

### Contact
- **Email** : support@qcm-medecine-8.com
- **Documentation** : [Wiki du projet](https://github.com/qcm-medecine-8/wiki)
- **Issues** : [GitHub Issues](https://github.com/qcm-medecine-8/issues)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 🎯 Roadmap

### Version 1.1
- [ ] Support pour plus de formats de documents
- [ ] Mode hors ligne complet
- [ ] Export des données en PDF
- [ ] Collaboration entre étudiants

### Version 1.2
- [ ] Application mobile native
- [ ] Intégration avec d'autres services éducatifs
- [ ] Support multilingue
- [ ] Thèmes personnalisables

### Version 2.0
- [ ] IA avancée avec GPT-4
- [ ] Réalité augmentée pour l'anatomie
- [ ] Simulation de cas cliniques
- [ ] Intégration avec les universités

---

**QCM Médecine 8** - Transformez vos révisions avec l'IA ! 🚀

*Développé avec ❤️ pour les étudiants en médecine*