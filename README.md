# Project Documentation

This document describes the structure and setup instructions for both the frontend and backend parts of the project.

---

## Overview

The project is a full-stack web application that allows users to join communities, create posts, and interact with others. It includes role-based access (user, moderator, admin), real-time updates, and Firebase integration.

---


## Installation and Running Instructions

- Clone the Repository
- npm install in root of project
- create .env file with variables shared by administrator
- npm run start in the root of project

  ## Improvement Tasks

- Make the design responsive
- Implement photo upload and storage
- Add theme switching (light/dark)
- Add i18n support (translations)
- Add animations and transitions



## Frontend

### Technologies

- React
- TypeScript
- Material UI (MUI)
- React Router
- Recoil for state management
- Firebase (authentication, Firestore)
- Webpack


### Key Features

- Role-based UI rendering
- Community feed and post management
- Admin panel
- Realtime updates using Firestore listeners

### Directory: `/src`

- `components/` – reusable UI components
- `pages/` – main routes
- `store/` – Recoil atoms/selectors
- `hooks/` – custom hooks
- `types/` – TypeScript interfaces and enums
- `constants/` – static values (e.g., roles)
- ...
---

## Backend

> Firebase is used as a backend-as-a-service.

### Features

- Firestore for database
- Firebase Authentication
- Firebase Cloud Storage (if needed for image uploads)
- Firebase Functions (optional, for backend logic like moderation or notifications)

### Collections

- `users`
- `communities`
- `posts`

> All writes and reads are secured using Firebase rules based on user roles.

---


