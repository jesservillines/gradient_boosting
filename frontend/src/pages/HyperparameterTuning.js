import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  TextField,
  Divider,
  Chip,
  Switch,
  FormControlLabel,
  Tabs,
  Tab
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TuneIcon from '@mui/icons-material/Tune';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

// Import visualization components (placeholders for now)
import HyperparameterImpactVisualization from '../components/visualizations/HyperparameterImpactVisualization';
import ModelPerformanceVisualization from '../components/visualizations/ModelPerformanceVisualization';

// XGBoost hyperparameter definitions with descriptions and ranges
const xgboostParams = [
  {
    name: 'learning_rate',
    label: 'Learning Rate',
    description: 'Step size shrinkage used to prevent overfitting. Range: [0,1]',
    defaultValue: 0.1,
    min: 0.01,
    max: 0.3,
    step: 0.01,
    category: 'basic'
  },
  {
    name: 'max_depth',
    label: 'Max Depth',
    description: 'Maximum depth of a tree. Higher value causes more complex model.',
    defaultValue: 6,
    min: 1,
    max: 15,
    step: 1,
    category: 'basic'
  },
  {
    name: 'n_estimators',
    label: 'Number of Trees',
    description: 'Number of boosting rounds (trees) to perform.',
    defaultValue: 100,
    min: 10,
    max: 1000,
    step: 10,
    category: 'basic'
  },
  {
    name: 'subsample',
    label: 'Subsample Ratio',
    description: 'Fraction of samples used for fitting the trees. Range: (0,1]',
    defaultValue: 1.0,
    min: 0.1,
    max: 1.0,
    step: 0.05,
    category: 'basic'
  },
  {
    name: 'colsample_bytree',
    label: 'Column Sample by Tree',
    description: 'Fraction of features used for fitting each tree. Range: (0,1]',
    defaultValue: 1.0,
    min: 0.1,
    max: 1.0,
    step: 0.05,
    category: 'basic'
  },
  {
    name: 'gamma',
    label: 'Gamma (Min Split Loss)',
    description: 'Minimum loss reduction required to make a further partition.',
    defaultValue: 0,
    min: 0,
    max: 10,
    step: 0.1,
    category: 'advanced'
  },
  {
    name: 'alpha',
    label: 'L1 Regularization',
    description: 'L1 regularization term on weights (lasso).',
    defaultValue: 0,
    min: 0,
    max: 10,
    step: 0.1,
    category: 'advanced'
  },
  {
    name: 'lambda',
    label: 'L2 Regularization',
    description: 'L2 regularization term on weights (ridge).',
    defaultValue: 1,
    min: 0,
    max: 10,
    step: 0.1,
    category: 'advanced'
  },
  {
    name: 'min_child_weight',
    label: 'Min Child Weight',
    description: 'Minimum sum of instance weight needed in a child.',
    defaultValue: 1,
    min: 0,
    max: 10,
    step: 1,
    category: 'advanced'
  },
  {
    name: 'scale_pos_weight',
    label: 'Scale Pos Weight',
    description: 'Controls balance of positive and negative weights (for imbalanced classes).',
    defaultValue: 1,
    min: 1,
    max: 100,
    step: 1,
    category: 'advanced'
  }
];

