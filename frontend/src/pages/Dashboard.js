import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  LinearProgress,
  Fade,
  Grow,
  IconButton,
} from '@mui/material';
import {
  TrendingUp,
  Speed,
  CompareArrows,
  Psychology,
  PlayArrow,
  Info,
  Star,
  GitHub,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: 'white',
  padding: theme.spacing(8, 0),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    animation: `${pulse} 4s ease-in-out infinite`,
  },
}));

const AlgorithmCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
    '& .algorithm-icon': {
      animation: `${float} 2s ease-in-out infinite`,
    },
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const StatsChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  fontWeight: 'bold',
  '& .MuiChip-icon': {
    color: theme.palette.primary.main,
  },
}));

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);

  const algorithms = [
    {
      name: 'XGBoost',
      description: 'Extreme Gradient Boosting with regularization',
      icon: '🚀',
      color: '#FF6B6B',
      features: ['L1/L2 Regularization', 'Parallel Processing', 'Tree Pruning'],
      performance: 92,
    },
    {
      name: 'LightGBM',
      description: 'Fast gradient boosting with leaf-wise growth',
      icon: '⚡',
      color: '#45B7D1',
      features: ['Histogram-based', 'GPU Support', 'Categorical Features'],
      performance: 95,
    },
    {
      name: 'CatBoost',
      description: 'Handles categorical features automatically',
      icon: '🐱',
      color: '#BB8FCE',
      features: ['Ordered Boosting', 'GPU Training', 'Symmetric Trees'],
      performance: 90,
    },
  ];

  const features = [
    {
      title: 'Algorithm Explorer',
      icon: <Psychology fontSize="large" />,
      description: 'Deep dive into gradient boosting algorithms',
      path: '/algorithm-explorer',
      color: 'primary',
    },
    {
      title: 'Visualization Playground',
      icon: <TrendingUp fontSize="large" />,
      description: 'Interactive visualizations of the boosting process',
      path: '/visualization',
      color: 'secondary',
    },
    {
      title: 'Hyperparameter Tuning',
      icon: <Speed fontSize="large" />,
      description: 'Optimize model performance with interactive tuning',
      path: '/hyperparameter-tuning',
      color: 'success',
    },
    {
      title: 'Algorithm Comparison',
      icon: <CompareArrows fontSize="large" />,
      description: 'Compare different algorithms side by side',
      path: '/comparison',
      color: 'warning',
    },
  ];

  return (
    <Box sx={{ width: '100%', mx: 0 }}>
      <Helmet>
        <title>Gradient Boosting Visualization - Learn XGBoost, LightGBM & CatBoost Interactively</title>
        <meta name="description" content="Master gradient boosting algorithms with our interactive visualization tool. Understand XGBoost, LightGBM, and CatBoost through hands-on experiments and real-time comparisons." />
        <meta name="keywords" content="gradient boosting, machine learning visualization, XGBoost tutorial, LightGBM guide, CatBoost learning, interactive ML education" />
        <link rel="canonical" href="https://gradient-boosting-visualizer.netlify.app/" />
      </Helmet>
      <HeroSection>
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Fade in timeout={1000}>
            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
              Gradient Boosting Visualizer
            </Typography>
          </Fade>
          <Fade in timeout={1500}>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              Master the art of ensemble learning through interactive visualizations
            </Typography>
          </Fade>
          <Fade in timeout={2000}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                onClick={() => navigate('/visualization')}
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                  },
                }}
              >
                Start Exploring
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Info />}
                onClick={() => navigate('/algorithm-explorer')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Learn More
              </Button>
            </Box>
          </Fade>
        </Box>
      </HeroSection>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Choose Your Algorithm
        </Typography>
        <Grid container spacing={3}>
          {algorithms.map((algo, index) => (
            <Grid item xs={12} md={4} key={algo.name}>
              <Grow in timeout={1000 + index * 200}>
                <AlgorithmCard
                  onClick={() => setSelectedAlgorithm(algo.name)}
                  sx={{
                    borderTop: `4px solid ${algo.color}`,
                    backgroundColor: selectedAlgorithm === algo.name ? 'action.selected' : 'background.paper',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography
                        variant="h3"
                        className="algorithm-icon"
                        sx={{ fontSize: '3rem' }}
                      >
                        {algo.icon}
                      </Typography>
                      <IconButton size="small">
                        <Star sx={{ color: selectedAlgorithm === algo.name ? 'warning.main' : 'action.disabled' }} />
                      </IconButton>
                    </Box>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      {algo.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {algo.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {algo.features.map((feature) => (
                        <Chip
                          key={feature}
                          label={feature}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Performance</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {algo.performance}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={algo.performance}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'action.hover',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: algo.color,
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </AlgorithmCard>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Explore Features
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Grow in timeout={1500 + index * 100}>
                <FeatureCard onClick={() => navigate(feature.path)}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        backgroundColor: `${feature.color}.light`,
                        color: `${feature.color}.main`,
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Built with React, Material-UI, and D3.js
        </Typography>
        <Box sx={{ mt: 2 }}>
          <StatsChip icon={<Star />} label="Open Source" sx={{ mr: 1 }} />
          <StatsChip icon={<GitHub />} label="View on GitHub" />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
