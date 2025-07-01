import React from "react";
import { Box, Toolbar } from "@mui/material";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import MyCommunities from "./pages/myCommunities/myCommunities";
import Profile from "./pages/profile/profile";
import AdminPanel from "./pages/adminPanel/AdminPanel";
import CommunityPage from "./pages/community/CommunityPage";
import NotFoundPage from "./pages/notFound/NotFound";
import useIframeEvents from "./hooks/useIframeEvents";

const App = () => {
  // Initialize iframe event handling
  useIframeEvents();

  return (
    <>
      <Header />
      <Toolbar />
      <Navbar />
      <Box sx={{ px: { xs: 0, sm: 1, md: 2 }, maxWidth: "100vw", overflowX: "hidden" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-communities" element={<MyCommunities />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/community/:id" element={<CommunityPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
    </>
  );
};

export default App;
