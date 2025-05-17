import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCommunity } from "../../hooks/useCommunity";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Paper,
} from "@mui/material";

const CommunityPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getCommunityById } = useCommunity();
  const [loading, setLoading] = useState(true);
  const [community, setCommunity] = useState<any>(null);

useEffect(() => {
  const fetch = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getCommunityById(id); // ❗ getCommunityById внутри замыкания
      setCommunity(data);
    } catch (err) {
      console.error("❌ Failed to load community:", err);
    }
    setLoading(false);
  };

  fetch();
}, [id]); // ✅ Только id


  if (loading) {
    return (
      <Box mt={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!community) {
    return (
      <Typography mt={4} textAlign="center">
        Community not found
      </Typography>
    );
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          src={community.image}
          alt={community.title}
          sx={{ width: 60, height: 60 }}
        />
        <Typography variant="h5">{community.title}</Typography>
      </Box>
      <Typography mt={2} color="text.secondary">
        Members: {community.membersCount ?? 0}
      </Typography>
    </Paper>
  );
};

export default CommunityPage;
