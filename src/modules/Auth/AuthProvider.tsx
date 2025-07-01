import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../../store/userAtom";
import { mockAuth } from "../../auth/mockAuth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setUser = useSetRecoilState(userAtom);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = mockAuth.onAuthStateChanged((user) => {
      if (user) {
        setUser({
          uid: user.uid,
          name: user.name,
          email: user.email,
          image: user.image || "",
          role: user.role || "",
          country: user.country,
          communities: user.communities
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, [setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
