import React from "react";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { Post } from "../../types/post";
import { format } from "date-fns";

type PostCardProps = {
  post: Post;
  authorName?: string;
  communityTitle?: string;
};

const PostCard: React.FC<PostCardProps> = ({ post, authorName, communityTitle }) => {
  const formattedDate = format(post.createdAt.toDate(), "dd MMM yyyy");

  return (
    <Card variant="outlined" sx={{ maxWidth: 600, margin: "auto", mb: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
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

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography variant="caption">
            By <strong>{authorName ?? post.authorId}</strong> in{" "}
            <strong>{communityTitle ?? post.communityId}</strong>
          </Typography>
          <Typography variant="caption">
            ❤️ {post.likes} • {formattedDate}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostCard;
