import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useCommunity } from "../../hooks/useCommunity";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../store/userAtom";

const CommunityPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getCommunityById, joinCommunity, leaveCommunity } = useCommunity();
  const user = useRecoilValue(userAtom);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [community, setCommunity] = useState<any>(null);

  const isMember = useMemo(() => {
    return !!(user?.communities?.includes(id || ""));
  }, [user, id]);

  const fetch = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getCommunityById(id);
      setCommunity(data);
    } catch (err) {
      console.error("❌ Failed to load community:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const handleJoin = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await joinCommunity(id);
      await fetch();
    } catch (err) {
      console.error("❌ Join failed:", err);
    }
    setActionLoading(false);
  };

  const handleLeave = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await leaveCommunity(id);
      await fetch();
    } catch (err) {
      console.error("❌ Leave failed:", err);
    }
    setActionLoading(false);
  };

  if (loading || actionLoading) {
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

      <Box mt={3}>
        {isMember ? (
          <Button
            variant="outlined"
            color="error"
            onClick={handleLeave}
            disabled={actionLoading}
          >
            Leave Community
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleJoin}
            disabled={actionLoading}
          >
            Join Community
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default CommunityPage;
