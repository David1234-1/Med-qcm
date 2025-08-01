# QCM Médecine - Assistant d'étude intelligent

Une plateforme complète d'étude pour étudiants en médecine avec QCM automatiques, flashcards et assistant IA.

## 🚀 Fonctionnalités

### ✅ Authentification sécurisée
- Inscription et connexion par email/mot de passe
- Sessions persistantes
- Protection des routes

### 📚 Import et traitement des cours
- Upload de fichiers PDF
- Extraction automatique du texte
- Classification par matière
- Validation et aperçu du contenu

### 🤖 Intelligence Artificielle
- Génération automatique de QCM (10+ questions)
- Création de flashcards intelligentes
- Résumés structurés du contenu
- Assistant IA intégré pour questions médicales

### 🎯 Interface QCM interactive
- Questions une par une
- Correction immédiate avec feedback visuel
- Score et pourcentage en temps réel
- Animations de célébration (confettis)
- Historique des performances

### 📖 Flashcards avancées
- Navigation fluide entre les cartes
- Animations de retournement
- Marquage des cartes à revoir
- Mode "cartes marquées uniquement"

### 📊 Gamification et statistiques
- Points et badges de progression
- Graphiques de performance
- Suivi du temps d'étude
- Historique détaillé

### 💬 Assistant IA intégré
- Chat en temps réel
- Réponses contextuelles
- Historique des conversations
- Copie et modification des messages

## 🛠️ Installation

### Prérequis
- Node.js 16+ 
- npm ou yarn

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd qcm-medecine
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer en mode développement**
```bash
npm run dev
```

4. **Construire pour production**
```bash
npm run build
```

## 📦 Déploiement sur Netlify

### Méthode 1 : Netlify Drop (Recommandée)
1. Construire le projet : `npm run build`
2. Aller sur [Netlify Drop](https://app.netlify.com/drop)
3. Glisser le dossier `dist` généré
4. Le site est immédiatement en ligne !

### Méthode 2 : Git
1. Pousser le code sur GitHub/GitLab
2. Connecter le repository à Netlify
3. Configuration automatique détectée

## 🎯 Utilisation

### Première connexion
1. Créer un compte avec email et mot de passe
2. Accéder au tableau de bord

### Import de cours
1. Aller dans "Cours"
2. Sélectionner une matière
3. Glisser-déposer vos fichiers PDF
4. Cliquer sur "Extraire le texte"
5. Valider l'aperçu
6. Cliquer sur "Générer QCM & Flashcards"

### Utilisation des QCM
1. Aller dans "QCM"
2. Choisir une série
3. Répondre aux questions
4. Voir les résultats et explications
5. Recommencer ou essayer une autre série

### Flashcards
1. Aller dans "Flashcards"
2. Sélectionner une série
3. Cliquer pour retourner les cartes
4. Marquer les cartes difficiles
5. Utiliser le mode "marquées uniquement"

### Assistant IA
1. Aller dans "Assistant"
2. Poser vos questions médicales
3. Obtenir des réponses instantanées
4. Consulter l'historique

### Statistiques
1. Aller dans "Statistiques"
2. Voir vos performances
3. Consulter les graphiques
4. Débloquer des badges

## 🏗️ Architecture technique

### Frontend
- **React 18** avec hooks
- **Vite** pour le build
- **React Router** pour la navigation
- **Tailwind CSS** pour le styling
- **Lucide React** pour les icônes
- **Framer Motion** pour les animations

### Backend simulé
- **localStorage** pour la persistance
- **API simulée** pour les données
- **PDF.js** pour l'extraction de texte
- **Chart.js** pour les graphiques

### IA et traitement
- **Service IA simulé** (remplaçable par OpenAI)
- **Extraction PDF** avec pdfjs-dist
- **Génération de contenu** automatique

## 🔧 Configuration

### Variables d'environnement
```env
# Pour une vraie IA (optionnel)
VITE_OPENAI_API_KEY=your-openai-key
VITE_OPENAI_MODEL=gpt-3.5-turbo

# Pour Supabase (optionnel)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
```

### Personnalisation
- Modifier les couleurs dans `src/index.css`
- Adapter les questions dans `src/lib/aiService.js`
- Personnaliser les badges dans `src/components/Stats/StatsDashboard.jsx`

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- 📱 Mobile (320px+)
- 📱 Tablette (768px+)
- 💻 Desktop (1024px+)

## 🎨 Design System

### Couleurs
- **Primary**: #2563eb (Bleu)
- **Secondary**: #7c3aed (Violet)
- **Success**: #10b981 (Vert)
- **Warning**: #f59e0b (Orange)
- **Error**: #ef4444 (Rouge)

### Typographie
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

## 🚀 Optimisations

### Performance
- Code splitting automatique
- Lazy loading des composants
- Optimisation des images
- Bundle size optimisé

### SEO
- Meta tags appropriés
- Structure sémantique
- Open Graph tags

### Accessibilité
- Navigation au clavier
- Contraste approprié
- Labels ARIA
- Focus management

## 🔒 Sécurité

### Authentification
- Mots de passe hachés
- Sessions sécurisées
- Protection CSRF
- Validation des inputs

### Données
- Chiffrement local
- Pas de données sensibles exposées
- Validation côté client et serveur

## 📈 Roadmap

### Version 2.0
- [ ] Intégration OpenAI réelle
- [ ] Base de données Supabase
- [ ] Mode hors ligne
- [ ] Synchronisation multi-appareils

### Version 2.1
- [ ] Mode collaboratif
- [ ] Partage de QCM
- [ ] Export PDF des résultats
- [ ] Notifications push

### Version 2.2
- [ ] Mode examen chronométré
- [ ] Répétition espacée
- [ ] IA conversationnelle avancée
- [ ] Intégration calendrier

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation
- Contacter l'équipe de développement

---

**Développé avec ❤️ pour les étudiants en médecine**