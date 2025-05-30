import React, { useMemo, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import usePageView from './hooks/usePageView';
import { initGA } from './services/analytics';

// Layout components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Page components
import Dashboard from './pages/Dashboard';
import AlgorithmExplorer from './pages/AlgorithmExplorer';
import VisualizationPlayground from './pages/VisualizationPlayground';
import HyperparameterTuning from './pages/HyperparameterTuning';
import ComparisonPage from './pages/ComparisonPage';
import Documentation from './pages/Documentation';
import About from './pages/About'; // Added import statement for About component

function App() {
  usePageView();
  const darkMode = useSelector((state) => state.ui.darkMode);
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

  // Initialize Google Analytics
  useEffect(() => {
    initGA();
  }, []);

  // Memoize theme to avoid recreation on every render
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: { main: '#3f51b5' },
          secondary: { main: '#f50057' },
          background: {
            default: darkMode ? '#303030' : '#f5f5f5',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontSize: '2.5rem', fontWeight: 500 },
          h2: { fontSize: '2rem', fontWeight: 500 },
          h3: { fontSize: '1.8rem', fontWeight: 500 },
          h4: { fontSize: '1.5rem', fontWeight: 500 },
          h5: { fontSize: '1.2rem', fontWeight: 500 },
          h6: { fontSize: '1rem', fontWeight: 500 },
        },
      }),
    [darkMode]
  );

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
          <Navbar />
          <Sidebar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 1.5, sm: 2 },
              mt: '64px',
              transition: 'padding 0.3s ease',
              width: '100%',
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/algorithms" element={<AlgorithmExplorer />} />
              <Route path="/visualization" element={<VisualizationPlayground />} />
              <Route path="/hyperparameters" element={<HyperparameterTuning />} />
              <Route path="/comparison" element={<ComparisonPage />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
