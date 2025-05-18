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
import ApprovedCommunitiesWidget from "../../components/approvedCommunities/ApprovedCommunities";
import CommunityHeader from "../../components/сommunityHeader/CommunityHeader";
import SignInPrompt from "../../components/signInPrompt/SignInPrompt";

const CommunityPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getCommunityById, joinCommunity, leaveCommunity } = useCommunity();
  const user = useRecoilValue(userAtom);

  const { getPostsByCommunityId, subscribeToPostsByCommunityId } = usePost();

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
    if (!id) return;

    const unsubscribe = subscribeToPostsByCommunityId(id, (newPosts) => {
      setPosts(newPosts);
      setPostCursor(null); // реалтайм-подписка не поддерживает пагинацию
      setPostLoading(false);
    });

    return () => unsubscribe(); // очистка подписки
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
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "space-between",
        gap: 7,
      }}
    >
      {/* Левая колонка — виджет */}
      <Box sx={{ flexShrink: 0 }}>
        <ApprovedCommunitiesWidget />
      </Box>

      {/* Правая колонка — посты и форма */}
      <Box sx={{ width: "100%" }}>
        {" "}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <CommunityHeader
            title={community.title}
            image={community.image}
            membersCount={community.membersCount}
            isMember={isMember}
            onJoin={handleJoin}
            onLeave={handleLeave}
            actionLoading={actionLoading}
          />
          <Box sx={{ marginTop: "20px" }}>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                authorName={post.authorId}
                communityTitle={community.title}
              />
            ))}
          </Box>

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

          {!user ? (
            <SignInPrompt />
          ) : !isMember ? (
            <SignInPrompt onJoin={handleJoin} joinDisabled={actionLoading} />
          ) : (
            <CreatePostForm communityId={id!} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CommunityPage;
