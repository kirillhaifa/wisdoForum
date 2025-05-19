import React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaRegSadTear } from "react-icons/fa";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="md" sx={{ py: 10 }}>
      <Paper
        elevation={3}
        sx={{
          textAlign: "center",
          p: 6,
          borderRadius: 4,
        }}
      >
        <Box mb={3}>
          <FaRegSadTear size={80} color="#888" />
        </Box>

        <Typography variant="h2" fontWeight={700} gutterBottom>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Page not found
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          The page you are looking for might have been removed, renamed, or never existed.
        </Typography>
        <Button variant="contained" onClick={handleGoHome} size="large">
          Go to Home
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;
