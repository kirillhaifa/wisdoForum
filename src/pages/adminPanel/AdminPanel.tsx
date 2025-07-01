import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../store/userAtom";
import { mockDatabase } from "../../auth/mockDatabase";
import { Roles } from "../../constants/roles";

const AdminPanel = () => {
  const user = useRecoilValue(userAtom);
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnapproved = async () => {
      if (user?.role !== Roles.ADMIN) return;

      const pendingCommunities = await mockDatabase.getPendingCommunities();
      setCommunities(pendingCommunities);
      setLoading(false);
    };

    fetchUnapproved();
  }, [user]);

  const approve = async (id: string) => {
    await mockDatabase.approveCommunity(id);
    setCommunities((prev) => prev.filter((c) => c.id !== id));
  };

  const reject = async (id: string) => {
    // In this mock implementation, we'll just remove it from pending
    // In real implementation, you might want to keep a record
    setCommunities((prev) => prev.filter((c) => c.id !== id));
  };

  if (!user || user.role !== Roles.ADMIN) {
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }}>No access</Typography>
    );
  }

  if (loading) {
    return (
      <Box mt={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth={800} mx="auto" mt={4}>
      <Typography variant="h5" gutterBottom>
        Unapproved communities
      </Typography>

      {communities.length === 0 ? (
        <Typography>No new communities</Typography>
      ) : (
        communities.map((c) => (
          <Paper key={c.id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{c.title}</Typography>
            <Box
              component="img"
              src={c.image}
              alt={c.title}
              sx={{
                width: "100%",
                maxHeight: 200,
                objectFit: "cover",
                borderRadius: 1,
                mt: 1,
              }}
            />

            <Stack direction="row" spacing={2} mt={2}>
              <Button
                variant="contained"
                color="success"
                onClick={() => approve(c.id)}
              >
                Confirm
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => reject(c.id)}
              >
                Decline
              </Button>
            </Stack>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default AdminPanel;
