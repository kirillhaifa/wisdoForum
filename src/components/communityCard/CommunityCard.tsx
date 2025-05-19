import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Community } from "../../store/approvedCommunitiesAtom";
import { Link } from "react-router-dom";
import { useCommunity } from "../../hooks/useCommunity";

type Props = {
  community: Community;
};

const CommunityCard: React.FC<Props> = ({ community }) => {
  const { leaveCommunity } = useCommunity();

  const handleLeave = async (e: React.MouseEvent) => {
    e.preventDefault(); // чтобы не сработал переход по ссылке
    await leaveCommunity(community.id);
    window.location.reload(); // можно заменить на обновление Recoil или refetch
  };

  return (
    <Card
      component={Link}
      to={`/community/${community.id}`}
      sx={{
        height: "100%",
        textDecoration: "none",
        color: "inherit",
        border: "1px solid #ddd",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "&:hover": {
          boxShadow: 4,
        },
      }}
    >
      <Box>
        {community.image && (
          <CardMedia
            component="img"
            height="140"
            image={community.image}
            alt={community.title}
          />
        )}
        <CardContent>
          <Typography variant="h6">{community.title}</Typography>
          <Box mt={1}>
            <Typography variant="body2" color="text.secondary">
              Members: {community.membersCount ?? 0}
            </Typography>
          </Box>
        </CardContent>
      </Box>

      <Box px={2} pb={2}>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={handleLeave}
        >
          Leave community
        </Button>
      </Box>
    </Card>
  );
};

export default CommunityCard;
