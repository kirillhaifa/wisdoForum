// Mock authentication system
export interface MockUser {
  uid: string;
  email: string;
  name: string;
  image?: string;
  role?: string;
  country: string;
  communities: string[];
}

// Mock users database
const mockUsers: MockUser[] = [
  {
    uid: 'user1',
    email: 'admin@test.com',
    name: 'Admin User',
    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><rect width="150" height="150" fill="%23ddd"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">150x150</text></svg>',
    role: 'admin',
    country: 'USA',
    communities: []
  },
  {
    uid: 'user2',
    email: 'user@test.com',
    name: 'Regular User',
    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><rect width="150" height="150" fill="%23ddd"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">150x150</text></svg>',
    role: 'user',
    country: 'Canada',
    communities: []
  },
  {
    uid: 'user3',
    email: 'mod@test.com',
    name: 'Moderator User',
    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><rect width="150" height="150" fill="%23ddd"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">150x150</text></svg>',
    role: 'moderator',
    country: 'UK',
    communities: []
  }
];

// Current authenticated user
let currentUser: MockUser | null = (() => {
  try {
    const savedUser = localStorage.getItem('mockAuthUser');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
})();

// Auth state listeners
const authStateListeners: ((user: MockUser | null) => void)[] = [];

export const mockAuth = {
  // Sign in with email and password
  signIn: async (email: string, password: string): Promise<MockUser> => {
    // Simple validation - any password works for existing users
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }

    currentUser = user;
    
    // Save to localStorage
    localStorage.setItem('mockAuthUser', JSON.stringify(currentUser));
    
    // Notify listeners
    authStateListeners.forEach(listener => listener(currentUser));
    
    return user;
  },

  // Sign out
  signOut: async (): Promise<void> => {
    currentUser = null;
    
    // Remove from localStorage
    localStorage.removeItem('mockAuthUser');
    
    authStateListeners.forEach(listener => listener(null));
  },

  // Get current user
  getCurrentUser: (): MockUser | null => {
    return currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: MockUser | null) => void): (() => void) => {
    authStateListeners.push(callback);
    
    // Call immediately with current state
    callback(currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = authStateListeners.indexOf(callback);
      if (index > -1) {
        authStateListeners.splice(index, 1);
      }
    };
  },

  // Get user by UID
  getUserByUid: async (uid: string): Promise<MockUser | null> => {
    return mockUsers.find(u => u.uid === uid) || null;
  },

  // Update user data
  updateUser: async (uid: string, updates: Partial<Omit<MockUser, 'uid'>>): Promise<void> => {
    const userIndex = mockUsers.findIndex(u => u.uid === uid);
    if (userIndex > -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
      
      // Update current user if it's the same user
      if (currentUser && currentUser.uid === uid) {
        currentUser = mockUsers[userIndex];
        // Save updated user to localStorage
        localStorage.setItem('mockAuthUser', JSON.stringify(currentUser));
        authStateListeners.forEach(listener => listener(currentUser));
      }
    }
  },

  // Add new user (for registration if needed)
  addUser: async (userData: Omit<MockUser, 'uid'>): Promise<MockUser> => {
    const newUser: MockUser = {
      ...userData,
      uid: `user${mockUsers.length + 1}`
    };
    
    mockUsers.push(newUser);
    return newUser;
  }
};
