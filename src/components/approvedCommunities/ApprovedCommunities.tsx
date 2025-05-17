import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useCommunity } from "../../hooks/useCommunity";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { Link } from "react-router-dom";

const ApprovedCommunitiesWidget = () => {
  const { getApprovedCommunities } = useCommunity();
  const [communities, setCommunities] = useState<any[]>([]);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    try {
      const { communities: newItems, nextCursor } = await getApprovedCommunities(lastDoc);
      setCommunities((prev) => [...prev, ...newItems]);
      setLastDoc(nextCursor);
      if (!nextCursor) setIsEnd(true);
    } catch (err) {
      console.error("Error loading communities:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 300,
        flexBasis: "10%",
        p: 2,
        border: "1px solid #ddd",
        borderRadius: 2,
        bgcolor: "#fff",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Communities
      </Typography>

      <List dense>
        {communities.map((c) => (
          <React.Fragment key={c.id}>
            <ListItem
              disableGutters
              component={Link}
              to={`/community/${c.id}`}
              sx={{
                textDecoration: "none",
                color: "inherit",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  src={c.image}
                  alt={c.title}
                  sx={{ width: 40, height: 40 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={c.title}
                secondary={`Members: ${c.membersCount ?? 0}`}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>

      {!isEnd && (
        <Box textAlign="center" mt={2}>
          <Button variant="text" onClick={loadMore} disabled={loading} size="small">
            {loading ? <CircularProgress size={18} /> : "Load more"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ApprovedCommunitiesWidget;
    