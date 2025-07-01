// Mock Timestamp interface to replace Firebase Timestamp
export interface MockTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
  toMillis: () => number;
  isEqual: (other: MockTimestamp) => boolean;
  toJSON: () => string;
}

export interface Post {
  id: string;
  title: string;
  summary: string;
  body: string;
  authorId: string;
  communityId: string;
  likes: number;
  approved: boolean;
  createdAt: MockTimestamp;
}
