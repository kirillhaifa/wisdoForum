import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSetRecoilState } from "recoil";
import { userAtom, UserData } from "../store/userAtom";
import { useEffect } from "react";
import { mockAuth } from "../auth/mockAuth";

export const useUserData = (uid: string | null) => {
  const setUser = useSetRecoilState(userAtom);
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["user", uid],
    queryFn: async (): Promise<UserData> => {
      if (!uid) throw new Error("No UID provided");

      const user = await mockAuth.getUserByUid(uid);
      if (!user) throw new Error("User not found");

      return {
        uid: user.uid,
        name: user.name,
        email: user.email,
        image: user.image || "",
        role: user.role || "",
        country: user.country,
        communities: user.communities
      };
    },
    enabled: !!uid,
  });

  useEffect(() => {
    if (userQuery.data) {
      setUser(userQuery.data);
    }
  }, [userQuery.data, setUser]);

  const updateUser = useMutation({
    mutationFn: async (updates: Partial<Omit<UserData, "uid">>) => {
      if (!uid) throw new Error("No UID provided");
      await mockAuth.updateUser(uid, updates);
      return updates;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user", uid] });
    },
  });

  return { userQuery, updateUser };
};
