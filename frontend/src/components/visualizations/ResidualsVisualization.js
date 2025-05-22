import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import Plot from 'react-plotly.js';

/**
 * A component to visualize the residuals at each boosting iteration
 * Currently a placeholder - will be implemented with Plotly.js
 */
const ResidualsVisualization = ({ algorithm, currentStep }) => {
  // Generate synthetic residuals that shrink as currentStep increases
  const residualsData = useMemo(() => {
    const N = 300;
    const scale = 1 - Math.min(0.9, currentStep / 10);
    return Array.from({ length: N }, () => (Math.random() - 0.5) * 2 * scale);
  }, [currentStep]);

  const histTrace = [
    {
      x: residualsData,
      type: 'histogram',
      marker: { color: '#ff7f0e' },
      nbinsx: 30,
      name: 'Residuals',
    },
  ];

  return (
    <Box className="visualization-container" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', p: 3 }}>
      <Typography variant="h6" gutterBottom textAlign="center">
        {algorithm.toUpperCase()} Residuals – Iteration {currentStep + 1}
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 600, height: 400 }}>
        <Plot
          data={histTrace}
          layout={{
            margin: { t: 10, l: 40, r: 10, b: 40 },
            xaxis: { title: 'Residual Value' },
            yaxis: { title: 'Count' },
            bargap: 0.05,
          }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
        />
      </Box>

      <Box sx={{ mt: 2, width: '100%' }}>
        <Typography variant="subtitle2" gutterBottom>
          Residual Analysis:
        </Typography>
        <Typography variant="body2">
          • Current Tree: {currentStep + 1}
          <br />• Error Metric: {algorithm === 'catboost' ? 'RMSE' : 'MSE'} (synthetic)
          <br />• Distribution narrows as boosting progresses
        </Typography>
      </Box>
    </Box>
  );
};

export default ResidualsVisualization;
