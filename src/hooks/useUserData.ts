import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firbase";
import { useSetRecoilState } from "recoil";
import { userAtom, UserData } from "../store/userAtom";
import { useEffect } from "react";

export const useUserData = (uid: string | null) => {
  const setUser = useSetRecoilState(userAtom);


  const query = useQuery({
    queryKey: ["user", uid],
    queryFn: async (): Promise<UserData> => {
      if (!uid) throw new Error("No UID provided");

      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) throw new Error("User not found");

      const userData = snap.data();
      return {
        ...(userData as Omit<UserData, "uid">),
        uid,
      };  
    },
    enabled: !!uid,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return query;
};
