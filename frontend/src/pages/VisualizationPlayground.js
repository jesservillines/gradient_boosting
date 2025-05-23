import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Slider,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

// Import visualization components (placeholders for now)
import BoostingProcessVisualization from '../components/visualizations/BoostingProcessVisualization';
import TreeVisualization from '../components/visualizations/TreeVisualization';
import LossVisualization from '../components/visualizations/LossVisualization';
import ResidualsVisualization from '../components/visualizations/ResidualsVisualization';

// Import actions from visualization slice
import {
  setBoostingMode,
  setCurrentStep,
  incrementStep,
  decrementStep,
  togglePredictions,
  toggleResiduals,
  setAnimationSpeed
} from '../slices/visualizationSlice';

const VisualizationPlayground = () => {
  const dispatch = useDispatch();
  
  // Get visualization state from Redux
  const visualizationState = useSelector(state => state.visualization.boostingVisualization);
  const { mode, currentStep, showPredictions, showResiduals, animationSpeed } = visualizationState;
  
  // Local state for visualizations
  const [algorithm, setAlgorithm] = useState('xgboost');
  const [datasetType, setDatasetType] = useState('classification');
  const [currentDataset, setCurrentDataset] = useState('simulated');
  const [isPlaying, setIsPlaying] = useState(false);
  const [datasetPoints, setDatasetPoints] = useState(null);
  const [currentBoostingTab, setCurrentBoostingTab] = useState('process');
  const [maxSteps, setMaxSteps] = useState(10); // Max number of boosting iterations
  
  // Fetch PCA points when dataset changes
  useEffect(() => {
    const fetchPCA = async () => {
      try {
        const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const resp = await axios.get(`${apiBase}/datasets/${currentDataset}/pca`);
        const pts = resp.data.x.map((xVal, idx) => ({ x: xVal, y: resp.data.y[idx], target: resp.data.target[idx] }));
        setDatasetPoints(pts);
      } catch (e) {
        console.error('PCA fetch failed', e);
        setDatasetPoints(null);
      }
    };
    fetchPCA();
  }, [currentDataset]);
  
  // Clear animation interval on unmount
  useEffect(() => {
    let animationInterval;
    
    if (isPlaying) {
      animationInterval = setInterval(() => {
        if (currentStep < maxSteps - 1) {
          dispatch(incrementStep());
        } else {
          setIsPlaying(false);
        }
      }, animationSpeed);
    }
    
    return () => {
      if (animationInterval) {
        clearInterval(animationInterval);
      }
    };
  }, [isPlaying, currentStep, maxSteps, animationSpeed, dispatch]);
  
  // Handle boosting tab change
  const handleBoostingTabChange = (event, newValue) => {
    setCurrentBoostingTab(newValue);
  };
  
  // Animation control handlers
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleReset = () => {
    setIsPlaying(false);
    dispatch(setCurrentStep(0));
  };
  
  const handleStepBack = () => {
    setIsPlaying(false);
    dispatch(decrementStep());
  };
  
  const handleStepForward = () => {
    setIsPlaying(false);
    if (currentStep < maxSteps - 1) {
      dispatch(incrementStep());
    }
  };
  
  // Handle algorithm change
  const handleAlgorithmChange = (event) => {
    setAlgorithm(event.target.value);
    dispatch(setCurrentStep(0)); // Reset to step 0 when changing algorithm
  };
  
  // Handle dataset change
  const handleDatasetChange = (event) => {
    setCurrentDataset(event.target.value);
    dispatch(setCurrentStep(0)); // Reset to step 0 when changing dataset
  };
  
  // Handle dataset type change
  const handleDatasetTypeChange = (event, newValue) => {
    setDatasetType(newValue);
    // Reset dataset selection based on type
    if (newValue === 'classification') {
      setCurrentDataset('simulated');
    } else {
      setCurrentDataset('housing');
    }
    dispatch(setCurrentStep(0));
  };
  
  // Handle boosting mode change
  const handleBoostingModeChange = (event) => {
    dispatch(setBoostingMode(event.target.value));
  };
  
  // Handle animation speed change
  const handleSpeedChange = (event, newValue) => {
    dispatch(setAnimationSpeed(newValue));
  };

  return (
    <Box sx={{ width: '100%', mx: 0 }}>
      <Helmet>
        <title>Interactive Gradient Boosting Visualization - XGBoost, LightGBM, CatBoost</title>
        <meta name="description" content="Explore gradient boosting algorithms through interactive visualizations. Compare XGBoost, LightGBM, and CatBoost performance in real-time with customizable parameters." />
        <meta name="keywords" content="gradient boosting visualization, XGBoost interactive, LightGBM visualization, CatBoost demo, ML visualization playground" />
        <meta property="og:title" content="Interactive Gradient Boosting Visualization Playground" />
        <meta property="og:description" content="Hands-on exploration of gradient boosting algorithms with real-time visualizations and parameter tuning." />
        <meta property="og:url" content="https://gradient-boosting-visualizer.netlify.app/visualization" />
      </Helmet>
      
      <Typography variant="h4" gutterBottom>
        Visualization Playground
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Explore gradient boosting algorithms through interactive visualizations.
      </Typography>
      
      {/* Control Panel */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
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
          
          <Grid item xs={12} md={3}>
            <Tabs
              value={datasetType}
              onChange={handleDatasetTypeChange}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab value="classification" label="Classification" />
              <Tab value="regression" label="Regression" />
            </Tabs>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="dataset-select-label">Dataset</InputLabel>
              <Select
                labelId="dataset-select-label"
                id="dataset-select"
                value={currentDataset}
                label="Dataset"
                onChange={handleDatasetChange}
              >
                {datasetType === 'classification' ? (
                  <>
                    <MenuItem value="simulated">Simulated 2D</MenuItem>
                    <MenuItem value="iris">Iris</MenuItem>
                    <MenuItem value="breast_cancer">Breast Cancer</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem value="housing">Housing</MenuItem>
                    <MenuItem value="diabetes">Diabetes</MenuItem>
                    <MenuItem value="simulated">Simulated 1D</MenuItem>
                  </>
                )}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="mode-select-label">Boosting Mode</InputLabel>
              <Select
                labelId="mode-select-label"
                id="mode-select"
                value={mode}
                label="Boosting Mode"
                onChange={handleBoostingModeChange}
              >
                <MenuItem value="sequential">Sequential</MenuItem>
                <MenuItem value="residual">Residual Focus</MenuItem>
                <MenuItem value="contribution">Tree Contribution</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Main Visualization Area */}
      <Grid container spacing={3}>
        {/* Left section: Main visualization */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 0, mb: 3 }}>
            <Tabs
              value={currentBoostingTab}
              onChange={handleBoostingTabChange}
              textColor="primary"
              indicatorColor="primary"
              variant="fullWidth"
            >
              <Tab value="process" label="Boosting Process" />
              <Tab value="tree" label="Current Tree" />
              <Tab value="loss" label="Loss Function" />
              <Tab value="residuals" label="Residuals" />
            </Tabs>
            
            <Box sx={{ p: 3, minHeight: 400 }}>
              {/* Show different visualization based on selected tab */}
              {currentBoostingTab === 'process' && (
                <BoostingProcessVisualization 
                  algorithm={algorithm}
                  dataset={currentDataset}
                  datasetType={datasetType}
                  currentStep={currentStep}
                  showPredictions={showPredictions}
                  showResiduals={showResiduals}
                  points={datasetPoints}
                />
              )}
              
              {currentBoostingTab === 'tree' && (
                <TreeVisualization 
                  algorithm={algorithm}
                  treeIndex={currentStep}
                />
              )}
              
              {currentBoostingTab === 'loss' && (
                <LossVisualization 
                  algorithm={algorithm}
                  currentStep={currentStep}
                />
              )}
              
              {currentBoostingTab === 'residuals' && (
                <ResidualsVisualization 
                  algorithm={algorithm}
                  currentStep={currentStep}
                />
              )}
            </Box>
            
            {/* Animation Controls */}
            <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <ButtonGroup variant="outlined" sx={{ mb: 2 }}>
                    <Button onClick={handleReset} startIcon={<RestartAltIcon />}>
                      Reset
                    </Button>
                    <Button onClick={handleStepBack} disabled={currentStep === 0} startIcon={<SkipPreviousIcon />}>
                      Back
                    </Button>
                    <Button onClick={handlePlayPause} color="primary">
                      {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                    </Button>
                    <Button onClick={handleStepForward} disabled={currentStep === maxSteps - 1} startIcon={<SkipNextIcon />}>
                      Next
                    </Button>
                  </ButtonGroup>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ minWidth: 100 }}>
                      Current Tree: {currentStep + 1} / {maxSteps}
                    </Typography>
                    <Slider
                      value={currentStep}
                      min={0}
                      max={maxSteps - 1}
                      step={1}
                      onChange={(e, newValue) => dispatch(setCurrentStep(newValue))}
                      sx={{ mx: 2, flexGrow: 1 }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Animation Speed (ms):
                    </Typography>
                    <Slider
                      value={animationSpeed}
                      min={100}
                      max={2000}
                      step={100}
                      onChange={handleSpeedChange}
                      valueLabelDisplay="auto"
                      marks={[
                        { value: 100, label: 'Fast' },
                        { value: 1000, label: 'Medium' },
                        { value: 2000, label: 'Slow' }
                      ]}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={showPredictions} 
                          onChange={() => dispatch(togglePredictions())}
                        />
                      }
                      label="Show Predictions"
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={showResiduals} 
                          onChange={() => dispatch(toggleResiduals())}
                        />
                      }
                      label="Show Residuals"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
        
        {/* Right section: Information and details */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {algorithm === 'xgboost' && 'XGBoost'}
                {algorithm === 'lightgbm' && 'LightGBM'}
                {algorithm === 'catboost' && 'CatBoost'}
                {' '}Visualization
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" paragraph>
                {algorithm === 'xgboost' && (
                  'XGBoost builds trees sequentially, with each new tree correcting errors made by previous trees. It uses second-order gradients for more accurate updates.'
                )}
                {algorithm === 'lightgbm' && (
                  'LightGBM uses histogram-based splitting and leaf-wise growth, which makes it faster than level-wise growth used in traditional algorithms.'
                )}
                {algorithm === 'catboost' && (
                  'CatBoost uses ordered boosting to prevent prediction shift. It adds trees that minimize the loss based on gradients calculated with unbiased estimations.'
                )}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Current Visualization Mode: {mode}
              </Typography>
              <Typography variant="body2" paragraph>
                {mode === 'sequential' && (
                  'Sequential mode shows how trees are added one by one to form the ensemble prediction.'
                )}
                {mode === 'residual' && (
                  'Residual focus mode highlights how each tree fits the errors (residuals) from the previous ensemble.'
                )}
                {mode === 'contribution' && (
                  'Tree contribution mode visualizes how much each individual tree contributes to the final prediction.'
                )}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Current Dataset: {currentDataset}
              </Typography>
              <Typography variant="body2">
                {currentDataset === 'simulated' && datasetType === 'classification' && (
                  'A 2D simulated classification dataset with non-linear decision boundaries.'
                )}
                {currentDataset === 'iris' && (
                  'The classic Iris flower dataset with 3 classes and 4 features.'
                )}
                {currentDataset === 'breast_cancer' && (
                  'Breast cancer Wisconsin dataset with malignant and benign tumor classifications.'
                )}
                {currentDataset === 'housing' && (
                  'Boston housing dataset for predicting median home values.'
                )}
                {currentDataset === 'diabetes' && (
                  'Diabetes progression dataset for predicting disease progression.'
                )}
                {currentDataset === 'simulated' && datasetType === 'regression' && (
                  'A 1D simulated regression dataset with non-linear relationships.'
                )}
              </Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tree {currentStep + 1} Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Structure
              </Typography>
              <Typography variant="body2" paragraph>
                Depth: {algorithm === 'lightgbm' ? '3-5 (variable)' : '3 (fixed)'}
              </Typography>
              <Typography variant="body2" paragraph>
                Splits: {algorithm === 'lightgbm' ? '7-14 (variable)' : '7 (fixed)'}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Performance Improvement
              </Typography>
              <Typography variant="body2" paragraph>
                Training Loss Reduction: {(0.15 / (currentStep + 1)).toFixed(4)}
              </Typography>
              <Typography variant="body2">
                Validation Loss Reduction: {(0.12 / (currentStep + 1)).toFixed(4)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VisualizationPlayground;
