import React, { useMemo } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import Plot from 'react-plotly.js';

/**
 * ModelPerformanceVisualization
 * -----------------------------
 * Renders an interactive Plotly bar chart of common evaluation metrics
 * (accuracy, precision, recall, F1, AUC, training time). When a baseline set
 * of parameters is provided, the chart shows the baseline metrics side-by-side
 * for comparison, and a secondary table lists metric values.
 *
 * Note: In lieu of backend-provided metrics, this component derives synthetic
 * scores from the parameter values. Each time params change (or the user
 * retrains), a new set of scores is deterministically generated so the chart
 * updates and users receive visual feedback.
 */
const ModelPerformanceVisualization = ({
  algorithm,
  params,
  baselineParams,
  isTraining,
}) => {
  // Helper to deterministically generate pseudo-metrics from params
  const computeMetrics = (p) => {
    if (!p) return null;

    // Create a pseudo-random seed from param values
    const seed = Object.values(p)
      .map((v) => {
        const n = Number(v);
        if (Number.isNaN(n)) return 0;
        return n;
      })
      .reduce((acc, n) => acc + n, 0);

    const rand = (offset) => {
      // Simple LCG based on seed
      const x = Math.sin(seed * 1000 + offset) * 10000;
      return x - Math.floor(x);
    };

    return {
      accuracy: 0.82 + 0.15 * rand(1),
      precision: 0.8 + 0.17 * rand(2),
      recall: 0.8 + 0.18 * rand(3),
      f1: 0.8 + 0.16 * rand(4),
      auc: 0.85 + 0.14 * rand(5),
      training_time: 0.5 + 3.0 * rand(6), // seconds
    };
  };

  const metrics = useMemo(() => computeMetrics(params), [params]);
  const baselineMetrics = useMemo(() => computeMetrics(baselineParams), [baselineParams]);

  if (isTraining) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 350,
          p: 2,
        }}
      >
        <CircularProgress sx={{ mb: 3 }} />
        <Typography variant="h6">Training {algorithm}...</Typography>
        <Typography variant="body2" color="text.secondary">
          This may take a few moments
        </Typography>
      </Box>
    );
  }

  if (!metrics) {
    return null;
  }

  const metricNames = ['Accuracy', 'Precision', 'Recall', 'F1', 'AUC', 'Train Time (s)'];
  const metricKeys = ['accuracy', 'precision', 'recall', 'f1', 'auc', 'training_time'];

  const data = [
    {
      x: metricNames,
      y: metricKeys.map((k) => metrics[k]),
      type: 'bar',
      name: 'Current',
      marker: { color: '#1976d2' },
    },
  ];

  if (baselineMetrics) {
    data.push({
      x: metricNames,
      y: metricKeys.map((k) => baselineMetrics[k]),
      type: 'bar',
      name: 'Baseline',
      marker: { color: '#888' },
    });
  }

  const layout = {
    barmode: 'group',
    margin: { l: 40, r: 20, t: 30, b: 60 },
    yaxis: {
      title: 'Score',
      rangemode: 'tozero',
    },
    legend: { orientation: 'h', y: -0.25 },
    responsive: true,
  };

  return (
    <Box sx={{ width: '100%', p: 1 }}>
      <Typography variant="h6" gutterBottom textAlign="center">
        {algorithm.toUpperCase()} Performance Metrics
      </Typography>

      {baselineParams && (
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
          Comparing current parameters with baseline
        </Typography>
      )}

      {/* Chart */}
      <Paper
        elevation={0}
        sx={{ p: 2, border: '1px solid #e0e0e0', mb: 3 }}
      >
        <Plot
          data={data}
          layout={layout}
          style={{ width: '100%', height: 350 }}
          config={{ displayModeBar: false, responsive: true }}
        />
      </Paper>

      {/* Metrics Table */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={baselineParams ? 6 : 12}>
          <Typography variant="subtitle2" gutterBottom>
            Current Model Metrics
          </Typography>
          {metricKeys.map((k, idx) => (
            <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">{metricNames[idx]}:</Typography>
              <Typography variant="body2" fontWeight="bold">
                {metrics[k].toFixed(k === 'training_time' ? 2 : 4)}
              </Typography>
            </Box>
          ))}
        </Grid>

        {baselineParams && (
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Baseline Model Metrics
            </Typography>
            {metricKeys.map((k, idx) => (
              <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">{metricNames[idx]}:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {baselineMetrics[k].toFixed(k === 'training_time' ? 2 : 4)}
                </Typography>
              </Box>
            ))}
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ModelPerformanceVisualization;
