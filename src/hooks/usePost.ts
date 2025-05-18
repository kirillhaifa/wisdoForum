import { db } from "../firebase/firbase";
import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  onSnapshot
} from "firebase/firestore";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/userAtom";
import { Post } from "../types/post";

// внутри usePost
const PAGE_SIZE = 5;

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

  const subscribeToPostsByCommunityId = (
    communityId: string,
    onUpdate: (posts: Post[]) => void
  ) => {
    const isAdminOrMod = user?.role === "admin" || user?.role === "moderator";

    const constraints: any[] = [
      where("communityId", "==", communityId),
      orderBy("createdAt", "desc"),
    ];

    if (!isAdminOrMod) {
      constraints.unshift(where("approved", "==", true));
    }

    const q = query(collection(db, "posts"), ...constraints);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts: Post[] = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Post)
      );
      onUpdate(posts);
    });

    return unsubscribe; // вызвать для отписки
  };

  const getPostsByCommunityId = async (
    communityId: string,
    lastDoc: QueryDocumentSnapshot<DocumentData> | null = null
  ) => {
    const isAdminOrMod = user?.role === "admin" || user?.role === "moderator";

    // Базовые условия выборки
    const constraints: any[] = [
      where("communityId", "==", communityId),
      orderBy("createdAt", "desc"),
    ];

    // Если это не админ и не модератор, фильтруем только approved === true
    if (!isAdminOrMod) {
      constraints.unshift(where("approved", "==", true));
    }

    // Пагинация: если есть lastDoc — добавляем startAfter
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    // Добавляем лимит в конце
    constraints.push(limit(PAGE_SIZE));

    // Собираем полный запрос
    const q = query(collection(db, "posts"), ...constraints);

    // Выполняем запрос
    const snapshot = await getDocs(q);

    // Парсим документы
    const posts: Post[] = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Post)
    );

    // Устанавливаем курсор
    const nextCursor =
      snapshot.docs.length === PAGE_SIZE
        ? snapshot.docs[snapshot.docs.length - 1]
        : null;

    return { posts, nextCursor };
  };

  return {
    createPost,
    approvePost,
    rejectPost,
    deletePost,
    getPostsByCommunityId,
    subscribeToPostsByCommunityId
  };
};
