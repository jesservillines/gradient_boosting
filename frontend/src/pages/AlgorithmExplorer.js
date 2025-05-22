import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import HistoryIcon from '@mui/icons-material/History';
import BuildIcon from '@mui/icons-material/Build';
import SpeedIcon from '@mui/icons-material/Speed';
import CategoryIcon from '@mui/icons-material/Category';
import MemoryIcon from '@mui/icons-material/Memory';
import SchemaIcon from '@mui/icons-material/Schema';
import TuneIcon from '@mui/icons-material/Tune';

import XGBoostMathFormula from '../components/visualizations/XGBoostMathFormula';
import LightGBMMathFormula from '../components/visualizations/LightGBMMathFormula';
import CatBoostMathFormula from '../components/visualizations/CatBoostMathFormula';

// Algorithm information object
const algorithmInfo = {
  xgboost: {
    name: 'XGBoost',
    fullName: 'eXtreme Gradient Boosting',
    color: '#3f51b5',
    year: '2014-2016',
    creator: 'Tianqi Chen',
    paper: 'XGBoost: A Scalable Tree Boosting System',
    paperLink: 'https://arxiv.org/abs/1603.02754',
    description: `
      XGBoost is an optimized and highly efficient implementation of gradient boosting designed for speed and performance.
      It uses a formalized regularization technique to control model complexity, which significantly improves model generalization.
      XGBoost is known for its use of second-order gradients and system optimizations that make it much faster than traditional implementations.
    `,
    keyFeatures: [
      {
        title: 'Regularized Objective',
        description: 'Includes both L1 and L2 regularization terms to prevent overfitting.'
      },
      {
        title: 'Second-Order Approximation',
        description: 'Uses both first and second derivatives of the loss function for more accurate updates.'
      },
      {
        title: 'Sparsity Awareness',
        description: 'Can handle missing values and sparse data efficiently by learning default directions.'
      },
      {
        title: 'System Optimizations',
        description: 'Cache-aware access, blocks for out-of-core computation, and parallelization.'
      }
    ],
    strengths: [
      'High performance and accuracy on structured data',
      'Handles missing values naturally',
      'Good regularization options to prevent overfitting',
      'Efficient memory usage for large datasets',
      'Excellent for competitions and general tabular data tasks'
    ],
    limitations: [
      'Not specialized for categorical features, requires preprocessing',
      'Can be slower than LightGBM on very large datasets',
      'Many hyperparameters to tune'
    ],
    hyperparameters: [
      {
        name: 'learning_rate (eta)',
        description: 'Step size shrinkage used to prevent overfitting. Range: [0,1]',
        typical: '0.01-0.3'
      },
      {
        name: 'max_depth',
        description: 'Maximum depth of a tree. Higher value causes more complex model.',
        typical: '3-10'
      },
      {
        name: 'subsample',
        description: 'Fraction of samples used for fitting the trees. Range: (0,1]',
        typical: '0.8-1.0'
      },
      {
        name: 'colsample_bytree',
        description: 'Fraction of features used for fitting each tree. Range: (0,1]',
        typical: '0.8-1.0'
      },
      {
        name: 'alpha',
        description: 'L1 regularization term on weights (lasso).',
        typical: '0-1'
      },
      {
        name: 'lambda',
        description: 'L2 regularization term on weights (ridge).',
        typical: '1'
      },
      {
        name: 'gamma',
        description: 'Minimum loss reduction required to make a further partition.',
        typical: '0-0.5'
      }
    ]
  },
  lightgbm: {
    name: 'LightGBM',
    fullName: 'Light Gradient Boosting Machine',
    color: '#4caf50',
    year: '2017',
    creator: 'Microsoft Research',
    paper: 'LightGBM: A Highly Efficient Gradient Boosting Decision Tree',
    paperLink: 'https://papers.nips.cc/paper/6907-lightgbm-a-highly-efficient-gradient-boosting-decision-tree',
    description: `
      LightGBM was developed by Microsoft Research to address the efficiency limitations in existing gradient boosting implementations.
      It introduces several innovative techniques including histogram-based algorithms, leaf-wise tree growth, and feature bundling.
      These optimizations make it significantly faster than other implementations, especially for large datasets, while maintaining high accuracy.
    `,
    keyFeatures: [
      {
        title: 'Histogram-based Splitting',
        description: 'Bins continuous features into discrete bins to speed up training dramatically.'
      },
      {
        title: 'Leaf-wise Tree Growth',
        description: 'Grows trees by choosing the leaf with max delta loss, rather than level-wise growth.'
      },
      {
        title: 'GOSS (Gradient-based One-Side Sampling)',
        description: 'Focuses on samples with larger gradients and downsamples those with small gradients.'
      },
      {
        title: 'EFB (Exclusive Feature Bundling)',
        description: 'Bundles mutually exclusive features to reduce feature dimensions.'
      }
    ],
    strengths: [
      'Much faster training than XGBoost, especially on large datasets',
      'Better handling of high-dimensional sparse data',
      'Lower memory usage',
      'Native categorical feature support',
      'Excellent scaling for distributed environments'
    ],
    limitations: [
      'More prone to overfitting if not carefully tuned',
      'Leaf-wise growth can create unbalanced trees',
      'Categorical handling not as sophisticated as CatBoost',
      'Can be less stable than XGBoost on small datasets'
    ],
    hyperparameters: [
      {
        name: 'learning_rate',
        description: 'Shrinkage rate to prevent overfitting. Range: [0,1]',
        typical: '0.01-0.3'
      },
      {
        name: 'num_leaves',
        description: 'Maximum number of leaves in one tree. Controls model complexity.',
        typical: '31-255'
      },
      {
        name: 'max_depth',
        description: 'Maximum tree depth. -1 means no limit.',
        typical: '-1'
      },
      {
        name: 'min_data_in_leaf',
        description: 'Minimum number of data in one leaf. Helps prevent overfitting.',
        typical: '20-50'
      },
      {
        name: 'feature_fraction',
        description: 'Fraction of features to use in each iteration. Range: (0,1]',
        typical: '0.8-1.0'
      },
      {
        name: 'bagging_fraction',
        description: 'Fraction of data to use for each iteration. Range: (0,1]',
        typical: '0.8-1.0'
      },
      {
        name: 'lambda_l1',
        description: 'L1 regularization.',
        typical: '0-0.1'
      },
      {
        name: 'lambda_l2',
        description: 'L2 regularization.',
        typical: '0-0.1'
      }
    ]
  },
  catboost: {
    name: 'CatBoost',
    fullName: 'Categorical Boosting',
    color: '#ff9800',
    year: '2017-2018',
    creator: 'Yandex Research',
    paper: 'CatBoost: unbiased boosting with categorical features',
    paperLink: 'https://arxiv.org/abs/1706.09516',
    description: `
      CatBoost is a gradient boosting library developed by Yandex specifically designed to handle categorical features effectively.
      It implements ordered boosting and a permutation-driven alternative to traditional gradient boosting to fight prediction shift.
      The name "CatBoost" comes from "Category" and "Boosting", highlighting its strength in handling categorical features without extensive preprocessing.
    `,
    keyFeatures: [
      {
        title: 'Ordered Boosting',
        description: 'Uses a permutation-driven approach to avoid target leakage and prediction shift.'
      },
      {
        title: 'Categorical Feature Processing',
        description: 'Automatically handles categorical features using ordered target statistics.'
      },
      {
        title: 'Symmetric Trees',
        description: 'Uses oblivious decision trees with balanced splits on the same feature for robustness.'
      },
      {
        title: 'GPU Acceleration',
        description: 'Highly optimized for training on GPU hardware, especially useful for large datasets.'
      }
    ],
    strengths: [
      'Best-in-class handling of categorical features without preprocessing',
      'More robust to overfitting and noisy data',
      'Excellent performance out-of-the-box with minimal tuning',
      'Fast inference speed due to symmetric trees',
      'Prevention of target leakage in training process'
    ],
    limitations: [
      'Can be slower to train than LightGBM on CPU',
      'More memory usage due to ordered boosting',
      'Symmetric trees might be less flexible for some datasets',
      'Relatively newer with fewer community extensions'
    ],
    hyperparameters: [
      {
        name: 'learning_rate',
        description: 'Step size for gradient descent. Range: [0,1]',
        typical: '0.03-0.3'
      },
      {
        name: 'depth',
        description: 'Depth of trees. Deeper trees can model more complex relationships.',
        typical: '6-10'
      },
      {
        name: 'l2_leaf_reg',
        description: 'L2 regularization coefficient. Higher values mean more regularization.',
        typical: '3-10'
      },
      {
        name: 'random_strength',
        description: 'Amount of randomness to use for scoring splits. Helps prevent overfitting.',
        typical: '1'
      },
      {
        name: 'bagging_temperature',
        description: 'Controls intensity of Bayesian bagging. 0 means no bagging.',
        typical: '1'
      },
      {
        name: 'grow_policy',
        description: 'How to grow trees: SymmetricTree, Depthwise, or Lossguide',
        typical: 'SymmetricTree'
      },
      {
        name: 'min_data_in_leaf',
        description: 'Minimum number of training samples in a leaf.',
        typical: '1-20'
      }
    ]
  }
};

