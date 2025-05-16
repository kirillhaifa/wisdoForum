import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Stack,
  Box,
} from "@mui/material";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { signOut, signInWithPopup } from "firebase/auth";
import { userAtom } from "../store/userAtom";
import { auth, provider } from "../firebase/firbase";
import Logo from "./Logo";

const Header = () => {
  const user = useRecoilValue(userAtom);
  const resetUser = useResetRecoilState(userAtom);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      resetUser();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Логотип + название */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Logo width={32} height={32} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Wisdo.Forum
          </Typography>
        </Stack>

        {/* Авторизация или профиль */}
        {user ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={user.image} alt={user.name} />
            <Typography>{user.name}</Typography>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Stack>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleLogin}
          >
            Sign in with Google
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
