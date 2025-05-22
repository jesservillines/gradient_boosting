import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import Plot from 'react-plotly.js';

/**
 * A component to visualize an individual decision tree in the ensemble
 * Currently a placeholder - will be implemented with D3.js
 */
const TreeVisualization = ({ algorithm, treeIndex }) => {
  // Build a mock tree structure once per algorithm + treeIndex
  const treemapData = useMemo(() => {
    /* Simple binary tree – depth 2 with synthetic gain/leaf metrics */
    const nodes = [
      { id: 'root', label: `Tree ${treeIndex + 1}`, parent: '', value: 6, type: 'root', metric: 0 },
      { id: 'n1', label: 'feature1 < 0.5', parent: 'root', value: 3, type: 'split', metric: 0.35 },
      { id: 'n2', label: 'feature2 < 0.3', parent: 'root', value: 3, type: 'split', metric: 0.28 },
      { id: 'l1', label: 'leaf -0.2', parent: 'n1', value: 1, type: 'leaf', metric: -0.2 },
      { id: 'l2', label: 'leaf 0.4', parent: 'n1', value: 1, type: 'leaf', metric: 0.4 },
      { id: 'l3', label: 'leaf -0.1', parent: 'n2', value: 1, type: 'leaf', metric: -0.1 },
      { id: 'l4', label: 'leaf 0.6', parent: 'n2', value: 1, type: 'leaf', metric: 0.6 },
    ];

    const ids = nodes.map((n) => n.id);
    const labels = nodes.map((n) => (n.type === 'split' ? `Split: ${n.label}` : n.label));
    const parents = nodes.map((n) => n.parent);
    const values = nodes.map((n) => n.value);
    const metrics = nodes.map((n) => n.metric);

    return [
      {
        type: 'treemap',
        ids,
        labels,
        parents,
        values,
        marker: {
          colors: metrics,
          colorscale: 'RdBu',
          cmid: 0,
        },
        textinfo: 'label',
        branchvalues: 'total',
        hovertemplate:
          '<b>%{label}</b><br>Gain/Leaf value: %{marker.color:.2f}<br>Samples: %{value}<extra></extra>',
      },
    ];
  }, [treeIndex]);

  return (
    <Box className="visualization-container" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', p: 3 }}>
      <Typography variant="h6" gutterBottom textAlign="center">
        {algorithm.toUpperCase()} Tree Structure – Tree {treeIndex + 1}
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 600, height: 400 }}>
        <Plot
          data={treemapData}
          layout={{
            margin: { t: 10, l: 10, r: 10, b: 10 },
            hovermode: 'closest',
          }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
        />
      </Box>

      <Box sx={{ mt: 2, width: '100%' }}>
        <Typography variant="subtitle2" gutterBottom>
          Tree Features:
        </Typography>
        <Typography variant="body2">
          {algorithm === 'xgboost' && (
            <>
              • Split Type: Exact greedy algorithm<br />• Split Criterion: Gain (reduction in loss + regularization)<br />• Leaf Values: Calculated using first and second derivatives
            </>
          )}
          {algorithm === 'lightgbm' && (
            <>
              • Split Type: Histogram-based<br />• Tree Growth: Leaf-wise<br />• Split Criterion: Variance reduction
            </>
          )}
          {algorithm === 'catboost' && (
            <>
              • Split Type: Oblivious (symmetric)<br />• Split Criterion: Information gain<br />• Categorical Features: Target statistics encoding
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default TreeVisualization;
