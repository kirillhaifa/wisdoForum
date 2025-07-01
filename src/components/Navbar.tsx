import React from "react";
import { Stack, Typography, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/userAtom";
import { Roles } from "../constants/roles";

const Navbar = () => {
  const location = useLocation();
  const user = useRecoilValue(userAtom);

  const isActive = (path: string) => location.pathname === path;

  const linkStyle = (path: string) => ({
    textDecoration: "none",
    color: isActive(path) ? "primary.main" : "text.primary",
    fontWeight: 300,
    fontSize: { xs: "0.875rem", sm: "1rem" },
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    transition: "color 0.2s",
    padding: { xs: "8px 16px", sm: "4px 8px", md: "0" },
    borderRadius: { xs: 1, sm: 0 },
    minWidth: { xs: "120px", sm: "auto" },
    textAlign: { xs: "center", sm: "left" },
    "&:hover": {
      color: "primary.dark",
      backgroundColor: { xs: "rgba(0,0,0,0.04)", sm: "transparent" },
    },
  });

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      sx={{
        marginBottom: '10px',
        px: { xs: 1, sm: 2 }
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 10, md: 20 }}
        justifyContent="center"
        alignItems="center"
        sx={{
          borderBottom: "1px solid black",
          pb: 1,
          width: { xs: "100%", sm: "auto" },
          maxWidth: "100%"
        }}
      >
        <Typography component={Link} to="/" sx={linkStyle("/")}>
          Home
        </Typography>
        <Typography
          component={Link}
          to="/my-communities"
          sx={linkStyle("/my-communities")}
        >
          My Communities
        </Typography>
        <Typography component={Link} to="/profile" sx={linkStyle("/profile")}>
          Profile
        </Typography>
        {user?.role === Roles.ADMIN && (
          <Typography
            component={Link}
            to="/admin-panel"
            sx={linkStyle("/admin")}
          >
            Admin
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default Navbar;
