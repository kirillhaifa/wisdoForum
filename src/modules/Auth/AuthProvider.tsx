import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useSetRecoilState } from "recoil";
import { useUserData } from "../../hooks/useUserData";
import { userAtom } from "../../store/userAtom";
import { auth, db } from "../../firebase/firbase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [uid, setUid] = useState<string | null>(null);
  const setUser = useSetRecoilState(userAtom);

  const { data: userData } = useUserData(uid);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      console.log("Firebase auth state changed:", user?.uid);

      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        // 🆕 Добавим нового пользователя, если его ещё нет
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: user.displayName ?? "",
            email: user.email ?? "",
            image: user.photoURL ?? null,
            country: "Unknown", // можно потом обновить
            role: null,
            communities: [],
          });
          console.log("🆕 Новый пользователь добавлен в Firestore");
        }

        // 🔐 Устанавливаем UID, чтобы useUserData загрузил профиль
        setUid(user.uid);

        if (uid && userData) {
          console.log("📦 Устанавливаем user в атом:", { ...userData, uid });
          setUser({ ...userData, uid });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsub();
  }, [uid, userData, setUser]);

  return <>{children}</>;
};
