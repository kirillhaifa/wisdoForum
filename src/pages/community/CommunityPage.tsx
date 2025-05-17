import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useCommunity } from "../../hooks/useCommunity";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Button,
  Container,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../store/userAtom";
import CreatePostForm from "../../components/createPostForm/createPostForm";
import { usePost } from "../../hooks/usePost";
import { Post } from "../../types/post";
import PostCard from "../../components/postCard/postCard";

const CommunityPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getCommunityById, joinCommunity, leaveCommunity } = useCommunity();
  const user = useRecoilValue(userAtom);

  const { getPostsByCommunityId } = usePost();

  const [posts, setPosts] = useState<Post[]>([]);
  const [postCursor, setPostCursor] = useState<any>(null);
  const [postLoading, setPostLoading] = useState(true);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [community, setCommunity] = useState<any>(null);

  const isMember = useMemo(() => {
    return !!user?.communities?.includes(id || "");
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

  const loadPosts = async () => {
    if (!id) return;
    setPostLoading(true);
    try {
      const { posts: newPosts, nextCursor } = await getPostsByCommunityId(
        id,
        postCursor
      );
      setPosts((prev) => [...prev, ...newPosts]);
      setPostCursor(nextCursor);
    } catch (err) {
      console.error("❌ Failed to load posts:", err);
    }
    setPostLoading(false);
  };

  useEffect(() => {
    setPosts([]);
    setPostCursor(null);
    loadPosts();
  }, [id, user]);

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
    <>
      {/* Заголовок на всю ширину */}
      <Box
        sx={{
          px: 3,
          py: 2, // 🔽 Было 4, стало 2 — меньше высота
          borderBottom: "1px solid #ddd",
          bgcolor: "#f9f9ff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center", // 🔄 Добавлено для выравнивания по вертикали
          gap: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={community.image}
            alt={community.title}
            sx={{ width: 48, height: 48 }} // 🔽 Было 60, стало 48
          />
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
              {community.title}
            </Typography>
            <Typography
              color="text.secondary"
              variant="body2"
              sx={{ lineHeight: 1.2 }}
            >
              Members: {community.membersCount ?? 0}
            </Typography>
          </Box>
        </Box>

        {isMember ? (
          <Button
            variant="outlined"
            color="error"
            onClick={handleLeave}
            disabled={actionLoading}
            size="small" // 🔽 Сделать кнопку меньше
          >
            Leave
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleJoin}
            disabled={actionLoading}
            size="small" // 🔽 Сделать кнопку меньше
          >
            Join
          </Button>
        )}
      </Box>

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          authorName={post.authorId}
          communityTitle={community.title}
        />
      ))}

      {postLoading && (
        <Box mt={2} display="flex" justifyContent="center">
          <CircularProgress size={20} />
        </Box>
      )}

      {!postLoading && postCursor && (
        <Box textAlign="center" mt={2}>
          <Button onClick={loadPosts}>Load more</Button>
        </Box>
      )}

      {/* Контент */}
      <Container maxWidth="md">
        {isMember && <CreatePostForm communityId={id!} />}
      </Container>
    </>
  );
};

export default CommunityPage;
