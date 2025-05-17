import { db } from "../firebase/firbase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/userAtom";

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

    await addDoc(collection(db, "posts"), {
      title: data.title,
      summary: data.summary,
      body: data.body,
      communityId: data.communityId,
      authorId: user!.uid,
      likes: 0,
      approved: false,
      createdAt: serverTimestamp(),
    });
  };

  const approvePost = async (postId: string) => {
    ensureAuth();
    if (user!.role !== "admin" && user!.role !== "moderator") {
      throw new Error("Only admins or moderators can approve posts");
    }

    await updateDoc(doc(db, "posts", postId), {
      approved: true,
    });
  };

  const rejectPost = async (postId: string) => {
    ensureAuth();
    if (user!.role !== "admin" && user!.role !== "moderator") {
      throw new Error("Only admins or moderators can reject posts");
    }

    await deleteDoc(doc(db, "posts", postId));
  };

  const deletePost = async (postId: string) => {
    ensureAuth();

    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      throw new Error("Post not found");
    }

    const postData = postSnap.data();
    const isOwner = postData.authorId === user!.uid;
    const isAdminOrMod = user!.role === "admin" || user!.role === "moderator";

    if (!isOwner && !isAdminOrMod) {
      throw new Error("You are not allowed to delete this post");
    }

    await deleteDoc(postRef);
  };

  return {
    createPost,
    approvePost,
    rejectPost,
    deletePost,
  };
};
