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
  const { userQuery } = useUserData(uid);
  const userData = userQuery.data;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: user.displayName ?? "",
            email: user.email ?? "",
            image: user.photoURL ?? null,
            country: "Unknown",
            role: null,
            communities: [],
          });
        }

        setUid(user.uid); 
      } else {
        setUser(null);
      }
    });

    return () => unsub();
  }, [setUser]);

  useEffect(() => {
    if (uid && userData) {
      setUser({ ...userData, uid });
    }
  }, [uid, userData, setUser]);

  return <>{children}</>;
};
