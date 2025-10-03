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