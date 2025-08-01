# QCM Médecine 11 - Plateforme de Révision Intelligente

## 🎯 Description

QCM Médecine 11 est une plateforme de révision intelligente conçue spécifiquement pour les étudiants en médecine. Elle permet d'importer des documents PDF, de générer automatiquement des QCM, des flashcards et des résumés grâce à l'intelligence artificielle.

## ✨ Fonctionnalités Principales

### 🔐 Authentification
- **Connexion classique** : Email et mot de passe
- **Connexion Google** : Authentification via Google
- **Mode invité** : Accès sans compte (données sauvegardées localement)

### 📚 Import et Traitement
- Import de documents PDF, Word
- Extraction automatique du texte
- Génération de contenu intelligent

### 🧠 Intelligence Artificielle
- Génération automatique de QCM
- Création de flashcards interactives
- Résumés intelligents des cours
- Assistant IA pour répondre aux questions

### 📊 Suivi et Statistiques
- Suivi des progrès
- Statistiques de performance
- Historique des révisions

## 🚀 Déploiement sur Netlify

### Méthode 1 : Déploiement Direct (Recommandé)

1. **Préparer les fichiers**
   ```bash
   # Tous les fichiers sont déjà prêts dans ce dossier
   ```

2. **Créer un compte Netlify**
   - Allez sur [netlify.com](https://netlify.com)
   - Créez un compte gratuit

3. **Déployer**
   - Glissez-déposez le dossier `qcm_medecine_11` sur la zone de déploiement Netlify
   - Ou utilisez le bouton "Deploy manually"

4. **Configuration automatique**
   - Netlify détectera automatiquement qu'il s'agit d'un site statique
   - Le fichier `_redirects` est déjà configuré pour le SPA

### Méthode 2 : Via Git (Optionnel)

1. **Créer un repository Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - QCM Médecine 11"
   ```

2. **Connecter à Netlify**
   - Dans Netlify, choisissez "Deploy from Git"
   - Connectez votre repository
   - Netlify se chargera du déploiement automatique

## 🔧 Configuration

### Firebase (Optionnel)
La plateforme fonctionne en mode invité sans Firebase. Si vous souhaitez activer l'authentification :

1. Créez un projet Firebase
2. Activez l'authentification par email et Google
3. Remplacez les clés dans `config.js`

### Variables d'Environnement (Optionnel)
```env
FIREBASE_API_KEY=votre_clé_api
FIREBASE_AUTH_DOMAIN=votre_domaine
FIREBASE_PROJECT_ID=votre_projet
```

## 📱 Utilisation

### Mode Invité (Recommandé pour commencer)
1. Cliquez sur "Continuer sans compte"
2. Importez vos documents
3. Utilisez toutes les fonctionnalités
4. Vos données sont sauvegardées localement

### Mode Connecté
1. Créez un compte ou connectez-vous
2. Vos données seront synchronisées
3. Accès depuis n'importe quel appareil

## 🛠️ Structure du Projet

```
qcm_medecine_11/
├── index.html              # Page principale
├── config.js               # Configuration
├── assets/
│   ├── style.css           # Styles CSS
│   └── logo.png            # Logo
├── scripts/
│   ├── auth.js             # Gestion d'authentification
│   ├── main.js             # Logique principale
│   ├── import.js           # Import de documents
│   ├── qcm.js              # Gestion des QCM
│   ├── flashcards.js       # Gestion des flashcards
│   ├── ai-chat.js          # Assistant IA
│   └── ...                 # Autres modules
├── _redirects              # Configuration Netlify
└── README.md               # Ce fichier
```

## 🎨 Personnalisation

### Thème
- Thème clair/sombre automatique
- Couleurs médicales professionnelles
- Interface responsive

### Matières Supportées
- Anatomie
- Physiologie
- Biochimie
- Histologie
- Embryologie
- Immunologie
- Microbiologie
- Pharmacologie
- Pathologie
- Sémiologie

## 🔒 Sécurité et Confidentialité

### Mode Invité
- Données stockées localement
- Aucune transmission vers des serveurs
- Respect total de la confidentialité

### Mode Connecté
- Chiffrement des données
- Authentification sécurisée
- Conformité RGPD

## 📈 Performance

- Chargement rapide (< 2 secondes)
- Fonctionnement hors ligne
- Optimisé pour mobile
- Cache intelligent

## 🐛 Dépannage

### Problèmes Courants

1. **Page ne se charge pas**
   - Vérifiez la connexion internet
   - Essayez le mode invité

2. **Import ne fonctionne pas**
   - Vérifiez le format du fichier (PDF, Word)
   - Taille maximale : 10MB

3. **IA ne répond pas**
   - Service gratuit avec limitations
   - Réessayez dans quelques minutes

### Support
- Mode invité toujours disponible
- Fonctionnalités principales sans connexion
- Interface intuitive

## 🚀 Améliorations Version 11

- ✅ Correction des erreurs Firebase
- ✅ Ajout du mode invité
- ✅ Amélioration de la stabilité
- ✅ Interface plus intuitive
- ✅ Performance optimisée
- ✅ Prêt pour déploiement Netlify

## 📄 Licence

Ce projet est sous licence MIT. Libre d'utilisation pour les étudiants en médecine.

---

**QCM Médecine 11** - Votre partenaire de révision intelligent 🩺