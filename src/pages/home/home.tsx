import { Box, Typography } from "@mui/material";
import ApprovedCommunitiesWidget from "../../components/approvedCommunities/ApprovedCommunities";
import HomeIntroSection from "../../components/homeIntroSection.tsx/HomeIntroSection";
import { useRecoilValue } from "recoil";
import { communitiesAtom } from "../../store/communitiesAtom";
import RandomCommunitiesCloud from "../../components/randomCommunitiesCloud/RandomCommunitiesCloud";
import CreateCommunity from "../../components/сreateCommunity/CreateCommunity";

const Home = () => {
  const communities = useRecoilValue(communitiesAtom);
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      gap={{ xs: 2, md: 4 }}
      px={{ xs: 1, sm: 2, md: 4 }}
      py={2}
      flexWrap="wrap"
      sx={{
        flexDirection: { xs: "column", md: "row" },
        maxWidth: "100vw",
        overflowX: "hidden"
      }}
    >
      <Box
        flexShrink={0}
        width={{ xs: "100%", sm: "30%", md: 400 }}
        maxWidth={500}
        sx={{ display: { xs: "none", md: "block" } }}
      >
        <ApprovedCommunitiesWidget />
      </Box>

      <Box
        flex={1}
        minWidth={{ xs: "100%", md: 300 }}
        sx={{ 
          border: "1px solid #ddd", 
          borderRadius: 2,
          width: { xs: "100%", md: "auto" },
          maxWidth: "100%"
        }}
      >

        <HomeIntroSection />
        <Typography variant="h6" gutterBottom sx={{textAlign: 'center', width: '100%', padding: '10px'}}>
          Find your mindmates
        </Typography>
        <RandomCommunitiesCloud communities={communities} />

        <CreateCommunity />
      </Box>
    </Box>
  );
};

export default Home;
