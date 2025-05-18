import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomeIntroSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom,rgb(255, 255, 255), #e2ebf0)",
        py: { xs: 6, md: 10 },
        textAlign: "center",
        px: 2,
        overflow: 'hidden',
        borderRadius: 2
      }}
    >
      <Container maxWidth="sm">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            fontSize: { xs: "2rem", md: "2.5rem" },
            color: "#263238",
          }}
        >
          You're Not Alone
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            mb: 4,
            color: "#37474f",
            fontSize: { xs: "1rem", md: "1.15rem" },
          }}
        >
          This is a safe and supportive space for anyone going through difficult times. 
          Share your story, ask for help, or just connect with people who understand. 
          Together, we heal and grow.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/communities")}
          sx={{
            bgcolor: "#455a64",
            "&:hover": {
              bgcolor: "#37474f",
            },
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            borderRadius: 3,
            textTransform: "none",
          }}
        >
          Find Your Community
        </Button>
      </Container>
    </Box>
  );
};

export default HomeIntroSection;
