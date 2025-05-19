import { Box, Typography } from "@mui/material";
import CreateCommunity from "../../components/сreateCommunity/CreateCommunity";
import ApprovedCommunitiesWidget from "../../components/approvedCommunities/ApprovedCommunities";
import HomeIntroSection from "../../components/homeIntroSection.tsx/HomeIntroSection";
import { useRecoilValue } from "recoil";
import { communitiesAtom } from "../../store/communitiesAtom";
import RandomCommunitiesCloud from "../../components/randomCommunitiesCloud/RandomCommunitiesCloud";

const Home = () => {
  const communities = useRecoilValue(communitiesAtom);
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

      {/* Левая часть */}
      <Box
        flex={1}
        minWidth={300}
        sx={{ border: "1px solid #ddd", borderRadius: 2 }}
      >

        {/* Вставка блока-интро */}
        <HomeIntroSection />
        <Typography variant="h6" gutterBottom sx={{textAlign: 'center', width: '100%', padding: '10px'}}>
          Find your mindmates
        </Typography>
        <RandomCommunitiesCloud communities={communities} />

        {/* Форма создания сообщества */}
        <CreateCommunity />
      </Box>
    </Box>
  );
};

export default Home;
