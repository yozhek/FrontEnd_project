# MovieGuess

## Short project description

MovieGuess is a web application where users guess movie titles from screenshots, choose a difficulty level, and receive a score based on their answers. The project also includes user accounts, profiles, a leaderboard, and optional AI-generated hints.

## Features

- Home page introducing the game and main sections of the application
- Screenshot-based movie quiz with easy, medium, and hard difficulty levels
- Dynamic question flow with answer selection, progress tracking, and results review
- Score calculation and profile score updates after finishing a game
- Responsive navigation, mobile burger menu, and adaptive layouts
- User profile page with quiz-related information and settings UI
- Authentication pages for registration, login, email verification, and Google sign-in
- Leaderboard page for ranking players
- Component and end-to-end testing with Cypress

## Technologies used

- Vue 3
- Vite
- Vue Router
- Pinia
- Firebase Authentication
- Cloud Firestore
- Cypress
- ESLint
- Prettier
- TMDB API
- Google Generative AI

## Team project note

This repository was created as a team project.

Some parts of the application were implemented by other team members and are not presented as my work:

- Leaderboard
- Authentication
- Logic for the "interesting facts" / AI hints feature
- Tests related to authentication

These areas may still appear in the project because they are part of the complete team deliverable.

## My contribution

My contribution covers the complete visual and user-facing layer of the application, supported by the codebase outside the excluded areas listed above.

- Full responsibility for the visual presentation of the app
- HTML and CSS implementation across the application
- Layout design and responsive behavior for desktop and mobile views
- UI implementation for the main pages and shared user-facing components
- Frontend structure and page composition using Vue components and Vue Router
- User-facing quiz flow implementation outside the excluded "interesting facts" logic
- Styling system based on shared CSS variables and reusable page-level styles

In practical terms, this includes the interface and presentation of the home page, quiz screens, navigation, footer, profile view layout, shared content boxes, responsive states, and other visible frontend behavior that is present in the repository outside the excluded areas.

## Installation

```bash
npm install
```

## Running the project

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run component tests:

```bash
npm run test:unit
```

Run end-to-end tests:

```bash
npm run test:e2e
```

## Project structure overview

```text
frontend_project/
|-- public/                 # Static assets
|-- src/
|   |-- assets/             # Global and shared styles, images, icons
|   |-- components/
|   |   |-- components/     # Reusable UI components
|   |   |-- pages/          # Route-level pages
|   |   `-- __tests__/      # Cypress component tests
|   |-- firebase/           # Firebase setup
|   |-- router/             # Vue Router configuration
|   |-- services/           # Firestore/profile helpers
|   |-- stores/             # Pinia stores
|   |-- App.vue             # Main app shell
|   `-- main.js             # App entry point
|-- cypress/                # Cypress e2e/support files
|-- vite.config.js          # Vite configuration
|-- cypress.config.js       # Cypress configuration
|-- eslint.config.js        # ESLint configuration
`-- package.json            # Scripts and dependencies
```

## Notes

- This README is written to present the project accurately as a junior frontend portfolio piece.
- The project integrates external services including Firebase, TMDB, and Google Generative AI.
- The repository currently includes both application code and team-deliverable features that were not all implemented by me.
