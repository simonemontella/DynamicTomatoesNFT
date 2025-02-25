import './App.css'
import { ThemeProvider as MUIThemeProvider, CssBaseline, Button } from '@mui/material';
import { Box, Typography, } from '@mui/material';
import { useAccount } from 'wagmi';
import { getTheme, useThemeMode, ThemeProvider } from './theme/Theme';
import { Layout } from './theme/Layout';
import { TomatoesBox } from './components/TomatoesBox';
import { plantTomato } from './chain/TomatoesManager';

const Home = () => {
  const { isConnected } = useAccount();

  return (
    <Box>
      <Box sx={{
        textAlign: 'center',
        mb: 6,
        background: 'linear-gradient(180deg, rgba(0, 255, 159, 0.1) 0%, rgba(0, 255, 159, 0) 100%)',
        py: 4,
        borderRadius: 2
      }}>
        <Typography variant="h1" sx={{ mb: 2 }}>
          Dynamic Tomatoes NFT
        </Typography>
        <Typography variant="h2" sx={{ mb: 3, color: 'text.secondary' }}>
          Grow your virtual tomato plants on the blockchain
        </Typography>
        {!isConnected && (
          <Typography variant="body1" color="text.secondary">
            Connect your wallet to start growing tomatoes
          </Typography>
        )}
      </Box>

      {isConnected && (
        <>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h3">Your Tomatoes</Typography>
            <Button variant="contained" color="primary" size="large"
              onClick={() => { plantTomato() }}>
              Plant New Tomato 🌱
            </Button>
          </Box>
          <TomatoesBox />
        </>
      )}
    </Box>
  );
};


const AppContent = () => {
  const { mode } = useThemeMode();
  const theme = getTheme(mode);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Home />
      </Layout>
    </MUIThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