const AlgorithmExplorer = () => {
  const [selectedTab, setSelectedTab] = useState('xgboost');
  const location = useLocation();
  
  // Extract algorithm from URL query parameter if available
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const algorithm = searchParams.get('algorithm');
    if (algorithm && ['xgboost', 'lightgbm', 'catboost'].includes(algorithm)) {
      setSelectedTab(algorithm);
    }
  }, [location.search]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const currentAlgorithm = algorithmInfo[selectedTab];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Algorithm Explorer
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Explore and understand the inner workings of different gradient boosting algorithms.
      </Typography>

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
        >
          <Tab 
            value="xgboost" 
            label="XGBoost" 
            sx={{ 
              py: 2,
              borderBottom: selectedTab === 'xgboost' ? `4px solid ${algorithmInfo.xgboost.color}` : 'none' 
            }} 
          />
          <Tab 
            value="lightgbm" 
            label="LightGBM" 
            sx={{ 
              py: 2,
              borderBottom: selectedTab === 'lightgbm' ? `4px solid ${algorithmInfo.lightgbm.color}` : 'none' 
            }} 
          />
          <Tab 
            value="catboost" 
            label="CatBoost" 
            sx={{ 
              py: 2,
              borderBottom: selectedTab === 'catboost' ? `4px solid ${algorithmInfo.catboost.color}` : 'none' 
            }} 
          />
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        {/* Algorithm Overview */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" sx={{ color: currentAlgorithm.color, flexGrow: 1 }}>
                {currentAlgorithm.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {currentAlgorithm.fullName}
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              {currentAlgorithm.description}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <HistoryIcon sx={{ mr: 1, color: currentAlgorithm.color }} />
                      <Typography variant="h6">History & Origin</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2" paragraph>
                      <strong>Developed by:</strong> {currentAlgorithm.creator}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Year:</strong> {currentAlgorithm.year}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Original Paper:</strong>{' '}
                      <a href={currentAlgorithm.paperLink} target="_blank" rel="noopener noreferrer">
                        {currentAlgorithm.paper}
                      </a>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <InfoIcon sx={{ mr: 1, color: currentAlgorithm.color }} />
                      <Typography variant="h6">Key Characteristics</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <List dense disablePadding>
                      {currentAlgorithm.keyFeatures.map((feature, index) => (
                        <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon fontSize="small" sx={{ color: currentAlgorithm.color }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature.title} 
                            secondary={feature.description} 
                            primaryTypographyProps={{ variant: 'subtitle2' }}
                            secondaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Mathematical Formulation */}
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <SchemaIcon sx={{ mr: 1, color: currentAlgorithm.color }} />
              <Typography variant="h6">Mathematical Formulation</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" paragraph>
                The mathematical foundation of {currentAlgorithm.name} builds on the gradient boosting framework with specific optimizations.
              </Typography>
              <Paper variant="outlined" sx={{ p: 3, bgcolor: '#f5f5f5' }}>
                {selectedTab === 'xgboost' && <XGBoostMathFormula />}
                {selectedTab === 'lightgbm' && <LightGBMMathFormula />}
                {selectedTab === 'catboost' && <CatBoostMathFormula />}
              </Paper>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Strengths and Limitations */}
        <Grid item xs={12} md={6}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <BuildIcon sx={{ mr: 1, color: currentAlgorithm.color }} />
              <Typography variant="h6">Strengths</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {currentAlgorithm.strengths.map((strength, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: currentAlgorithm.color }} />
                    </ListItemIcon>
                    <ListItemText primary={strength} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12} md={6}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <SpeedIcon sx={{ mr: 1, color: currentAlgorithm.color }} />
              <Typography variant="h6">Limitations</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {currentAlgorithm.limitations.map((limitation, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <InfoIcon sx={{ color: 'gray' }} />
                    </ListItemIcon>
                    <ListItemText primary={limitation} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Hyperparameters */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <TuneIcon sx={{ mr: 1, color: currentAlgorithm.color }} />
              <Typography variant="h6">Important Hyperparameters</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                These are the key hyperparameters that most strongly influence the behavior and performance of {currentAlgorithm.name}.
              </Typography>
              <Grid container spacing={2}>
                {currentAlgorithm.hyperparameters.map((param, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ color: currentAlgorithm.color, fontWeight: 'bold' }}>
                          {param.name}
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {param.description}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block' }}>
                          Typical value(s): {param.typical}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Links to Implementation Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Next Steps
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card className="card-hover" sx={{ bgcolor: '#f5f5f5' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Try {currentAlgorithm.name} Visualization
                    </Typography>
                    <Typography variant="body2">
                      See how {currentAlgorithm.name} works through interactive visualizations.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card className="card-hover" sx={{ bgcolor: '#f5f5f5' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Explore Hyperparameter Tuning
                    </Typography>
                    <Typography variant="body2">
                      Experiment with different settings and see how they affect model performance.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card className="card-hover" sx={{ bgcolor: '#f5f5f5' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Compare Algorithms
                    </Typography>
                    <Typography variant="body2">
                      See how {currentAlgorithm.name} compares to other gradient boosting implementations.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AlgorithmExplorer;
