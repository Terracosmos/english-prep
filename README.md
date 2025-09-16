English Prep

Application web pour réviser le vocabulaire et les expressions d’anglais (orientation réseaux / IT).
Construite avec Vite + React + TypeScript + Tailwind, animations Framer Motion, icônes lucide-react.
Mobile-first, mode sombre, réponses mélangées, explications instantanées et révision ciblée.

<p align="left"> <img alt="Vite" src="https://img.shields.io/badge/Vite-7A57D1?logo=vite&logoColor=white"> <img alt="React" src="https://img.shields.io/badge/React-149ECA?logo=react&logoColor=white"> <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white"> <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-38bdf8?logo=tailwindcss&logoColor=white"> <img alt="Framer Motion" src="https://img.shields.io/badge/Framer%20Motion-111?logo=framer&logoColor=white"> <img alt="Vercel" src="https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel&logoColor=white"> </p>
✨ Fonctionnalités

Deux modes

Entraînement : feedback immédiat ✅/❌ + explication FR/EN.

Examen : minuteur global, feedback différé.

Contenus : mots, expressions, definitions (choix au démarrage).

Taille de session : 15 / 30 / 50 questions (activées selon le corpus).

Réponses mélangées à chaque apparition.

Révision : liste des erreurs + “Refaire ces erreurs”.

Dark mode (toggle), progress bar pendant le quiz.

Fond dégradé animé discret, style glass.

Raccourcis : 1–4 pour répondre, Entrée pour “Suivant”.

Responsive (iOS/Android/desktop) + footer compatible safe-area.

Accessibilité : focus visible, contrastes, annonces d’état.

🖼️ Aperçu

(Ajoute tes captures d’écran dans public/ puis remplace les chemins.)

Accueil
![Home](public/screens/home.png)

Quiz
![Quiz](public/screens/quiz.png)

Résultat & Révision
![Result](public/screens/result.png)

🚀 Lancer le projet

Pré-requis : Node 18+ et pnpm.

pnpm install
pnpm run dev
# ouvre http://localhost:5173


Build de production :

pnpm run build
pnpm run preview


Scripts utiles (extraits de package.json) :

{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "build:corpus": "node scripts/build-corpus.mjs"
  }
}

📁 Structure
english-prep/
├─ public/
├─ scripts/
│  └─ build-corpus.mjs           # Génération des fichiers data depuis CSV
├─ src/
│  ├─ components/
│  │  ├─ Background.tsx          # Fond dégradé animé
│  │  ├─ Footer.tsx
│  │  ├─ ProgressBar.tsx         # Barre de progression (quiz)
│  │  ├─ QuestionCard.tsx
│  │  └─ ThemeToggle.tsx
│  ├─ data/
│  │  ├─ vocab.ts                # Générés ou édités à la main
│  │  ├─ expressions.ts
│  │  └─ definitions.ts
│  ├─ App.tsx
│  ├─ App.css
│  └─ main.tsx
└─ package.json

🧩 Données & génération depuis CSV (optionnel)

Tu peux éditer les données directement dans src/data/*.ts ou générer ces fichiers à partir d’un CSV unique.

Place ton CSV ici : data/corpus.csv
Format minimal (en-têtes type,fr,en,def) :

type,fr,en,def
mots,Sauvegarde,backup,
expressions,mettre en production,deploy to,
definitions,firewall,,A network security system that monitors and controls traffic...


Génère les fichiers TS :

pnpm run build:corpus
# => met à jour src/data/vocab.ts, expressions.ts, definitions.ts


Le script utilise csv-parse pour lire data/corpus.csv et produit les structures type-safe exploitées par l’app.

🧠 Logique du quiz (résumé)

À partir du corpus choisi, on échantillonne N items et on fabrique des questions à 4 choix (1 bonne + 3 distracteurs aléatoires).

Les réponses sont mélangées à chaque affichage.

Entraînement : marquage immédiat + explication (FR si dispo).
Examen : timer global (N × 20s) + correction en fin de session.

Écran Révision : récap des erreurs, re-lancement d’un quiz “erreurs uniquement”.

🌗 Thème & style

Toggle clair/sombre via ThemeToggle.tsx (persistance localStorage).

Animations : hover/tap, shake sur mauvaise réponse, halo vert sur bonne réponse.

Progress bar (haut de page) : progression du nombre de questions.

Fond animé : léger mouvement de deux blobs translucides (Framer Motion), non intrusif.

⌨️ Raccourcis clavier

1 2 3 4 → sélectionner une réponse

Enter → “Suivant” (quand une réponse est choisie)

🔧 Déploiement (Vercel)

Pousser le repo sur GitHub.

Sur Vercel : New Project → Importer le repo.

Framework : Vite (détecté automatiquement).

Build Command : pnpm run build
Output Directory : dist

Deploy. Chaque git push → déploiement auto.

Alternative : Netlify (Build pnpm run build, Publish dist), ou GitHub Pages (adapter vite config si besoin).

🧪 Qualité & accessibilité

Focus visible pour le clavier.

Surfaces tactiles ≥ 44px.

Utilisation d’aria-labels et aria-live pour les messages d’état.

Contrastes vérifiés sur les couleurs principales.

🗺️ Roadmap (idées)

PWA (offline + installable).

Persistance des scores/statistiques (localStorage).

Export CSV des erreurs.

Import/export du corpus depuis l’UI.

Mode “révision espacée”.

🤝 Contribution

Fork & branche (feat/ma-feature)

pnpm i && pnpm dev

PR avec description concise + capture.

📄 Licence

MIT — fais-en bon usage.
