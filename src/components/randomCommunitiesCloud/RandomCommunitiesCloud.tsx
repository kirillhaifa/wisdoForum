import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

type Community = {
  id: string;
  title: string;
  image?: string;
};

interface Props {
  communities: Community[];
}

const RandomCommunitiesCloud: React.FC<Props> = ({ communities }) => {
  const navigate = useNavigate();

  const randomized = useMemo(() => {
    const shuffled = [...communities]
      .sort(() => 0.5 - Math.random())
      .slice(0, 20);
    return shuffled.map((c) => ({
      ...c,
      width: Math.floor(Math.random() * 2 + 1) * 100, // 100 or 200px
      height: Math.floor(Math.random() * 2 + 1) * 100,
    }));
  }, [communities]);

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        borderRadius: 2,
        overflow: "hidden",
        background: "#f0f4f8",
        minHeight: 400,
      }}
    >
      {randomized.map((comm) => (
        <Box
          key={comm.id}
          onClick={() => navigate(`/community/${comm.id}`)}
          sx={{
            width: comm.width,
            height: comm.height,
            backgroundImage: `url(${comm.image || "/fallback.jpg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 2,
            cursor: "pointer",
            position: "relative",
            transition: "transform 0.3s ease",
            overflow: "hidden",
            "&:hover": {
              transform: "scale(1.05)",
              zIndex: 2,
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "#fff",
              px: 1,
              py: 0.5,
              textAlign: "center",
              fontSize: "0.9rem",
              fontWeight: 500,
              backdropFilter: "blur(2px)",
            }}
          >
            {comm.title}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default RandomCommunitiesCloud;
