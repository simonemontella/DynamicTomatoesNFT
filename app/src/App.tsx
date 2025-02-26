import './App.css'
import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import { getTheme, useThemeMode, ThemeProvider } from './theme/Theme';
import { Layout } from './theme/Layout';
import { HomePage } from './pages/HomePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TomatoPage } from './pages/TomatoPage';

function InnerApp() {
  const { mode } = useThemeMode();
  const theme = getTheme(mode);

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
    <ThemeProvider>
      <InnerApp />
    </ThemeProvider>
  );
}

export default App;
