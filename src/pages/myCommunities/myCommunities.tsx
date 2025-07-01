import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Grid, Container } from "@mui/material";
import { useCommunity } from "../../hooks/useCommunity";
import { Community } from "../../store/approvedCommunitiesAtom";
import CommunityCard from "../../components/communityCard/CommunityCard";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../store/userAtom";


const MyCommunitiesPage: React.FC = () => {
  const user = useRecoilValue(userAtom);
  const { getUserCommunities } = useCommunity();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCommunities = async () => {
      try {
        // Only try to load communities if user is authenticated
        if (user) {
          const data = await getUserCommunities();
          setCommunities(data);
        }
      } catch (error) {
        console.error('Error loading communities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCommunities();
  }, [getUserCommunities, user]);

  // Show loading while checking authentication
  if (!user) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Communities
        </Typography>
        <Typography>Please log in to view your communities.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Communities
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : communities.length === 0 ? (
        <Typography>No communities joined yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {communities.map((community) => (
            <Grid item xs={12} sm={6} md={4} key={community.id}>
              <CommunityCard community={community} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyCommunitiesPage;