// LightGBM hyperparameter definitions
const lightgbmParams = [
  {
    name: 'learning_rate',
    label: 'Learning Rate',
    description: 'Shrinkage rate to prevent overfitting. Range: [0,1]',
    defaultValue: 0.1,
    min: 0.01,
    max: 0.3,
    step: 0.01,
    category: 'basic'
  },
  {
    name: 'num_leaves',
    label: 'Number of Leaves',
    description: 'Maximum number of leaves in one tree. Controls model complexity.',
    defaultValue: 31,
    min: 2,
    max: 256,
    step: 1,
    category: 'basic'
  },
  {
    name: 'n_estimators',
    label: 'Number of Trees',
    description: 'Number of boosting rounds (trees) to perform.',
    defaultValue: 100,
    min: 10,
    max: 1000,
    step: 10,
    category: 'basic'
  },
  {
    name: 'max_depth',
    label: 'Max Depth',
    description: 'Maximum tree depth. -1 means no limit.',
    defaultValue: -1,
    min: -1,
    max: 15,
    step: 1,
    category: 'basic'
  },
  {
    name: 'min_data_in_leaf',
    label: 'Min Data in Leaf',
    description: 'Minimum number of data in one leaf. Helps prevent overfitting.',
    defaultValue: 20,
    min: 1,
    max: 100,
    step: 1,
    category: 'basic'
  },
  {
    name: 'feature_fraction',
    label: 'Feature Fraction',
    description: 'Fraction of features to use in each iteration. Range: (0,1]',
    defaultValue: 0.8,
    min: 0.1,
    max: 1.0,
    step: 0.05,
    category: 'basic'
  },
  {
    name: 'bagging_fraction',
    label: 'Bagging Fraction',
    description: 'Fraction of data to use for each iteration. Range: (0,1]',
    defaultValue: 0.8,
    min: 0.1,
    max: 1.0,
    step: 0.05,
    category: 'advanced'
  },
  {
    name: 'lambda_l1',
    label: 'L1 Regularization',
    description: 'L1 regularization.',
    defaultValue: 0,
    min: 0,
    max: 10,
    step: 0.1,
    category: 'advanced'
  },
  {
    name: 'lambda_l2',
    label: 'L2 Regularization',
    description: 'L2 regularization.',
    defaultValue: 0,
    min: 0,
    max: 10,
    step: 0.1,
    category: 'advanced'
  },
  {
    name: 'min_gain_to_split',
    label: 'Min Gain to Split',
    description: 'Minimum gain to perform splitting.',
    defaultValue: 0,
    min: 0,
    max: 10,
    step: 0.1,
    category: 'advanced'
  }
];

// CatBoost hyperparameter definitions
const catboostParams = [
  {
    name: 'learning_rate',
    label: 'Learning Rate',
    description: 'Step size for gradient descent. Range: [0,1]',
    defaultValue: 0.1,
    min: 0.01,
    max: 0.3,
    step: 0.01,
    category: 'basic'
  },
  {
    name: 'depth',
    label: 'Depth',
    description: 'Depth of trees. Deeper trees can model more complex relationships.',
    defaultValue: 6,
    min: 1,
    max: 16,
    step: 1,
    category: 'basic'
  },
  {
    name: 'iterations',
    label: 'Iterations',
    description: 'Maximum number of trees to build.',
    defaultValue: 100,
    min: 10,
    max: 1000,
    step: 10,
    category: 'basic'
  },
  {
    name: 'l2_leaf_reg',
    label: 'L2 Leaf Regularization',
    description: 'L2 regularization coefficient. Higher values mean more regularization.',
    defaultValue: 3.0,
    min: 1.0,
    max: 10.0,
    step: 0.1,
    category: 'basic'
  },
  {
    name: 'random_strength',
    label: 'Random Strength',
    description: 'Amount of randomness to use for scoring splits. Helps prevent overfitting.',
    defaultValue: 1.0,
    min: 0.1,
    max: 10.0,
    step: 0.1,
    category: 'advanced'
  },
  {
    name: 'bagging_temperature',
    label: 'Bagging Temperature',
    description: 'Controls intensity of Bayesian bagging. 0 means no bagging.',
    defaultValue: 1.0,
    min: 0.0,
    max: 10.0,
    step: 0.1,
    category: 'advanced'
  },
  {
    name: 'min_data_in_leaf',
    label: 'Min Data in Leaf',
    description: 'Minimum number of training samples in a leaf.',
    defaultValue: 1,
    min: 1,
    max: 50,
    step: 1,
    category: 'advanced'
  },
  {
    name: 'rsm',
    label: 'RSM (Col Sample Rate)',
    description: 'Random subspace method rate, fraction of features to use at each split.',
    defaultValue: 1.0,
    min: 0.1,
    max: 1.0,
    step: 0.05,
    category: 'advanced'
  },
  {
    name: 'leaf_estimation_iterations',
    label: 'Leaf Estimation Iterations',
    description: 'Number of gradient steps when calculating leaf values.',
    defaultValue: 1,
    min: 1,
    max: 10,
    step: 1,
    category: 'advanced'
  },
  {
    name: 'border_count',
    label: 'Border Count',
    description: 'Number of splits for numerical features.',
    defaultValue: 254,
    min: 1,
    max: 255,
    step: 1,
    category: 'advanced'
  }
];

