import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import Plot from 'react-plotly.js';

/**
 * A component to visualize the gradient boosting process step by step
 * Currently a placeholder - will be implemented with D3.js or Plotly
 */
const BoostingProcessVisualization = ({
  algorithm,
  dataset,
  datasetType,
  currentStep,
  showPredictions,
  showResiduals,
  points = null,
}) => {
  // Use provided points or generate synthetic
  const dataPoints = useMemo(() => {
    if (points && points.length) {
      return points.map((p, idx) => ({ x: p.x, y: p.y, target: p.target ?? 0 }));
    }
    const pts = [];
    const TOTAL_POINTS = 250;
    for (let i = 0; i < TOTAL_POINTS; i++) {
      const x = Math.random();
      const y = Math.random();
      const target = x + y > 1 ? 1 : 0;
      pts.push({ x, y, target });
    }
    return pts;
  }, [points]);

  // Generate mock predictions that improve with each boosting step
  const traces = useMemo(() => {
    const stepProgress = Math.min(1, (currentStep + 1) / 10); // 0->1 over 10 steps

    // 1. Heat-map of decision boundary probabilities
    const gridSize = 40;
    const xRange = [...Array(gridSize).keys()].map((i) => i / (gridSize - 1));
    const yRange = [...Array(gridSize).keys()].map((i) => i / (gridSize - 1));
    const z = yRange.map((y) =>
      xRange.map((x) => {
        // simple synthetic probability
        const raw = x + y - 1; // decision boundary at x+y=1
        const prob = 1 / (1 + Math.exp(-6 * raw * stepProgress));
        return prob;
      })
    );

    // Build arrays for Plotly
    const xVals = dataPoints.map((p) => p.x);
    const yVals = dataPoints.map((p) => p.y);

    // Mock probability that the model predicts the correct class
    const predictions = dataPoints.map((p) => {
      const noise = (1 - stepProgress) * 0.5; // decreases as step increases
      const probCorrect = 0.5 + stepProgress * 0.5;
      const predictedCorrectly = Math.random() < probCorrect ? p.target : 1 - p.target;
      return predictedCorrectly;
    });

    const residuals = predictions.map((pred, idx) => dataPoints[idx].target - pred);

    const customData = dataPoints.map((p, idx) => [p.target, predictions[idx], residuals[idx]]);

    const scatterTrace = {
      x: xVals,
      y: yVals,
      mode: 'markers',
      marker: {
        size: 8,
        opacity: 0.8,
        color: (showPredictions ? predictions : dataPoints.map((p) => p.target)).map((v) =>
          v === 1 ? '#d62728' : '#1f77b4'
        ),
      },
      customdata: customData,
      hovertemplate:
        'Actual: %{customdata[0]}<br>Predicted: %{customdata[1]}<br>Residual: %{customdata[2]:.2f}<extra></extra>',
      name: showPredictions ? 'Predictions' : 'Actual',
    };

    const heatmapTrace = {
      z,
      x: xRange,
      y: yRange,
      type: 'heatmap',
      colorscale: 'RdBu',
      reversescale: true,
      opacity: 0.4,
      showscale: false,
      hoverinfo: 'skip',
    };

    const tracesArray = [heatmapTrace, scatterTrace];

    if (showResiduals) {
      // Residuals as short line segments
      const resX = [];
      const resY = [];
      residuals.forEach((res, idx) => {
        if (res !== 0) {
          resX.push(xVals[idx], xVals[idx]);
          resY.push(yVals[idx], yVals[idx] + res * 0.1); // scale residual for visibility
        }
      });
      tracesArray.push({
        x: resX,
        y: resY,
        mode: 'lines',
        line: { color: '#555', width: 1 },
        hoverinfo: 'skip',
        name: 'Residuals',
        showlegend: false,
      });
    }

    return tracesArray;
  }, [dataPoints, currentStep, showPredictions, showResiduals]);

  return (
    <Box
      className="visualization-container"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', p: 3 }}
    >
      <Typography variant="h6" gutterBottom textAlign="center">
        {algorithm.toUpperCase()} Boosting Process – Step {currentStep + 1}
      </Typography>

      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
        Dataset: {dataset} ({datasetType})
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 600, height: 400 }}>
        <Plot
          data={traces}
          layout={{
            margin: { t: 10, l: 40, r: 10, b: 40 },
            xaxis: { title: 'Feature 1', range: [0, 1] },
            yaxis: { title: 'Feature 2', range: [0, 1] },
            legend: { orientation: 'h' },
            hovermode: 'closest',
          }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
        />
      </Box>

      <Box sx={{ mt: 2, width: '100%', maxWidth: 600 }}>
        <Typography variant="subtitle2" gutterBottom>
          Active Visualization Elements:
        </Typography>
        <Typography variant="body2">
          • Current Tree: Tree {currentStep + 1}
          <br />• Predictions Visible: {showPredictions ? 'Yes' : 'No'}
          <br />• Residuals Visible: {showResiduals ? 'Yes' : 'No'}
        </Typography>
      </Box>
    </Box>
  );
};

export default BoostingProcessVisualization;
