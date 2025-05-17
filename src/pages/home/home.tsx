import { Box } from "@mui/material";
import CreateCommunity from "../../components/сreateCommunity/CreateCommunity";
import ApprovedCommunitiesWidget from "../../components/approvedCommunities/ApprovedCommunities";

const Home = () => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      gap={4}
      px={4}
      py={2}
      flexWrap="wrap" // если экран маленький — компоненты перенесутся вниз
    >
      {/* Правая часть (виджет с сообществами) */}
      <Box
        flexShrink={0}
        width={{ xs: "100%", sm: "30%", md: 400 }}
        maxWidth={500}
      >
        <ApprovedCommunitiesWidget />
      </Box>

      {/* Левая часть (форма создания) */}
      <Box flex={1} minWidth={300}>
        <CreateCommunity />
      </Box>
    </Box>
  );
};

export default Home;
