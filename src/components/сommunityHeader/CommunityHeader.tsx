// src/components/communityHeader/CommunityHeader.tsx
import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
} from "@mui/material";

type Props = {
  title: string;
  image: string;
  membersCount: number;
  isMember: boolean;
  onJoin: () => void;
  onLeave: () => void;
  actionLoading: boolean;
};

const CommunityHeader: React.FC<Props> = ({
  title,
  image,
  membersCount,
  isMember,
  onJoin,
  onLeave,
  actionLoading,
}) => {
  return (
    <Box
      sx={{
        px: 3,
        py: 2,
        mb: 3,
        borderBottom: "1px solid #ddd",
        bgcolor: "#f9f9ff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        maxWidth: '100%'
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar src={image} alt={title} sx={{ width: 48, height: 48 }} />
        <Box>
          <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
            {title}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
            sx={{ lineHeight: 1.2 }}
          >
            Members: {membersCount ?? 0}
          </Typography>
        </Box>
      </Box>

      {isMember ? (
        <Button
          variant="outlined"
          color="error"
          onClick={onLeave}
          disabled={actionLoading}
          size="small"
        >
          Leave
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={onJoin}
          disabled={actionLoading}
          size="small"
        >
          Join
        </Button>
      )}
    </Box>
  );
};

export default CommunityHeader;
