# 🏗️ Audit Binary — Bryan Richmaker

Application d'audit de business pour coaches, consultants et agences.

## Fonctionnalités

- Landing page avec hook viral
- Capture email avec qualification
- Audit en 3 étapes : Macro → Micro → Atomique
- Visualisation interactive du funnel
- Identification du goulet d'étranglement
- CTA vers prise de rendez-vous iClosed

## Stack Technique

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Base de données**: Notion API
- **Analytics**: Plausible

## Installation

```bash
# Cloner le repo
git clone https://github.com/Bryan-Richlab/Atomic-Architecture.git
cd Atomic-Architecture

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés API

# Lancer en développement
npm run dev
```

## Variables d'Environnement

```env
NOTION_API_KEY=       # Clé API Notion
NOTION_DATABASE_ID=   # ID de la base de données Notion
RESEND_API_KEY=       # Clé API Resend (optionnel)
```

## Structure

```
src/
├── app/
│   ├── page.tsx           # Landing page
│   ├── email/page.tsx     # Capture email
│   ├── funnel/page.tsx    # Audit quiz
│   ├── results/page.tsx   # Visualisation + CTA
│   └── api/save-audit/    # API Notion
├── components/            # Composants réutilisables
├── lib/                   # Utilitaires
└── types/                 # Types TypeScript
```

## Design System

Couleurs brandées :
- **Primary**: #272757 (bleu nuit)
- **Accent**: #ffd100 (jaune)
- **Secondary**: #8da9c4 (bleu clair)
- **Background**: #f5f5f5 (gris clair)

## Déploiement

Déployé sur Vercel :

```bash
npm run build
npm run start
```

## Contact

**Bryan Richmaker** — Architecte IA
Richlab Creation
