import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";
import { Post } from "../../types/post";
import { format } from "date-fns";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../store/userAtom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firbase";

type PostCardProps = {
  post: Post;
  authorName?: string; // можно оставить на случай передачи извне
  communityTitle?: string;
};

const PostCard: React.FC<PostCardProps> = ({
  post,
  authorName,
  communityTitle,
}) => {
  const [resolvedAuthorName, setResolvedAuthorName] = useState<string | null>(
    authorName ?? null
  );
  const formattedDate =
    post.createdAt && typeof post.createdAt.toDate === "function"
      ? format(post.createdAt.toDate(), "dd MMM yyyy HH:mm")
      : "Loading...";

  const user = useRecoilValue(userAtom);
  const isAdminOrMod = user?.role === "admin" || user?.role === "moderator";

  useEffect(() => {
    const fetchAuthorName = async () => {
      const ref = doc(db, "users", post.authorId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setResolvedAuthorName(data.name ?? post.authorId);
      }
    };

    fetchAuthorName();
  }, [post.authorId, resolvedAuthorName]);

  const handleApprove = async () => {
    const ref = doc(db, "posts", post.id);
    await updateDoc(ref, { approved: true });
  };

  const handleDelete = async () => {
    const ref = doc(db, "posts", post.id);
    await deleteDoc(ref);
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 600, margin: "auto", mb: 3 }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="h6" fontWeight={600}>
            {post.title}
          </Typography>
          {!post.approved && (
            <Chip label={"Pending"} color={"warning"} size="small" />
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" mb={1}>
          {post.summary}
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Typography variant="caption">
            By <strong>{resolvedAuthorName}</strong> in{" "}
            <strong>{communityTitle ?? post.communityId}</strong>
          </Typography>
          <Typography variant="caption">
            ❤️ {post.likes} • {formattedDate}
          </Typography>
        </Box>

        {(isAdminOrMod || user?.uid === post.authorId) && (
          <Box mt={2} display="flex" gap={2}>
            {!post.approved && isAdminOrMod && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={handleApprove}
                >
                  Approve
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  size="small"
                  onClick={handleDelete}
                >
                  Reject
                </Button>
              </>
            )}
            {post.approved && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
