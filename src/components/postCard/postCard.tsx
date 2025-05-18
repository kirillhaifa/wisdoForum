import React from "react";
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
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firbase";
import { deleteDoc } from "firebase/firestore";

type PostCardProps = {
  post: Post;
  authorName?: string;
  communityTitle?: string;
};

const PostCard: React.FC<PostCardProps> = ({
  post,
  authorName,
  communityTitle,
}) => {
  const formattedDate =
    post.createdAt && typeof post.createdAt.toDate === "function"
      ? format(post.createdAt.toDate(), "dd MMM yyyy HH:mm")
      : "Loading...";

  const user = useRecoilValue(userAtom);
  const isAdminOrMod = user?.role === "admin" || user?.role === "moderator";

  const handleApprove = async () => {
    const ref = doc(db, "posts", post.id);
    await updateDoc(ref, { approved: true });
  };

  const handleReject = async () => {
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
          <Chip
            label={post.approved ? "Approved" : "Pending"}
            color={post.approved ? "success" : "warning"}
            size="small"
          />
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
            By <strong>{authorName ?? post.authorId}</strong> in{" "}
            <strong>{communityTitle ?? post.communityId}</strong>
          </Typography>
          <Typography variant="caption">
            ❤️ {post.likes} • {formattedDate}
          </Typography>
        </Box>

        {!post.approved && isAdminOrMod && (
          <Box mt={2} display="flex" gap={2}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={handleApprove}
              disabled={post.approved}
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleReject}
              disabled={post.approved}
            >
              Reject
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
