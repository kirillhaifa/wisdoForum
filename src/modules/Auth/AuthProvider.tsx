import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useSetRecoilState } from "recoil";
import { useUserData } from "../../hooks/useUserData";
import { userAtom } from "../../store/userAtom";
import { auth } from "../../firebase/firbase";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [uid, setUid] = useState<string | null>(null);
  const setUser = useSetRecoilState(userAtom);

  const { data: userData } = useUserData(uid);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("Firebase auth state changed:", user?.uid);
      if (user) {
        setUid(user.uid);
        if (uid && userData) {
          console.log("📦 Setting user from Firestore:", { ...userData, uid });
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
