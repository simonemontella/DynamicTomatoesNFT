import './App.css'
import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import { getTheme, useThemeMode, ThemeProvider } from './theme/Theme';
import { SnackbarProvider } from 'notistack';
import { Layout } from './theme/Layout';
import { HomePage } from './pages/HomePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TomatoPage } from './pages/TomatoPage';
import { subscribeToTomatoEvents } from './chain/EventsManager';

function InnerApp() {
  const { mode } = useThemeMode();
  const theme = getTheme(mode);
  subscribeToTomatoEvents();

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tomato" element={<TomatoPage />} />
          </Routes>
        </BrowserRouter>
      </Layout>
    </MUIThemeProvider>
  );
}

function App() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      dense
      autoHideDuration={4000}
    >
      <ThemeProvider>
        <InnerApp />
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;
