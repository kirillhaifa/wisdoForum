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
      <Toolbar sx={{ 
        justifyContent: "space-between",
        px: { xs: 1, sm: 2, md: 3 },
        minHeight: { xs: 56, sm: 64 }
      }}>
        <Stack
          direction="row"
          spacing={{ xs: 0.5, sm: 1 }}
          alignItems="center"
          sx={{ height: { xs: 25, sm: 30 } }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              paddingTop: { xs: '8px', sm: '10px' }
            }}
          >
            <Logo width={32} height={32} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: { xs: 1, sm: 1.5 },
              fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif',
              textTransform: "uppercase",
              color: "#7143FF",
              userSelect: "none",
              cursor: "pointer",
              lineHeight: 1,
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            }}
          >
            {/* Shorten text on very small screens */}
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              Wisdo Forum
            </Box>
            <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
              Wisdo
            </Box>
          </Typography>
        </Stack>

        {user ? (
          <Stack direction="row" spacing={{ xs: 0.5, sm: 1, md: 2 }} alignItems="center">
            <Avatar 
              src={user.image} 
              alt={user.name}
              sx={{ 
                width: { xs: 28, sm: 32, md: 40 }, 
                height: { xs: 28, sm: 32, md: 40 } 
              }}
            />
            {/* Hide username on small screens */}
            <Typography 
              sx={{ 
                display: { xs: "none", sm: "block" },
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }
              }}
            >
              {user.name}
            </Typography>
            <Button 
              onClick={handleLogout}
              size="small"
              sx={{ 
                fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                px: { xs: 1, sm: 2 },
                py: { xs: 0.5, sm: 1 }
              }}
            >
              {/* Shorten button text on mobile */}
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                Logout
              </Box>
              <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                Exit
              </Box>
            </Button>
          </Stack>
        ) : (
          <Button 
            onClick={handleLogin}
            size="small"
            sx={{ 
              fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
              px: { xs: 1, sm: 2 },
              py: { xs: 0.5, sm: 1 }
            }}
          >
            {/* Shorten button text on mobile */}
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              Sign In
            </Box>
            <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
              Login
            </Box>
          </Button>
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
