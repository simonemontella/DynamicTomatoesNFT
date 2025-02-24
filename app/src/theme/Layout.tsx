import { Box, Container, IconButton, Typography } from '@mui/material';
import { Navbar } from './Navbar';
import { ReactNode } from 'react';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeMode } from './Theme';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'background.default',
      backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(0, 255, 159, 0.1), transparent 50%)',
    }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, mb: 5 }}>
        <IconButton onClick={toggleTheme} color="inherit">
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          Simone Montella (M63001566)
        </Typography>
      </Box>
    </Box>
  );
};