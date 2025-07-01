import React, { useState } from "react";
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
import { userAtom } from "../store/userAtom";
import { mockAuth } from "../auth/mockAuth";
import Logo from "./Logo";
import Navbar from "./Navbar";
import LoginModal from "./LoginModal/LoginModal";

const Header = () => {
  const user = useRecoilValue(userAtom);
  const resetUser = useResetRecoilState(userAtom);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleLogin = () => {
    setLoginModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await mockAuth.signOut();
      resetUser();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={{ backgroundColor: "#e9e8ff" }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ height: 30 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              paddingTop: '10px'
            }}
          >
            <Logo width={32} height={32} />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              letterSpacing: 1.5,
              fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif',
              textTransform: "uppercase",
              color: "#7143FF",
              userSelect: "none",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            Wisdo Forum
          </Typography>
        </Stack>

        {user ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={user.image} alt={user.name} />
            <Typography>{user.name}</Typography>
            <Button onClick={handleLogout}>Logout</Button>
          </Stack>
        ) : (
          <Button onClick={handleLogin}>Sign In</Button>
        )}
      </Toolbar>
      
      <LoginModal 
        open={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </AppBar>
  );
};

export default Header;
