import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import Plot from 'react-plotly.js';

/**
 * A component to visualize the loss function optimization over boosting iterations
 * Currently a placeholder - will be implemented with Plotly.js
 */
const LossVisualization = ({ algorithm, currentStep }) => {
  // Generate synthetic decreasing loss curve
  const lossTrace = useMemo(() => {
    const steps = [...Array(10).keys()];
    const losses = steps.map((s) => 1 / (s + 1));
    return [
      {
        x: steps.map((s) => s + 1),
        y: losses,
        type: 'scatter',
        mode: 'lines+markers',
        line: { shape: 'spline', color: '#1f77b4' },
        marker: { size: 6 },
        name: 'Loss',
      },
    ];
  }, []);

  return (
    <Box className="visualization-container" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', p: 3 }}>
      <Typography variant="h6" gutterBottom textAlign="center">
        {algorithm.toUpperCase()} Loss Function – Up to Tree {currentStep + 1}
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 600, height: 400 }}>
        <Plot
          data={lossTrace}
          layout={{
            margin: { t: 10, l: 40, r: 10, b: 40 },
            xaxis: { title: 'Boosting Iteration', range: [1, 10] },
            yaxis: { title: 'Loss', range: [0, 1] },
            hovermode: 'closest',
          }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
        />
      </Box>

      <Box sx={{ mt: 2, width: '100%' }}>
        <Typography variant="subtitle2" gutterBottom>
          Loss Function Details:
        </Typography>
        <Typography variant="body2">
          {algorithm === 'xgboost' && (
            <>• Objective: Logistic/MSE • Regularization: L1/L2 • Optimization: Second-order approximation</>
          )}
          {algorithm === 'lightgbm' && (
            <>• Objective: Logistic/MSE • Regularization: L1/L2 • Optimization: Histogram gradients</>
          )}
          {algorithm === 'catboost' && (
            <>• Objective: Logloss/RMSE • Regularization: L2 • Optimization: Ordered boosting</>
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default LossVisualization;
