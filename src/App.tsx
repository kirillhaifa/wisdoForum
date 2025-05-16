import { Typography, Box } from "@mui/material";
import Header from "./components/Header";
import "./styles/normalize.css";

const App = () => {
  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap={2}
    >
      <Header />
      <Typography variant="h3">Wisdo.Forum</Typography>
    </Box>
  );
};

export default App;
