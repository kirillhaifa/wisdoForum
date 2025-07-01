import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../store/userAtom";
import { mockAuth } from "../../auth/mockAuth";
import LoginModal from "../../components/LoginModal/LoginModal";

const Login = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const user = useRecoilValue(userAtom);

  const handleLogout = async () => {
    try {
      await mockAuth.signOut();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (user) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user.name}!
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Email: {user.email}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Role: {user.role || 'User'}
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Sign Out
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to WisdoForum
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Please sign in to continue
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => setModalOpen(true)}
        size="large"
      >
        Sign In
      </Button>
      
      <LoginModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </Box>
  );
};

export default Login;
