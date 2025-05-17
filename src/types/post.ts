import { Timestamp } from "firebase/firestore";

export interface Post {
  id: string;
  title: string;
  summary: string;
  body: string;
  authorId: string;
  communityId: string;
  likes: number;
  approved: boolean;
  createdAt: Timestamp;
}
