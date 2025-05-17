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

const App = () => {
  return (
    <>
      <Header />

      {/* spacer под фиксированный AppBar */}
      <Toolbar />
      {/* Navbar под хедером */}
      <Box>
        <Navbar />
      </Box>

      {/* spacer под navbar */}
      <Toolbar />

      {/* Основной контент */}
      <Box sx={{ px: 2 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-communities" element={<MyCommunities />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/community/:id" element={<CommunityPage />} />
        </Routes>
      </Box>
    </>
  );
};

export default App;
