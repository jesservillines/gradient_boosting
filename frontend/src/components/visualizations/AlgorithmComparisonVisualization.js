import React from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import Plot from 'react-plotly.js';

/**
 * A component to visualize comparison between gradient boosting algorithms
 * Currently a placeholder - will be implemented with Plotly.js
 */
const AlgorithmComparisonVisualization = ({ 
  dataset, 
  aspect, 
  comparisonData,
  isComparing
}) => {
  // Prepare data for Plotly visualization
  const algorithmLabels = ['XGBoost', 'LightGBM', 'CatBoost'];
  const algorithmColors = ['#FF6B6B', '#45B7D1', '#BB8FCE'];

  let plotData = null;
  let layout = {
    margin: { t: 40, l: 60, r: 20, b: 60 },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
  };

  if (aspect === 'accuracy') {
    plotData = [
      {
        x: algorithmLabels,
        y: [
          comparisonData.xgboost,
          comparisonData.lightgbm,
          comparisonData.catboost,
        ],
        type: 'bar',
        marker: { color: algorithmColors },
      },
    ];
    layout.title = 'Accuracy';
    layout.yaxis = { title: 'Accuracy', range: [0, 1] };
  } else if (aspect === 'speed') {
    plotData = [
      {
        x: algorithmLabels,
        y: [
          comparisonData.xgboost.training,
          comparisonData.lightgbm.training,
          comparisonData.catboost.training,
        ],
        name: 'Training (s)',
        type: 'bar',
        marker: { color: algorithmColors },
      },
      {
        x: algorithmLabels,
        y: [
          comparisonData.xgboost.inference * 1000,
          comparisonData.lightgbm.inference * 1000,
          comparisonData.catboost.inference * 1000,
        ],
        name: 'Inference (ms)',
        type: 'bar',
        marker: { color: ['#FFA4A4', '#9FD6F2', '#D1B3F4'] },
      },
    ];
    layout.barmode = 'group';
    layout.title = 'Speed Comparison';
    layout.yaxis = { title: 'Time' };
    layout.showlegend = true;
  } else if (aspect === 'memory') {
    plotData = [
      {
        x: algorithmLabels,
        y: [
          comparisonData.xgboost,
          comparisonData.lightgbm,
          comparisonData.catboost,
        ],
        type: 'bar',
        marker: { color: algorithmColors },
      },
    ];
    layout.title = 'Memory Usage';
    layout.yaxis = { title: 'Memory (MB)' };
  }

  return (
    <Box className="visualization-container" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', p: 3 }}>
      {isComparing ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <CircularProgress sx={{ mb: 3 }} />
          <Typography variant="h6">Comparing Algorithms...</Typography>
          <Typography variant="body2" color="text.secondary">
            Running XGBoost, LightGBM, and CatBoost on {dataset} dataset
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="h6" gutterBottom textAlign="center">
            Algorithm Comparison: {aspect === 'accuracy' ? 'Performance' : 
                                  aspect === 'speed' ? 'Speed' :
                                  aspect === 'memory' ? 'Memory Usage' :
                                  aspect === 'feature_importance' ? 'Feature Importance' :
                                  aspect === 'categorical' ? 'Categorical Feature Handling' :
                                  'Hyperparameter Sensitivity'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            Dataset: {dataset}
          </Typography>
          
          {plotData ? (
            <Plot
              data={plotData}
              layout={layout}
              style={{ width: '100%', height: 300 }}
              config={{ displayModeBar: false, responsive: true }}
            />
          ) : (
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                height: 300,
                bgcolor: '#f5f5f5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px dashed #aaa',
              }}
            >
              <Typography variant="body1" color="text.secondary" textAlign="center">
                Interactive comparison visualization will be implemented here.
                <br />
                Currently not available for selected aspect.
              </Typography>
            </Paper>
          )}
          
          <Box sx={{ mt: 2, width: '100%' }}>
            <Typography variant="subtitle2" gutterBottom>
              Comparison Summary:
            </Typography>
            <Typography variant="body2">
              {aspect === 'accuracy' && (
                `For this ${dataset} dataset, ${comparisonData.winner.toUpperCase()} achieves the highest accuracy (${comparisonData[comparisonData.winner].toFixed(4)}), 
                though all three algorithms perform well with small differences. The relative performance can vary depending on the dataset characteristics and hyperparameter tuning.`
              )}
              {aspect === 'speed' && (
                `${comparisonData.winner.toUpperCase()} demonstrates the fastest training time (${comparisonData[comparisonData.winner].training.toFixed(2)}s) on this dataset. 
                LightGBM is generally the fastest on large datasets due to its histogram-based approach, while CatBoost can be faster on GPU. Inference times are similar across all algorithms.`
              )}
              {aspect === 'memory' && (
                `${comparisonData.winner.toUpperCase()} shows the lowest memory usage (${comparisonData[comparisonData.winner]}MB) for this model. 
                LightGBM's histogram binning approach typically results in lower memory usage, while CatBoost may use more memory due to its ordered boosting approach.`
              )}
              {aspect === 'feature_importance' && (
                `${comparisonData.winner.toUpperCase()} provides the most consistent and interpretable feature importance metrics. 
                All three algorithms support various importance measures (gain, split count, etc.), and tools like SHAP can be used with any of them for detailed explanations.`
              )}
              {aspect === 'categorical' && (
                `${comparisonData.winner.toUpperCase()} has the most sophisticated approach to handling categorical features. 
                CatBoost was specifically designed with categorical features in mind and uses ordered target statistics, 
                LightGBM has native support with optimal splits, while XGBoost traditionally requires preprocessing.`
              )}
              {aspect === 'hyperparameter_sensitivity' && (
                `${comparisonData.winner.toUpperCase()} demonstrates the least sensitivity to hyperparameter choices, providing good out-of-box performance. 
                CatBoost often requires less tuning, XGBoost is moderately sensitive but has robust defaults, 
                while LightGBM can overfit if leaf-wise growth parameters aren't carefully set.`
              )}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AlgorithmComparisonVisualization;
