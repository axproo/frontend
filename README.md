# Axproo Frontend – Vue 3 + Bootstrap 5

Bienvenue dans le frontend du projet Axproo.
Ce dépôt contient l’interface utilisateur développée en Vue.js 3 avec Bootstrap 5, pensée pour être simple, moderne et responsive.

## Prérequis

Chaque membre doit installer en local :

- Node.js ≥ 18
- npm ≥ 9
- Git
- VS Code (recommandé, avec extensions Prettier et ESLint)

## Installation locale
### Cloner le projet

```sh
git clone https://github.com/axproo/frontend.git
cd frontend
```

### Installer les dépendances

```sh
npm install
```

### Lancer le projet

```sh
npm run dev
- Disponible sur: http://localhost:5173
```

### Structure du projet

```sh
src/
 ├── assets/        # Images, icônes, styles
 ├── components/    # Composants réutilisables Vue
 ├── layouts/       # Layouts globaux (Header, Sidebar…)
 ├── pages/         # Pages principales (Login, Dashboard, 404…)
 ├── router/        # Configuration du routeur Vue
 ├── store/         # Pinia (gestion d’état)
 └── main.js        # Point d’entrée
```

### Routing

Le frontend utilise Vue Router 4.
Chaque fonctionnalité possède sa route dédiée.

```sh
{
  path: '/login',
  name: 'Login',
  component: () => import('../pages/Login.vue')
}
```
### UI / Design

- Bootstrap 5 est utilisé pour la mise en page et les composants.
- Les pages principales incluent :
    - Login
    - Dashboard
    - Page 404 personnalisée

### Workflow Git

Même organisation que le backend :

#### Créer une branche par fonctionnalité
```sh
git checkout -b feature/nom-fonctionnalite
```

#### Commit clair et concis
```sh
git commit -m "feat(ui): ajout du template dashboard"
```

#### Push de la branche
```sh
git push origin feature/nom-fonctionnalite
```

#### Ouvrir une Pull Request (PR) pour merge vers main.

### CI/CD (optionnel)
Le frontend pourra être déployé automatiquement via GitHub Actions vers :

- un hébergement web statique (Netlify, Vercel, GitHub Pages)
- ou sur le même serveur cPanel que le backend.

Secrets nécessaires :

- FTP_SERVER
- FTP_USERNAME
- FTP_PASSWORD
- FTP_PORT

### Objectif de ce projet

Offrir une expérience utilisateur claire et intuitive, avec un workflow de développement collaboratif fluide :

✅ Architecture modulaire (Vue 3 + Pinia + Vue Router)
✅ Design responsive (Bootstrap 5)
✅ CI/CD (tests + déploiement auto)
✅ Documentation claire pour l’équipe

Ce frontend est la vitrine utilisateur de la plateforme Axproo.
Ensemble, construisons une interface moderne et performante.

## Prochaines étapes :
- Ajouter le système d’authentification connecté au backend
- Intégrer le tableau de bord dynamique
- Mettre en place les tests E2E (Cypress ou Playwright)