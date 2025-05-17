import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { usePost } from "../../hooks/usePost";

const MAX_TITLE = 60;
const MAX_SUMMARY_WORDS = 150;

interface Props {
  communityId: string;
}

const CreatePostForm = ({ communityId }: Props) => {
  const { createPost } = usePost();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const summaryWords = summary.trim().split(/\s+/).filter(Boolean);
  const summaryWordsLeft = MAX_SUMMARY_WORDS - summaryWords.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary || !body || summaryWordsLeft < 0) return;
    setLoading(true);
    await createPost({ title, summary, body, communityId });
    setTitle("");
    setSummary("");
    setBody("");
    setLoading(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        p: 2,
        border: "1px solid #ddd",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Create New Post
      </Typography>

      <TextField
        label="Title"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE))}
        helperText={`${MAX_TITLE - title.length} characters left`}
      />

      <TextField
        label="Summary"
        fullWidth
        multiline
        rows={3}
        margin="normal"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        helperText={`${summaryWordsLeft} words left`}
        error={summaryWordsLeft < 0}
      />

      <TextField
        label="Body"
        fullWidth
        multiline
        rows={6}
        margin="normal"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={loading || !title || !summary || !body || summaryWordsLeft < 0}
      >
        {loading ? "Posting..." : "Create Post"}
      </Button>
    </Box>
  );
};

export default CreatePostForm;
