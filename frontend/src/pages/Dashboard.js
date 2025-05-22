import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Paper,
  Divider
} from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import TuneIcon from '@mui/icons-material/Tune';
import CompareIcon from '@mui/icons-material/Compare';
import BookIcon from '@mui/icons-material/Book';

const Dashboard = () => {
  const navigate = useNavigate();

  // Feature cards for the dashboard
  const features = [
    {
      title: 'Algorithm Explorer',
      description: 'Learn about XGBoost, LightGBM, and CatBoost algorithms through interactive explanations and visualizations.',
      icon: <ExploreIcon sx={{ fontSize: 40 }} />,
      path: '/algorithms',
      color: '#3f51b5'
    },
    {
      title: 'Visualization Playground',
      description: 'See gradient boosting in action with interactive visualizations of the training process and decision trees.',
      icon: <BookIcon sx={{ fontSize: 40 }} />,
      path: '/visualization',
      color: '#4caf50'
    },
    {
      title: 'Hyperparameter Tuning',
      description: 'Experiment with different hyperparameters and see how they affect model performance in real-time.',
      icon: <TuneIcon sx={{ fontSize: 40 }} />,
      path: '/hyperparameters',
      color: '#ff9800'
    },
    {
      title: 'Algorithm Comparison',
      description: 'Compare the performance and behavior of different gradient boosting implementations side by side.',
      icon: <CompareIcon sx={{ fontSize: 40 }} />,
      path: '/comparison',
      color: '#f44336'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
          color: 'white'
        }}
      >
        <Typography variant="h3" gutterBottom>
          Gradient Boosting Visualization
        </Typography>
        <Typography variant="h6" paragraph>
          An interactive application for understanding and visualizing gradient boosting algorithms
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          size="large"
          onClick={() => navigate('/algorithms')}
          sx={{ mr: 2 }}
        >
          Explore Algorithms
        </Button>
        <Button 
          variant="outlined" 
          color="inherit" 
          size="large"
          onClick={() => navigate('/documentation')}
        >
          Documentation
        </Button>
      </Paper>

      {/* Features Grid */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Explore the Application
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {features.map((feature) => (
          <Grid item xs={12} md={6} key={feature.title}>
            <Card 
              className="card-hover"
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardActionArea onClick={() => navigate(feature.path)} sx={{ flexGrow: 1 }}>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: feature.color,
                      color: 'white',
                      mb: 2
                    }}
                  >
                    {feature.icon}
                  </Box>
                </Box>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" align="center">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {feature.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Algorithm Overview */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Gradient Boosting Algorithms
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card className="algorithm-card">
            <CardMedia
              component="img"
              height="140"
              image="https://via.placeholder.com/600x140?text=XGBoost"
              alt="XGBoost"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                XGBoost
              </Typography>
              <Typography variant="body2" color="text.secondary">
                XGBoost (eXtreme Gradient Boosting) is known for its speed and performance. It uses second-order gradients and has built-in regularization to prevent overfitting.
              </Typography>
              <Button 
                sx={{ mt: 2 }}
                size="small" 
                onClick={() => navigate('/algorithms?algorithm=xgboost')}
              >
                Learn more
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card className="algorithm-card">
            <CardMedia
              component="img"
              height="140"
              image="https://via.placeholder.com/600x140?text=LightGBM"
              alt="LightGBM"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                LightGBM
              </Typography>
              <Typography variant="body2" color="text.secondary">
                LightGBM is designed for distributed and efficient training with large datasets. It uses histogram-based algorithms and grows trees leaf-wise rather than level-wise.
              </Typography>
              <Button 
                sx={{ mt: 2 }}
                size="small" 
                onClick={() => navigate('/algorithms?algorithm=lightgbm')}
              >
                Learn more
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card className="algorithm-card">
            <CardMedia
              component="img"
              height="140"
              image="https://via.placeholder.com/600x140?text=CatBoost"
              alt="CatBoost"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                CatBoost
              </Typography>
              <Typography variant="body2" color="text.secondary">
                CatBoost is designed to handle categorical features automatically. It uses ordered boosting and innovative methods to handle categorical variables without preprocessing.
              </Typography>
              <Button 
                sx={{ mt: 2 }}
                size="small" 
                onClick={() => navigate('/algorithms?algorithm=catboost')}
              >
                Learn more
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
