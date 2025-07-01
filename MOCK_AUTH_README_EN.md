# WisdoForum - Mock Authentication

Firebase has been replaced with a mock authentication system to simplify development.

## Available Test Accounts

You can sign in using any of the following email addresses with any password:

- **admin@test.com** - Administrator (can approve communities and posts)
- **mod@test.com** - Moderator (can approve posts)  
- **user@test.com** - Regular user

## Features

### Authentication
- Login modal window instead of Google Auth
- "Sign In" button in Header to open the modal window
- Automatic logout when the application is closed

### Database
- All data is stored in memory (mockDatabase.ts)
- Pre-loaded test communities and posts
- Automatic ID generation for new records

### User Roles
- **Admin**: Can approve communities and posts, delete any posts
- **Moderator**: Can approve and delete posts
- **User**: Can create posts and communities, edit their own posts

## File Structure

```
src/
├── auth/
│   ├── mockAuth.ts          # Mock authentication system
│   └── mockDatabase.ts      # Mock database
├── components/
│   └── LoginModal/
│       └── LoginModal.tsx   # Login modal window
├── hooks/
│   ├── useUserData.ts       # Updated for mock system
│   ├── useCommunity.ts      # Updated for mock system
│   └── usePost.ts           # Updated for mock system
├── types/
    └── post.ts              # Updated MockTimestamp instead of Firebase Timestamp
```

## Changes

The following changes were made to implement the mock authentication system:

1. **Removed Firebase dependencies** from components and hooks
2. **Added mock authentication system** with predefined users
3. **Implemented local data storage** instead of Firestore
4. **Updated all hooks** to work with the mock system
5. **Added LoginModal component** for authentication UI

## Running

The project now works without any Firebase configuration. Simply run:

```bash
npm install
npm start
```

The application will be available at `http://localhost:3000`.
