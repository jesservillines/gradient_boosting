import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import Plot from 'react-plotly.js';

/**
 * HyperparameterImpactVisualization
 * ---------------------------------
 * This component visualizes how changing a single hyperparameter impacts model
 * performance. Because we do not have backend-generated curves yet, the plot
 * displays a synthetic but reasonable "U-shaped" performance curve that peaks
 * close to the centre of the parameter range. The user-selected value is
 * highlighted with a vertical dashed line so that users can see where the
 * current value lies on the curve.
 *
 * Props
 * ------
 * algorithm     – string  : "xgboost" | "lightgbm" | "catboost"
 * paramName     – string  : name of the parameter being inspected
 * currentValue  – number  : current value selected by the user
 * min           – number  : minimum value allowed for the parameter
 * max           – number  : maximum value allowed for the parameter
 */
const HyperparameterImpactVisualization = ({
  algorithm,
  paramName,
  currentValue,
  min,
  max,
}) => {
  // Generate a synthetic performance curve only once per prop change
  const { xs, ys } = useMemo(() => {
    const N = 80;
    const step = (max - min) / (N - 1);
    const mid = (min + max) / 2;
    const scale = 0.8; // controls steepness of the curve

    const xVals = Array.from({ length: N }, (_, i) => min + i * step);
    const yVals = xVals.map((x) => {
      // Quadratic bowl peaking at "mid"
      const norm = (x - mid) / (max - min);
      const perf = 1 - scale * norm ** 2;
      // Clamp to [0, 1]
      return Math.max(0, Math.min(1, perf));
    });

    return { xs: xVals, ys: yVals };
  }, [min, max]);

  // Create Plotly traces & layout
  const data = [
    {
      x: xs,
      y: ys,
      type: 'scatter',
      mode: 'lines',
      line: { color: '#1976d2', width: 3 },
      name: 'Estimated Performance',
    },
    {
      x: [currentValue],
      y: [0.95],
      type: 'scatter',
      mode: 'markers',
      marker: { size: 10, color: 'red' },
      showlegend: false,
      hovertemplate: `${paramName}: %{x}<extra></extra>`,
    },
  ];

  const layout = {
    margin: { l: 45, r: 20, t: 20, b: 40 },
    xaxis: {
      title: paramName,
      range: [min, max],
    },
    yaxis: {
      title: 'Relative Performance',
      range: [0, 1],
    },
    shapes: [
      {
        type: 'line',
        x0: currentValue,
        x1: currentValue,
        y0: 0,
        y1: 1,
        xref: 'x',
        yref: 'paper',
        line: { color: 'red', width: 2, dash: 'dashdot' },
      },
    ],
    hovermode: 'closest',
    responsive: true,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        p: 2,
      }}
    >
      <Typography variant="h6" gutterBottom textAlign="center">
        {algorithm.toUpperCase()} Parameter Impact: {paramName}
      </Typography>

      <Plot
        data={data}
        layout={layout}
        style={{ width: '100%', height: 350 }}
        config={{ displayModeBar: false, responsive: true }}
      />

      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        sx={{ mt: 2 }}
      >
        Current value: {currentValue} (Range: {min} – {max})
      </Typography>
    </Box>
  );
};

export default HyperparameterImpactVisualization;
