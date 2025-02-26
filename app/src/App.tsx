import './App.css'
import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import { getTheme, useThemeMode, ThemeProvider } from './theme/Theme';
import { Layout } from './theme/Layout';
import { Home } from './pages/Home';

function InnerApp() {
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
}

function App() {
  return (
    <ThemeProvider>
      <InnerApp />
    </ThemeProvider>
  );
}

export default App;
