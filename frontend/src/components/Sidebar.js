import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ComputerIcon from '@mui/icons-material/Computer';
import BarChartIcon from '@mui/icons-material/BarChart';
import TuneIcon from '@mui/icons-material/Tune';
import CompareIcon from '@mui/icons-material/Compare';
import MenuBookIcon from '@mui/icons-material/MenuBook';

// Constants
const DRAWER_WIDTH = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarOpen = useSelector(state => state.ui.sidebarOpen);
  
  // Navigation items
  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Algorithm Explorer', icon: <ComputerIcon />, path: '/algorithms' },
    { text: 'Visualization', icon: <BarChartIcon />, path: '/visualization' },
    { text: 'Hyperparameter Tuning', icon: <TuneIcon />, path: '/hyperparameters' },
    { text: 'Algorithm Comparison', icon: <CompareIcon />, path: '/comparison' },
    { text: 'Documentation', icon: <MenuBookIcon />, path: '/documentation' }
  ];
  
  // Is the current path active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <Drawer
      variant="persistent"
      open={sidebarOpen}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar /> {/* Spacer to match AppBar height */}
      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                selected={isActive(item.path)}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <List>
          <ListItem sx={{ pl: 2 }}>
            <ListItemText 
              primary="Algorithm Resources" 
              primaryTypographyProps={{ fontWeight: 'bold' }} 
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="https://xgboost.readthedocs.io/" target="_blank">
              <ListItemText primary="XGBoost Docs" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="https://lightgbm.readthedocs.io/" target="_blank">
              <ListItemText primary="LightGBM Docs" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="https://catboost.ai/docs/" target="_blank">
              <ListItemText primary="CatBoost Docs" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
