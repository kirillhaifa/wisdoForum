import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../store/userAtom";

interface Props {
  onJoin?: () => void;
  joinDisabled?: boolean;
}

const SignInPrompt: React.FC<Props> = ({ onJoin, joinDisabled }) => {
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);
  const isAuthenticated = Boolean(user);

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 2,
        p: 2,
        border: "1px solid #ddd",
        borderRadius: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h6" gutterBottom>
        {isAuthenticated
          ? "Join the community to make a post"
          : "To make a post, please sign in"}
      </Typography>

      <Button
        variant="contained"
        onClick={() =>
          isAuthenticated ? onJoin?.() : navigate("/login")
        }
        disabled={isAuthenticated && joinDisabled}
      >
        {isAuthenticated ? "Join Community" : "Sign In"}
      </Button>
    </Box>
  );
};

export default SignInPrompt;
