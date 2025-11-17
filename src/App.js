import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, useMediaQuery, Typography } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ListAltIcon from '@mui/icons-material/ListAlt';

// Import our task management tool
import TaskList from './tools/TaskList/TaskList';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : prefersDarkMode;
  });

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Create theme based on dark mode preference
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });

  // Simple toggle for dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Simple header with app title and dark mode toggle */}
        <Box 
          sx={{
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ListAltIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
              Task Management
            </Typography>
          </Box>
          <Box 
            onClick={toggleDarkMode}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              p: 0.5,
              borderRadius: 1,
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            {darkMode ? (
              <DarkModeIcon fontSize="small" sx={{ mr: 1 }} />
            ) : (
              <LightModeIcon fontSize="small" sx={{ mr: 1 }} /> 
            )}
            <Typography variant="body2">
              {darkMode ? 'Dark Mode' : 'Light Mode'}
            </Typography>
          </Box>
        </Box>

        {/* Main content - TaskList takes full screen */}
        <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 3 }, overflow: 'auto' }}>
          <TaskList />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
