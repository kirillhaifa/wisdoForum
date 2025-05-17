import { Box } from "@mui/material";
import CreateCommunity from "../../components/сreateCommunity/CreateCommunity";
import ApprovedCommunitiesWidget from "../../components/approvedCommunities/ApprovedCommunities";

const Home = () => {
  return (
    <>
      <Box>
        <Box flexGrow={1}> {/* Main content */}</Box>
        <ApprovedCommunitiesWidget />
      </Box>
      <CreateCommunity />
    </>
  );
};

export default Home;
