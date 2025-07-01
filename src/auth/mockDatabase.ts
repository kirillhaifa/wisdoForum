// Mock database for communities and posts
export interface MockCommunity {
  id: string;
  title: string;
  image: string;
  membersCount: number;
  approved: boolean;
}

export interface MockPost {
  id: string;
  title: string;
  summary: string;
  body: string;
  communityId: string;
  authorId: string;
  likes: number;
  approved: boolean;
  createdAt: Date;
}

// Mock data storage
let mockCommunities: MockCommunity[] = [
  {
    id: 'community1',
    title: 'Technology',
    image: 'https://belretail.by/files/article/6078/2c9de42603339d6fcfeb8c68f33b2f23.jpg',
    membersCount: 15,
    approved: true,
  },
  {
    id: 'community2',
    title: 'Science',
    image: 'https://www.hse.ru/data/2020/04/30/1544673822/3iStock-970562458.jpg',
    membersCount: 8,
    approved: true,
  },
  {
    id: 'community3',
    title: 'Gaming',
    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23ddd"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">300x200</text></svg>',
    membersCount: 22,
    approved: false,
  }
];

let mockPosts: MockPost[] = [
  {
    id: 'post1',
    title: 'Welcome to the Technology Community',
    summary: 'Introduction to our tech community',
    body: 'This is a place where we discuss the latest in technology...',
    communityId: 'community1',
    authorId: 'user1',
    likes: 5,
    approved: true,
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 'post2',
    title: 'Latest Scientific Discoveries',
    summary: 'Recent breakthroughs in science',
    body: 'Scientists have recently discovered...',
    communityId: 'community2',
    authorId: 'user2',
    likes: 3,
    approved: true,
    createdAt: new Date('2023-01-02'),
  }
];

let nextCommunityId = 4;
let nextPostId = 3;

export const mockDatabase = {
  // Communities
  createCommunity: async (data: { title: string; image: string; userId: string }): Promise<string> => {
    const newCommunity: MockCommunity = {
      id: `community${nextCommunityId++}`,
      title: data.title,
      image: data.image,
      membersCount: 1,
      approved: false,
    };
    
    mockCommunities.push(newCommunity);
    return newCommunity.id;
  },

  approveCommunity: async (communityId: string): Promise<void> => {
    const community = mockCommunities.find(c => c.id === communityId);
    if (community) {
      community.approved = true;
    }
  },

  getApprovedCommunities: async (offset = 0, limit = 10): Promise<MockCommunity[]> => {
    return mockCommunities
      .filter(c => c.approved)
      .slice(offset, offset + limit);
  },

  getCommunityById: async (id: string): Promise<MockCommunity | null> => {
    return mockCommunities.find(c => c.id === id) || null;
  },

  joinCommunity: async (communityId: string): Promise<void> => {
    const community = mockCommunities.find(c => c.id === communityId);
    if (community) {
      community.membersCount++;
    }
  },

  leaveCommunity: async (communityId: string): Promise<void> => {
    const community = mockCommunities.find(c => c.id === communityId);
    if (community && community.membersCount > 0) {
      community.membersCount--;
    }
  },

  // Posts
  createPost: async (data: {
    title: string;
    summary: string;
    body: string;
    communityId: string;
    authorId: string;
  }): Promise<string> => {
    const newPost: MockPost = {
      id: `post${nextPostId++}`,
      title: data.title,
      summary: data.summary,
      body: data.body,
      communityId: data.communityId,
      authorId: data.authorId,
      likes: 0,
      approved: false,
      createdAt: new Date(),
    };
    
    mockPosts.push(newPost);
    return newPost.id;
  },

  approvePost: async (postId: string): Promise<void> => {
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
      post.approved = true;
    }
  },

  deletePost: async (postId: string): Promise<void> => {
    mockPosts = mockPosts.filter(p => p.id !== postId);
  },

  updatePost: async (postId: string, updates: Partial<MockPost>): Promise<void> => {
    const postIndex = mockPosts.findIndex(p => p.id === postId);
    if (postIndex > -1) {
      mockPosts[postIndex] = { ...mockPosts[postIndex], ...updates };
    }
  },

  getPostById: async (id: string): Promise<MockPost | null> => {
    return mockPosts.find(p => p.id === id) || null;
  },

  getPostsByCommunity: async (communityId: string, offset = 0, limit = 5): Promise<MockPost[]> => {
    return mockPosts
      .filter(p => p.communityId === communityId && p.approved)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  },

  getAllApprovedPosts: async (offset = 0, limit = 5): Promise<MockPost[]> => {
    return mockPosts
      .filter(p => p.approved)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  },

  likePost: async (postId: string): Promise<void> => {
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
      post.likes++;
    }
  },

  unlikePost: async (postId: string): Promise<void> => {
    const post = mockPosts.find(p => p.id === postId);
    if (post && post.likes > 0) {
      post.likes--;
    }
  },

  // Admin functions
  getPendingCommunities: async (): Promise<MockCommunity[]> => {
    return mockCommunities.filter(c => !c.approved);
  },

  getPendingPosts: async (): Promise<MockPost[]> => {
    return mockPosts.filter(p => !p.approved);
  },
};
