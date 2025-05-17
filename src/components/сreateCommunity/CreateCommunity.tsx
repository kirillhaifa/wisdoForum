import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCommunity } from "../../hooks/useCommunity";

const CreateCommunity = () => {
  const { createCommunity } = useCommunity();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title || !image) {
      setError("Пожалуйста, заполни все поля");
      return;
    }

    try {
      const id = await createCommunity(title, image);
      console.log("Сообщество создано:", id);
      navigate("/my-communities");
    } catch (err) {
      console.error("Ошибка при создании сообщества:", err);
      setError("Не удалось создать сообщество");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ maxWidth: 500, mx: "auto", mt: 6, p: 4 }}
    >
      <Typography variant="h5" gutterBottom>
        Create new community
      </Typography>

      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Name of community"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          inputProps={{ maxLength: 60 }}
          required
        />

        <TextField
          label="Link to image (URL)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />

        {error && <Alert severity="error">{error}</Alert>}

        <Button type="submit" variant="contained">
          Create
        </Button>
      </Box>
    </Paper>
  );
};

export default CreateCommunity;
