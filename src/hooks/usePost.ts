import { useRecoilValue } from "recoil";
import { userAtom } from "../store/userAtom";
import { Post, MockTimestamp } from "../types/post";
import { Roles } from "../constants/roles";
import { mockDatabase } from "../auth/mockDatabase";

const PAGE_SIZE = 5;

const createMockTimestamp = (date: Date): MockTimestamp => ({
  seconds: Math.floor(date.getTime() / 1000),
  nanoseconds: 0,
  toDate: () => date,
  toMillis: () => date.getTime(),
  isEqual: (other: MockTimestamp) => date.getTime() === other.toMillis(),
  toJSON: () => date.toISOString()
});

export const usePost = () => {
  const user = useRecoilValue(userAtom);

  const ensureAuth = () => {
    if (!user) throw new Error("User not authenticated");
  };

  const createPost = async (data: {
    title: string;
    summary: string;
    body: string;
    communityId: string;
  }) => {
    ensureAuth();

    const postId = await mockDatabase.createPost({
      title: data.title,
      summary: data.summary,
      body: data.body,
      communityId: data.communityId,
      authorId: user!.uid,
    });

    return postId;
  };

  const approvePost = async (postId: string) => {
    if (!user || (user.role !== Roles.ADMIN && user.role !== Roles.MODERATOR)) {
      throw new Error("Only admins and moderators can approve posts");
    }

    await mockDatabase.approvePost(postId);
  };

  const deletePost = async (postId: string) => {
    ensureAuth();

    const post = await mockDatabase.getPostById(postId);
    if (!post) throw new Error("Post not found");

    const canDelete = 
      post.authorId === user!.uid || 
      user!.role === Roles.ADMIN || 
      user!.role === Roles.MODERATOR;

    if (!canDelete) {
      throw new Error("You don't have permission to delete this post");
    }

    await mockDatabase.deletePost(postId);
  };

  const updatePost = async (postId: string, updates: { title?: string; summary?: string; body?: string }) => {
    ensureAuth();

    const post = await mockDatabase.getPostById(postId);
    if (!post) throw new Error("Post not found");

    if (post.authorId !== user!.uid) {
      throw new Error("You can only edit your own posts");
    }

    await mockDatabase.updatePost(postId, updates);
  };

  const getPostById = async (id: string): Promise<Post | null> => {
    const post = await mockDatabase.getPostById(id);
    if (!post) return null;

    return {
      id: post.id,
      title: post.title,
      summary: post.summary,
      body: post.body,
      communityId: post.communityId,
      authorId: post.authorId,
      likes: post.likes,
      approved: post.approved,
      createdAt: createMockTimestamp(post.createdAt),
    };
  };

  const getPostsByCommunity = async (
    communityId: string,
    lastDoc: any = null
  ): Promise<{ posts: Post[]; nextCursor: any }> => {
    const offset = lastDoc ? lastDoc.offset : 0;
    const mockPosts = await mockDatabase.getPostsByCommunity(communityId, offset, PAGE_SIZE);
    
    const posts: Post[] = mockPosts.map(post => ({
      id: post.id,
      title: post.title,
      summary: post.summary,
      body: post.body,
      communityId: post.communityId,
      authorId: post.authorId,
      likes: post.likes,
      approved: post.approved,
      createdAt: createMockTimestamp(post.createdAt),
    }));

    const nextCursor = posts.length === PAGE_SIZE 
      ? { offset: offset + PAGE_SIZE }
      : null;

    return { posts, nextCursor };
  };

  const getAllPosts = async (
    lastDoc: any = null
  ): Promise<{ posts: Post[]; nextCursor: any }> => {
    const offset = lastDoc ? lastDoc.offset : 0;
    const mockPosts = await mockDatabase.getAllApprovedPosts(offset, PAGE_SIZE);
    
    const posts: Post[] = mockPosts.map(post => ({
      id: post.id,
      title: post.title,
      summary: post.summary,
      body: post.body,
      communityId: post.communityId,
      authorId: post.authorId,
      likes: post.likes,
      approved: post.approved,
      createdAt: createMockTimestamp(post.createdAt),
    }));

    const nextCursor = posts.length === PAGE_SIZE 
      ? { offset: offset + PAGE_SIZE }
      : null;

    return { posts, nextCursor };
  };

  const likePost = async (postId: string) => {
    ensureAuth();
    await mockDatabase.likePost(postId);
  };

  const unlikePost = async (postId: string) => {
    ensureAuth();
    await mockDatabase.unlikePost(postId);
  };

  const subscribeToPostsByCommunity = (
    communityId: string,
    callback: (posts: Post[]) => void
  ): (() => void) => {
    getPostsByCommunity(communityId).then(({ posts }) => {
      callback(posts);
    });

    return () => {};
  };

  return {
    createPost,
    approvePost,
    deletePost,
    updatePost,
    getPostById,
    getPostsByCommunity,
    getAllPosts,
    likePost,
    unlikePost,
    subscribeToPostsByCommunity,
  };
};
