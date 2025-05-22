import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Button,
  Avatar,
  Box,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import GitHubIcon from '@mui/icons-material/GitHub';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { toggleSidebar, toggleDarkMode } from '../slices/uiSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector(state => state.ui.darkMode);
  
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={() => dispatch(toggleSidebar())}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Gradient Boosting Visualization
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Toggle Dark/Light Mode">
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={() => dispatch(toggleDarkMode())}
                  color="default"
                />
              }
              label={darkMode ? <DarkModeIcon /> : <LightModeIcon />}
              labelPlacement="start"
            />
          </Tooltip>
          
          <Tooltip title="Documentation">
            <IconButton color="inherit" href="/documentation">
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="GitHub Repository">
            <IconButton color="inherit" href="https://github.com/yourusername/gradient-boost-visualization" target="_blank" rel="noopener noreferrer">
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
