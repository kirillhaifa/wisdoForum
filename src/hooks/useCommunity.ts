import { db } from "../firebase/firbase";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  startAfter,
  orderBy,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/userAtom";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 10;

export const useCommunity = () => {
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const ensureAuth = () => {
    if (!user) {
      navigate("/login");
      throw new Error("Redirected to login");
    }
  };

  const createCommunity = async (title: string, image: string) => {
    ensureAuth();

    const ref = await addDoc(collection(db, "communities"), {
      title,
      image,
      membersCount: 1,
      approved: false,
    });

    // Добавить сообщество в профиль пользователя
    await updateDoc(doc(db, "users", user!.uid), {
      communities: arrayUnion(ref.id),
    });

    return ref.id;
  };

  // ✅ Апрув сообщества (только админ)
  const approveCommunity = async (communityId: string) => {
    if (!user || user.role !== "admin") {
      throw new Error("Only admins can approve communities");
    }

    await updateDoc(doc(db, "communities", communityId), {
      approved: true,
    });
  };

  // ✅ Получить список approved сообществ
  const getApprovedCommunities = async (
    lastDoc: QueryDocumentSnapshot<DocumentData> | null = null
  ) => {
    let q = query(
      collection(db, "communities"),
      where("approved", "==", true),
      orderBy("title"),
      limit(PAGE_SIZE)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const communities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const nextCursor =
      snapshot.docs.length === PAGE_SIZE
        ? snapshot.docs[snapshot.docs.length - 1]
        : null;

    return { communities, nextCursor };
  };

  // ✅ Получить конкретное сообщество
  const getCommunityById = async (id: string) => {
    const ref = doc(db, "communities", id);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  };

  return {
    createCommunity,
    approveCommunity,
    getApprovedCommunities,
    getCommunityById,
  };
};
