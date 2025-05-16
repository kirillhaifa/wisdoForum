import React from "react";
import { Button } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firbase";
import { provider } from "../../firebase/firbase";

const Login = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User:", result.user);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <Button variant="contained" onClick={handleLogin}>
        Sign in with Google
      </Button>
    </div>
  );
};

export default Login;
