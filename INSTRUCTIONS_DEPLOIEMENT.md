# 🚀 Guide de déploiement - QCM Médecine

## 📦 Déploiement sur Netlify Drop

### Étape 1 : Préparer l'archive
L'archive `QCM_Médecine_6.zip` contient tous les fichiers nécessaires pour déployer votre application.

### Étape 2 : Déployer sur Netlify
1. Allez sur [Netlify Drop](https://app.netlify.com/drop)
2. Glissez-déposez le fichier `QCM_Médecine_6.zip` dans la zone de dépôt
3. Attendez quelques secondes que Netlify traite l'archive
4. Votre site est maintenant en ligne ! 🎉

### Étape 3 : Accéder à votre site
- Netlify vous fournit automatiquement une URL (ex: `https://random-name.netlify.app`)
- Vous pouvez personnaliser cette URL dans les paramètres de votre site
- Le site est immédiatement accessible et fonctionnel

## 🎯 Première utilisation

### 1. Créer votre compte
- Ouvrez votre site Netlify
- Cliquez sur "Créer un compte"
- Entrez votre email et mot de passe
- Validez l'inscription

### 2. Importer vos cours
- Allez dans la section "Cours"
- Sélectionnez une matière (ex: "Cardiologie")
- Glissez-déposez vos fichiers PDF
- Cliquez sur "Extraire le texte"
- Validez l'aperçu du contenu
- Cliquez sur "Générer QCM & Flashcards"

### 3. Commencer à étudier
- **QCM** : Testez vos connaissances avec des questions interactives
- **Flashcards** : Révisez efficacement avec des cartes mémoire
- **Assistant IA** : Posez vos questions médicales
- **Statistiques** : Suivez vos progrès et débloquez des badges

## ✨ Fonctionnalités incluses

### 🔐 Authentification sécurisée
- Création de compte avec email/mot de passe
- Connexion persistante
- Protection des données

### 📚 Import de cours
- Support des fichiers PDF
- Extraction automatique du texte
- Classification par matière
- Validation du contenu

### 🤖 Intelligence Artificielle
- Génération automatique de QCM (10+ questions)
- Création de flashcards intelligentes
- Résumés structurés
- Assistant IA pour questions médicales

### 🎯 Interface interactive
- QCM avec correction immédiate
- Flashcards avec animations
- Statistiques détaillées
- Gamification avec badges

### 📱 Design responsive
- Compatible mobile, tablette et desktop
- Interface moderne et intuitive
- Navigation fluide

## 🔧 Personnalisation (optionnel)

### Changer les couleurs
Modifiez les variables CSS dans `src/index.css` :
```css
:root {
  --primary: #2563eb;    /* Couleur principale */
  --secondary: #7c3aed;  /* Couleur secondaire */
  --success: #10b981;    /* Couleur de succès */
  --warning: #f59e0b;    /* Couleur d'avertissement */
  --error: #ef4444;      /* Couleur d'erreur */
}
```

### Ajouter des questions personnalisées
Modifiez le fichier `src/lib/aiService.js` pour personnaliser les QCM générés.

## 🆘 Support

### Problèmes courants
- **Le site ne se charge pas** : Vérifiez que l'archive ZIP est valide
- **Erreur d'upload** : Vérifiez que vos PDF ne dépassent pas 10MB
- **Problème de connexion** : Videz le cache du navigateur

### Contact
Pour toute question ou problème :
- Consultez la documentation complète dans le README.md
- Vérifiez que votre navigateur est à jour
- Testez sur un autre navigateur

## 🎉 Félicitations !

Votre plateforme d'étude médicale est maintenant en ligne et prête à vous aider dans vos révisions. Bonne étude ! 📚✨

---

**Développé avec ❤️ pour les étudiants en médecine**