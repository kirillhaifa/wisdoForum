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
    fontSize: "1rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    transition: "color 0.2s",
    "&:hover": {
      color: "primary.dark",
    },
  });

  return (
    <Box display="flex" justifyContent="center" sx={{marginBottom: '10px'}}>
      <Stack
        direction="row"
        spacing={20}
        justifyContent="center"
        alignItems="center"
        sx={{
          borderBottom: "1px solid black",
          pb: 1,
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
