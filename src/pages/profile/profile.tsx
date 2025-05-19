import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Avatar,
  Container,
  Button,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../store/userAtom";
import { useUserData } from "../../hooks/useUserData";

const ROLES = ["user", "moderator", "admin"];

const ProfilePage: React.FC = () => {
  const { uid } = useRecoilValue(userAtom) ?? {}; // UID берётся из глобального состояния
  const { userQuery, updateUser } = useUserData(uid ?? null);

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (userQuery.data) {
      setName(userQuery.data.name ?? "");
      setCountry(userQuery.data.country ?? "");
      setRole(userQuery.data.role ?? "user");
    }
  }, [userQuery.data]);

  const handleSave = () => {
    updateUser.mutate({
      name,
      country,
      role,
    });
  };

  if (userQuery.isLoading || !userQuery.data) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
        <Typography mt={2}>Loading profile...</Typography>
      </Box>
    );
  }

  const user = userQuery.data;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Avatar
          src={user.image}
          alt={user.name}
          sx={{ width: 100, height: 100 }}
        />
        <Typography variant="h5">{user.email}</Typography>

        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <TextField
          fullWidth
          label="Role"
          select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {ROLES.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={updateUser.isPending}
        >
          Save Changes
        </Button>
      </Box>
    </Container>
  );
};

export default ProfilePage;