const HyperparameterTuning = () => {
  // State for current algorithm and dataset
  const [algorithm, setAlgorithm] = useState('xgboost');
  const [dataset, setDataset] = useState('breast_cancer');
  const [paramCategory, setParamCategory] = useState('basic');
  const [isTraining, setIsTraining] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [visualizationTab, setVisualizationTab] = useState('performance');
  
  // Get parameter definitions based on selected algorithm
  const getParamDefinitions = () => {
    switch (algorithm) {
      case 'xgboost':
        return xgboostParams;
      case 'lightgbm':
        return lightgbmParams;
      case 'catboost':
        return catboostParams;
      default:
        return [];
    }
  };
  
  // Initial parameter values
  const initializeParams = () => {
    const paramDefs = getParamDefinitions();
    return paramDefs.reduce((acc, param) => {
      acc[param.name] = param.defaultValue;
      return acc;
    }, {});
  };
  
  // Parameter state
  const [params, setParams] = useState(initializeParams());
  const [baselineParams, setBaselineParams] = useState(initializeParams());
  const [selectedParam, setSelectedParam] = useState('');
  
  // Update parameters when algorithm changes
  useEffect(() => {
    setParams(initializeParams());
    setBaselineParams(initializeParams());
    // Reset selected parameter
    if (getParamDefinitions().length > 0) {
      setSelectedParam(getParamDefinitions()[0].name);
    }
  }, [algorithm]);
  
  // Handle parameter change
  const handleParamChange = (paramName, value) => {
    setParams({
      ...params,
      [paramName]: value
    });
  };
  
  // Handle algorithm change
  const handleAlgorithmChange = (event) => {
    setAlgorithm(event.target.value);
  };
  
  // Handle dataset change
  const handleDatasetChange = (event) => {
    setDataset(event.target.value);
  };
  
  // Handle parameter category change
  const handleParamCategoryChange = (event, newValue) => {
    setParamCategory(newValue);
  };
  
  // Handle visualization tab change
  const handleVisualizationTabChange = (event, newValue) => {
    setVisualizationTab(newValue);
  };
  
  // Handle training
  const handleTrain = () => {
    setIsTraining(true);
    
    // Simulate training delay
    setTimeout(() => {
      setIsTraining(false);
    }, 2000);
  };
  
  // Handle setting baseline
  const handleSetBaseline = () => {
    setBaselineParams({...params});
  };
  
  // Handle resetting parameters
  const handleResetParams = () => {
    setParams(initializeParams());
  };
  
  // Handle selecting a parameter for detailed visualization
  const handleSelectParam = (paramName) => {
    setSelectedParam(paramName);
  };
  
  // Get the parameters to display based on selected category
  const getVisibleParams = () => {
    return getParamDefinitions().filter(param => param.category === paramCategory);
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Hyperparameter Tuning
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Experiment with different hyperparameters and see how they affect model performance.
      </Typography>
      
      {/* Control Panel */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="algorithm-select-label">Algorithm</InputLabel>
              <Select
                labelId="algorithm-select-label"
                id="algorithm-select"
                value={algorithm}
                label="Algorithm"
                onChange={handleAlgorithmChange}
              >
                <MenuItem value="xgboost">XGBoost</MenuItem>
                <MenuItem value="lightgbm">LightGBM</MenuItem>
                <MenuItem value="catboost">CatBoost</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="dataset-select-label">Dataset</InputLabel>
              <Select
                labelId="dataset-select-label"
                id="dataset-select"
                value={dataset}
                label="Dataset"
                onChange={handleDatasetChange}
              >
                <MenuItem value="breast_cancer">Breast Cancer</MenuItem>
                <MenuItem value="iris">Iris</MenuItem>
                <MenuItem value="wine">Wine</MenuItem>
                <MenuItem value="diabetes">Diabetes</MenuItem>
                <MenuItem value="housing">Housing</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<PlayArrowIcon />}
                onClick={handleTrain}
                disabled={isTraining}
                sx={{ mr: 1 }}
              >
                {isTraining ? 'Training...' : 'Train Model'}
              </Button>
              
              <Button 
                variant="outlined" 
                startIcon={<CompareArrowsIcon />}
                onClick={() => setCompareMode(!compareMode)}
                sx={{ mr: 1 }}
              >
                {compareMode ? 'Hide Comparison' : 'Compare'}
              </Button>
              
              <Button 
                variant="outlined" 
                color="secondary" 
                startIcon={<RestartAltIcon />}
                onClick={handleResetParams}
              >
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Main Content Area */}
      <Grid container spacing={3}>
        {/* Left Panel - Parameters */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={paramCategory}
                onChange={handleParamCategoryChange}
                textColor="primary"
                indicatorColor="primary"
                variant="fullWidth"
              >
                <Tab value="basic" label="Basic Parameters" />
                <Tab value="advanced" label="Advanced Parameters" />
              </Tabs>
            </Box>
            
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {algorithm.toUpperCase()} Parameters
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Adjust the parameters below to see how they affect model performance.
              </Typography>
              
              {getVisibleParams().map((param) => (
                <Box key={param.name} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography 
                      variant="subtitle2" 
                      onClick={() => handleSelectParam(param.name)}
                      sx={{ 
                        cursor: 'pointer', 
                        fontWeight: selectedParam === param.name ? 'bold' : 'normal',
                        color: selectedParam === param.name ? 'primary.main' : 'inherit'
                      }}
                    >
                      {param.label}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        value={params[param.name]}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) {
                            handleParamChange(param.name, Math.max(param.min, Math.min(param.max, val)));
                          }
                        }}
                        type="number"
                        size="small"
                        inputProps={{
                          min: param.min,
                          max: param.max,
                          step: param.step
                        }}
                        sx={{ width: 80 }}
                      />
                      {compareMode && (
                        <Chip 
                          size="small" 
                          label={baselineParams[param.name]} 
                          variant="outlined" 
                          sx={{ ml: 1 }} 
                        />
                      )}
                    </Box>
                  </Box>
                  <Slider
                    value={params[param.name]}
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    onChange={(e, val) => handleParamChange(param.name, val)}
                    valueLabelDisplay="auto"
                    sx={{ 
                      mt: 0, 
                      mb: 0.5,
                      '& .MuiSlider-thumb': { 
                        backgroundColor: selectedParam === param.name ? 'primary.main' : 'grey.500' 
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {param.description}
                  </Typography>
                </Box>
              ))}
              
              {compareMode && (
                <Button 
                  variant="outlined"
                  fullWidth
                  onClick={handleSetBaseline}
                  sx={{ mt: 2 }}
                >
                  Set Current as Baseline
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Right Panel - Visualization */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={visualizationTab}
                onChange={handleVisualizationTabChange}
                textColor="primary"
                indicatorColor="primary"
                variant="fullWidth"
              >
                <Tab value="performance" label="Model Performance" />
                <Tab value="impact" label="Parameter Impact" />
              </Tabs>
            </Box>
            
            <Box sx={{ p: 3, minHeight: 400 }}>
              {visualizationTab === 'performance' ? (
                <ModelPerformanceVisualization 
                  algorithm={algorithm}
                  params={params}
                  baselineParams={compareMode ? baselineParams : null}
                  isTraining={isTraining}
                />
              ) : (
                <HyperparameterImpactVisualization
                  algorithm={algorithm}
                  paramName={selectedParam}
                  currentValue={params[selectedParam]}
                  min={getParamDefinitions().find(p => p.name === selectedParam)?.min || 0}
                  max={getParamDefinitions().find(p => p.name === selectedParam)?.max || 1}
                />
              )}
            </Box>
          </Paper>
          
          {/* Parameter Detail Card */}
          {selectedParam && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Parameter Details: {getParamDefinitions().find(p => p.name === selectedParam)?.label || selectedParam}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body2" paragraph>
                  {getParamDefinitions().find(p => p.name === selectedParam)?.description || ''}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  Impact on Model
                </Typography>
                <Typography variant="body2" paragraph>
                  {selectedParam === 'learning_rate' && (
                    'Lower values require more boosting rounds but often yield better performance. Too high can cause overfitting, too low can cause underfitting.'
                  )}
                  {(selectedParam === 'max_depth' || selectedParam === 'depth') && (
                    'Controls tree complexity. Larger values allow more complex patterns but increase risk of overfitting.'
                  )}
                  {(selectedParam === 'n_estimators' || selectedParam === 'iterations') && (
                    'Number of trees in the ensemble. More trees can improve performance but with diminishing returns and increased training time.'
                  )}
                  {(selectedParam === 'subsample' || selectedParam === 'bagging_fraction') && (
                    'Subsampling rows can help prevent overfitting and improve training speed. Values below 1.0 introduce randomness similar to Random Forests.'
                  )}
                  {(selectedParam === 'colsample_bytree' || selectedParam === 'feature_fraction' || selectedParam === 'rsm') && (
                    'Subsampling features can help prevent overfitting, especially with high-dimensional data. Each tree will only consider a subset of features.'
                  )}
                  {(selectedParam === 'alpha' || selectedParam === 'lambda_l1') && (
                    'L1 regularization encourages sparsity by pushing some leaf weights to zero. Useful for feature selection and when dealing with many features.'
                  )}
                  {(selectedParam === 'lambda' || selectedParam === 'lambda_l2' || selectedParam === 'l2_leaf_reg') && (
                    'L2 regularization reduces the magnitude of leaf weights, helping to prevent overfitting. Higher values create smoother models.'
                  )}
                  {selectedParam === 'min_child_weight' && (
                    'Controls the minimum hessian (second derivative) sum needed in a child. Higher values are more conservative and can prevent overfitting.'
                  )}
                  {(selectedParam === 'min_data_in_leaf' || selectedParam === 'min_gain_to_split') && (
                    'Controls the minimum samples or gain needed to create a new node. Higher values prevent the creation of nodes with little support.'
                  )}
                  {selectedParam === 'num_leaves' && (
                    'Controls the maximum number of leaves in a LightGBM tree. Higher values create more complex models with potential for overfitting.'
                  )}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  Common Values
                </Typography>
                <Typography variant="body2">
                  {selectedParam === 'learning_rate' && (
                    'For XGBoost/LightGBM: 0.01-0.3, default 0.1. Lower for more trees, higher for fewer trees.'
                  )}
                  {(selectedParam === 'max_depth' || selectedParam === 'depth') && (
                    'XGBoost typically uses 3-10 with default 6. CatBoost 6-10 with default 6. LightGBM often uses -1 (unlimited) with num_leaves constraining complexity.'
                  )}
                  {(selectedParam === 'n_estimators' || selectedParam === 'iterations') && (
                    'Range from 50-1000+, with 100 being a common starting point. Final value depends on learning rate and early stopping.'
                  )}
                  {(selectedParam === 'subsample' || selectedParam === 'bagging_fraction') && (
                    'Common range is 0.5-1.0, with 0.8 being a popular choice for preventing overfitting while maintaining accuracy.'
                  )}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default HyperparameterTuning;
