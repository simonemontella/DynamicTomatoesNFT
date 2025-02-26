import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, } from '@mui/material';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { metaMaskConnector } from '../chain/ChainInteractions';
import { useThemeMode } from './Theme';

export const Navbar = () => {
  const { mode } = useThemeMode();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect: logout } = useDisconnect();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const disconnect = () => {
    logout();
    if (window.location.pathname !== '/') window.location.href = '/';
  }

  const connectButton = (
    <Button
      variant="contained"
      color="primary"
      onClick={() => connect({ connector: metaMaskConnector })}>
      Connect Wallet
    </Button>
  )

  const disconnectButton = (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
        {formatAddress(address || '')}
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => disconnect()}>
        Disconnect
      </Button>
    </Box>
  );

  const [weather, setWeather] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('https://wttr.in/Naples?format=%l,+%c+T:%t+H:%h');
        const result = await response.text();
        setWeather(result.startsWith('Unknown location') ? 'Weather data unavailable' : result);
      } catch (error) {
        setWeather('Error fetching weather data');
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <AppBar position="sticky" elevation={0} sx={{ backdropFilter: 'blur(20px)', pt: 2 }}>
      <Typography variant="h3">
        🍅 Dynamic Tomatoes
      </Typography>

      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body1" sx={{
          color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        }}>
          {weather ? `${weather}` : 'Loading weather...'}
        </Typography>

        {isConnected ? disconnectButton : connectButton}
      </Toolbar>
    </AppBar>
  );
};