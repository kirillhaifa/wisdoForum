import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { Button, Typography, Box, Avatar } from "@mui/material";
import { useUserData } from "./hooks/useUserData";
import { auth, provider } from "./firebase/firbase";

const App = () => {
  const [uid, setUid] = useState<string | null>(null);
  const { data: user, isLoading, error } = useUserData(uid);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUid(result.user.uid);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap={2}
    >
      <Typography variant="h3">Wisdo.Forum</Typography>

      {!uid ? (
        <Button variant="contained" onClick={handleLogin}>
          Sign in with Google
        </Button>
      ) : isLoading ? (
        <Typography>Loading user data...</Typography>
      ) : error ? (
        <Typography color="error">{(error as Error).message}</Typography>
      ) : user ? (
        <>
          <Avatar src={user.image} sx={{ width: 80, height: 80 }} />
          <Typography variant="h5">{user.name}</Typography>
          <Typography>{user.email}</Typography>
          <Typography>Role: {user.role || "none"}</Typography>
          <Typography>Country: {user.country}</Typography>
        </>
      ) : null}
    </Box>
  );
};

export default App;
