import React, { useMemo, useState } from 'react';
import { Box, Typography, Paper, Chip, Tooltip, IconButton, Alert } from '@mui/material';
import Plot from 'react-plotly.js';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
}));

/**
 * Enhanced component to visualize the gradient boosting process step by step
 * with educational content and interactive features
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
  const [showEducationalContent, setShowEducationalContent] = useState(true);

  // Algorithm-specific colors and styles
  const algorithmStyles = {
    xgboost: { primary: '#FF6B6B', secondary: '#4ECDC4', name: 'XGBoost' },
    lightgbm: { primary: '#45B7D1', secondary: '#F7DC6F', name: 'LightGBM' },
    catboost: { primary: '#BB8FCE', secondary: '#85C1E2', name: 'CatBoost' }
  };

  const currentStyle = algorithmStyles[algorithm] || algorithmStyles.xgboost;

  // Use provided points or generate synthetic
  const dataPoints = useMemo(() => {
    if (points && points.length) {
      return points.map((p, idx) => ({ x: p.x, y: p.y, target: p.target ?? 0 }));
    }
    // Generate more sophisticated synthetic data with clusters
    const pts = [];
    const TOTAL_POINTS = 300;
    
    // Create three clusters for classification
    if (datasetType === 'classification') {
      for (let i = 0; i < TOTAL_POINTS; i++) {
        const cluster = Math.floor(Math.random() * 3);
        let x, y, target;
        
        if (cluster === 0) {
          // Class 0 cluster (bottom-left)
          x = Math.random() * 0.4 + 0.1;
          y = Math.random() * 0.4 + 0.1;
          target = 0;
        } else if (cluster === 1) {
          // Class 1 cluster (top-right)
          x = Math.random() * 0.4 + 0.5;
          y = Math.random() * 0.4 + 0.5;
          target = 1;
        } else {
          // Mixed region (creates non-linear boundary)
          x = Math.random() * 0.8 + 0.1;
          y = Math.random() * 0.8 + 0.1;
          // Non-linear decision boundary
          target = (Math.sin(x * Math.PI * 2) + y) > 1 ? 1 : 0;
        }
        
        // Add some noise
        x += (Math.random() - 0.5) * 0.1;
        y += (Math.random() - 0.5) * 0.1;
        
        pts.push({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)), target });
      }
    } else {
      // Regression: create a non-linear pattern
      for (let i = 0; i < TOTAL_POINTS; i++) {
        const x = Math.random();
        const y = Math.sin(x * Math.PI * 2) * 0.3 + 0.5 + (Math.random() - 0.5) * 0.1;
        const target = y; // For regression, target is continuous
        pts.push({ x, y, target });
      }
    }
    
    return pts;
  }, [points, datasetType]);

  // Generate predictions that improve with each boosting step
  const { traces, metrics } = useMemo(() => {
    const stepProgress = Math.min(1, (currentStep + 1) / 10);
    
    // Create decision boundary that becomes more refined with each step
    const gridSize = 50;
    const xRange = [...Array(gridSize).keys()].map((i) => i / (gridSize - 1));
    const yRange = [...Array(gridSize).keys()].map((i) => i / (gridSize - 1));
    
    // Algorithm-specific decision boundary generation
    const z = yRange.map((y) =>
      xRange.map((x) => {
        if (algorithm === 'xgboost') {
          // XGBoost: Sharp, rectangular splits
          const raw = Math.sin(x * Math.PI * 2) + y - 1;
          const sharpness = 3 + stepProgress * 7; // Increases with steps
          return 1 / (1 + Math.exp(-sharpness * raw));
        } else if (algorithm === 'lightgbm') {
          // LightGBM: Leaf-wise growth, more irregular boundaries
          const raw = Math.sin(x * Math.PI * 2 + stepProgress) + y - 1;
          const noise = Math.sin(x * 10) * Math.cos(y * 10) * 0.1 * (1 - stepProgress);
          return 1 / (1 + Math.exp(-6 * (raw + noise) * stepProgress));
        } else {
          // CatBoost: Smoother boundaries with ordered boosting
          const raw = Math.sin(x * Math.PI * 2) + y - 1;
          const smooth = 0.8 + stepProgress * 0.2;
          return 1 / (1 + Math.exp(-5 * raw * stepProgress * smooth));
        }
      })
    );

    // Calculate predictions and residuals
    const predictions = dataPoints.map((p) => {
      // Start with poor predictions, improve over steps
      const baseAccuracy = 0.5;
      const stepAccuracy = baseAccuracy + (stepProgress * 0.45);
      
      // Algorithm-specific prediction patterns
      let pred;
      if (algorithm === 'xgboost') {
        // More aggressive corrections
        pred = Math.random() < stepAccuracy ? p.target : 1 - p.target;
      } else if (algorithm === 'lightgbm') {
        // Faster initial improvement
        const lgbAccuracy = baseAccuracy + (Math.pow(stepProgress, 0.7) * 0.45);
        pred = Math.random() < lgbAccuracy ? p.target : 1 - p.target;
      } else {
        // CatBoost: More stable, less overfitting
        const cbAccuracy = baseAccuracy + (stepProgress * 0.4);
        pred = Math.random() < cbAccuracy ? p.target : 1 - p.target;
      }
      
      return pred;
    });

    const residuals = predictions.map((pred, idx) => dataPoints[idx].target - pred);
    
    // Calculate metrics
    const accuracy = predictions.filter((pred, idx) => pred === dataPoints[idx].target).length / predictions.length;
    const loss = residuals.reduce((sum, r) => sum + r * r, 0) / residuals.length;

    // Custom data for hover
    const customData = dataPoints.map((p, idx) => [
      p.target,
      predictions[idx],
      residuals[idx].toFixed(3)
    ]);

    // Main scatter plot
    const scatterTrace = {
      x: dataPoints.map(p => p.x),
      y: dataPoints.map(p => p.y),
      mode: 'markers',
      marker: {
        size: 10,
        opacity: 0.8,
        color: (showPredictions ? predictions : dataPoints.map(p => p.target)).map(v =>
          v === 1 ? currentStyle.primary : currentStyle.secondary
        ),
        line: {
          color: 'white',
          width: 1
        }
      },
      customdata: customData,
      hovertemplate:
        '<b>Point Info</b><br>' +
        'Actual: %{customdata[0]}<br>' +
        'Predicted: %{customdata[1]}<br>' +
        'Residual: %{customdata[2]}<br>' +
        'X: %{x:.3f}<br>' +
        'Y: %{y:.3f}<extra></extra>',
      name: showPredictions ? 'Model Predictions' : 'True Labels',
    };

    // Decision boundary heatmap
    const heatmapTrace = {
      z,
      x: xRange,
      y: yRange,
      type: 'heatmap',
      colorscale: [
        [0, currentStyle.secondary],
        [0.5, 'white'],
        [1, currentStyle.primary]
      ],
      opacity: 0.3,
      showscale: false,
      hoverinfo: 'skip',
    };

    const tracesArray = [heatmapTrace, scatterTrace];

    // Add residual visualization
    let residualLines = [];
    if (showResiduals) {
      residuals.forEach((res, idx) => {
        if (Math.abs(res) > 0.01) {
          residualLines.push({
            type: 'line',
            x0: dataPoints[idx].x,
            y0: dataPoints[idx].y,
            x1: dataPoints[idx].x,
            y1: dataPoints[idx].y + res * 0.2, // Scale for visibility
            line: {
              color: res > 0 ? '#FF6B6B' : '#4ECDC4',
              width: 2,
            },
          });
        }
      });
      
      // Add residual magnitude indicators
      const residualTrace = {
        x: dataPoints.map(p => p.x),
        y: dataPoints.map(p => p.y),
        mode: 'markers',
        marker: {
          size: residuals.map(r => Math.abs(r) * 20 + 5),
          opacity: 0.3,
          color: 'black',
        },
        hoverinfo: 'skip',
        name: 'Residual Magnitude',
        showlegend: false,
      };
      
      tracesArray.push(residualTrace);
    }

    return {
      traces: tracesArray,
      metrics: { accuracy, loss },
      residualLines: showResiduals ? residualLines : []
    };
  }, [dataPoints, currentStep, showPredictions, showResiduals, algorithm, currentStyle]);

  // Educational content for each algorithm
  const getEducationalContent = () => {
    const content = {
      xgboost: {
        title: "XGBoost: Extreme Gradient Boosting",
        description: "XGBoost builds trees sequentially using second-order gradients (Hessian) for more accurate optimization.",
        keyPoints: [
          "Uses Taylor expansion up to second order for loss approximation",
          "Implements regularization (L1/L2) to prevent overfitting",
          "Employs column subsampling and shrinkage",
          `Step ${currentStep + 1}: Loss reduction ≈ ${(0.3 / (currentStep + 1)).toFixed(3)}`
        ]
      },
      lightgbm: {
        title: "LightGBM: Light Gradient Boosting Machine",
        description: "LightGBM uses histogram-based algorithms and leaf-wise tree growth for efficiency.",
        keyPoints: [
          "Grows trees leaf-wise (best-first) instead of level-wise",
          "Uses gradient-based one-side sampling (GOSS)",
          "Implements exclusive feature bundling (EFB)",
          `Step ${currentStep + 1}: Leaf complexity = ${3 + currentStep}`
        ]
      },
      catboost: {
        title: "CatBoost: Categorical Boosting",
        description: "CatBoost handles categorical features natively and uses ordered boosting to prevent overfitting.",
        keyPoints: [
          "Implements ordered boosting to reduce prediction shift",
          "Native categorical feature support without encoding",
          "Uses oblivious trees (symmetric) for faster prediction",
          `Step ${currentStep + 1}: Permutation ${currentStep + 1}/10 processed`
        ]
      }
    };
    
    return content[algorithm] || content.xgboost;
  };

  const educationalContent = getEducationalContent();

  return (
    <Box className="visualization-container" sx={{ height: '100%', p: 2 }}>
      {showEducationalContent && (
        <StyledPaper elevation={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">{educationalContent.title}</Typography>
            <Tooltip title="Toggle educational content">
              <IconButton
                size="small"
                onClick={() => setShowEducationalContent(false)}
                sx={{ color: 'white' }}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
            {educationalContent.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {educationalContent.keyPoints.map((point, idx) => (
              <Chip
                key={idx}
                label={point}
                size="small"
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            ))}
          </Box>
        </StyledPaper>
      )}

      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {currentStyle.name} Boosting Process – Iteration {currentStep + 1}/10
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip
              label={`Accuracy: ${(metrics.accuracy * 100).toFixed(1)}%`}
              color="success"
              variant="outlined"
            />
            <Chip
              label={`Loss: ${metrics.loss.toFixed(4)}`}
              color="error"
              variant="outlined"
            />
          </Box>
        </Box>

        <Box sx={{ width: '100%', height: 500 }}>
          <Plot
            data={traces}
            layout={{
              margin: { t: 10, l: 50, r: 10, b: 50 },
              xaxis: { 
                title: 'Feature 1',
                range: [-0.05, 1.05],
                gridcolor: '#e0e0e0'
              },
              yaxis: { 
                title: 'Feature 2',
                range: [-0.05, 1.05],
                gridcolor: '#e0e0e0'
              },
              legend: { 
                orientation: 'h',
                x: 0.5,
                xanchor: 'center',
                y: -0.15
              },
              hovermode: 'closest',
              plot_bgcolor: '#fafafa',
              shapes: metrics.residualLines,
              annotations: [
                {
                  x: 0.02,
                  y: 0.98,
                  xref: 'paper',
                  yref: 'paper',
                  text: `Tree ${currentStep + 1}`,
                  showarrow: false,
                  font: {
                    size: 16,
                    color: currentStyle.primary
                  },
                  bgcolor: 'white',
                  borderpad: 4
                }
              ]
            }}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler
            config={{ displayModeBar: false }}
          />
        </Box>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>What's happening:</strong> Each iteration adds a new tree that corrects the errors 
            (residuals) of the previous ensemble. Watch how the decision boundary becomes more refined 
            and the predictions improve with each step!
          </Typography>
        </Alert>
      </Paper>

      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Visualization Legend
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            size="small"
            sx={{ backgroundColor: currentStyle.primary, color: 'white' }}
            label="Class 1"
          />
          <Chip
            size="small"
            sx={{ backgroundColor: currentStyle.secondary, color: 'white' }}
            label="Class 0"
          />
          {showPredictions && (
            <Chip size="small" variant="outlined" label="Showing Predictions" />
          )}
          {showResiduals && (
            <Chip size="small" variant="outlined" label="Residual Magnitude: Circle Size" />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default BoostingProcessVisualization;
