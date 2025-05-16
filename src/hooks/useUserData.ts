// src/hooks/useUserData.ts
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firbase";

export const useUserData = (uid: string | null) => {
  return useQuery({
    queryKey: ["user", uid],
    queryFn: async () => {
      if (!uid) throw new Error("No UID provided");

      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) throw new Error("User not found");

      return snap.data();
    },
    enabled: !!uid
  });
};
