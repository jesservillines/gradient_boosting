import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Chip, Slider, FormControlLabel, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';

const TreeContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const TreeVisualization = ({ algorithm = 'xgboost', treeIndex = 0, showValues: initialShowValues = true }) => {
  const svgRef = useRef(null);
  const [treeDepth, setTreeDepth] = useState(3);
  const [showNodeInfo, setShowNodeInfo] = useState(true);
  const [showValues, setShowValues] = useState(initialShowValues);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Generate tree structure based on algorithm
  const generateTreeStructure = (depth, nodeId = 'root') => {
    if (depth === 0) {
      return {
        id: nodeId,
        value: (Math.random() * 0.2 - 0.1).toFixed(3),
        samples: Math.floor(Math.random() * 50) + 10,
        isLeaf: true,
      };
    }

    const splitValue = (Math.random() * 0.8 + 0.1).toFixed(2);
    const featureIndex = Math.floor(Math.random() * 5);
    
    return {
      id: nodeId,
      feature: `Feature ${featureIndex}`,
      splitValue: splitValue,
      samples: Math.floor(Math.random() * 100) + 50,
      gain: (Math.random() * 0.5).toFixed(3),
      isLeaf: false,
      left: generateTreeStructure(depth - 1, `${nodeId}-L`),
      right: generateTreeStructure(depth - 1, `${nodeId}-R`),
    };
  };

  const treeData = generateTreeStructure(treeDepth);

  // Draw tree using SVG
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    
    // Clear previous content
    svg.innerHTML = '';

    // Algorithm-specific colors
    const colors = {
      xgboost: { node: '#FF6B6B', leaf: '#4ECDC4', line: '#666' },
      lightgbm: { node: '#45B7D1', leaf: '#F7DC6F', line: '#666' },
      catboost: { node: '#BB8FCE', leaf: '#85C1E2', line: '#666' }
    };

    const currentColors = colors[algorithm] || colors.xgboost;

    // Calculate positions
    const nodePositions = {};
    const nodeRadius = 30;
    const levelHeight = height / (treeDepth + 1);

    const calculatePositions = (node, x, y, spread) => {
      nodePositions[node.id] = { x, y, node };

      if (!node.isLeaf) {
        const childSpread = spread / 2;
        calculatePositions(node.left, x - spread, y + levelHeight, childSpread);
        calculatePositions(node.right, x + spread, y + levelHeight, childSpread);
      }
    };

    calculatePositions(treeData, width / 2, 50, width / 4);

    // Create SVG elements
    const ns = 'http://www.w3.org/2000/svg';
    
    // Draw connections
    Object.values(nodePositions).forEach(({ x, y, node }) => {
      if (!node.isLeaf) {
        const leftPos = nodePositions[node.left.id];
        const rightPos = nodePositions[node.right.id];

        // Left connection
        const leftLine = document.createElementNS(ns, 'line');
        leftLine.setAttribute('x1', x);
        leftLine.setAttribute('y1', y);
        leftLine.setAttribute('x2', leftPos.x);
        leftLine.setAttribute('y2', leftPos.y);
        leftLine.setAttribute('stroke', currentColors.line);
        leftLine.setAttribute('stroke-width', '2');
        leftLine.setAttribute('opacity', '0.6');
        svg.appendChild(leftLine);

        // Right connection
        const rightLine = document.createElementNS(ns, 'line');
        rightLine.setAttribute('x1', x);
        rightLine.setAttribute('y1', y);
        rightLine.setAttribute('x2', rightPos.x);
        rightLine.setAttribute('y2', rightPos.y);
        rightLine.setAttribute('stroke', currentColors.line);
        rightLine.setAttribute('stroke-width', '2');
        rightLine.setAttribute('opacity', '0.6');
        svg.appendChild(rightLine);
      }
    });

    // Draw nodes
    Object.values(nodePositions).forEach(({ x, y, node }) => {
      const g = document.createElementNS(ns, 'g');
      g.setAttribute('transform', `translate(${x}, ${y})`);
      g.style.cursor = 'pointer';

      // Node circle
      const circle = document.createElementNS(ns, 'circle');
      circle.setAttribute('r', nodeRadius);
      circle.setAttribute('fill', node.isLeaf ? currentColors.leaf : currentColors.node);
      circle.setAttribute('stroke', 'white');
      circle.setAttribute('stroke-width', '2');
      
      // Add hover effect
      circle.addEventListener('mouseenter', () => {
        circle.setAttribute('r', nodeRadius + 5);
        setHoveredNode(node);
      });
      
      circle.addEventListener('mouseleave', () => {
        circle.setAttribute('r', nodeRadius);
        setHoveredNode(null);
      });

      g.appendChild(circle);

      // Node text
      if (showNodeInfo) {
        const text = document.createElementNS(ns, 'text');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dy', '0.3em');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');

        if (node.isLeaf) {
          text.textContent = node.value;
        } else {
          text.textContent = node.feature.replace('Feature ', 'F');
        }
        
        g.appendChild(text);

        // Split value for non-leaf nodes
        if (!node.isLeaf && showValues) {
          const splitText = document.createElementNS(ns, 'text');
          splitText.setAttribute('text-anchor', 'middle');
          splitText.setAttribute('dy', '1.5em');
          splitText.setAttribute('fill', 'white');
          splitText.setAttribute('font-size', '10');
          splitText.textContent = `< ${node.splitValue}`;
          g.appendChild(splitText);
        }
      }

      svg.appendChild(g);
    });

  }, [algorithm, treeData, treeDepth, showNodeInfo, showValues]);

  return (
    <TreeContainer elevation={2}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Decision Tree Structure - {algorithm.toUpperCase()} Tree #{treeIndex + 1}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          This visualization shows how the gradient boosting tree makes decisions by splitting data at each node.
        </Typography>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" gutterBottom>Tree Depth: {treeDepth}</Typography>
          <Slider
            value={treeDepth}
            onChange={(e, v) => setTreeDepth(v)}
            min={1}
            max={5}
            marks
            size="small"
          />
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={showNodeInfo}
              onChange={(e) => setShowNodeInfo(e.target.checked)}
              size="small"
            />
          }
          label="Show Info"
        />
        <FormControlLabel
          control={
            <Switch
              checked={showValues}
              onChange={(e) => setShowValues(e.target.checked)}
              size="small"
            />
          }
          label="Show Values"
        />
      </Box>

      <Box sx={{ flex: 1, position: 'relative', minHeight: 400 }}>
        <svg
          ref={svgRef}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
          }}
        />
      </Box>

      {hoveredNode && (
        <Paper
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            p: 2,
            maxWidth: 300,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
          elevation={3}
        >
          <Typography variant="subtitle2" gutterBottom>
            Node Information
          </Typography>
          {hoveredNode.isLeaf ? (
            <>
              <Typography variant="body2">Type: Leaf Node</Typography>
              <Typography variant="body2">Value: {hoveredNode.value}</Typography>
              <Typography variant="body2">Samples: {hoveredNode.samples}</Typography>
            </>
          ) : (
            <>
              <Typography variant="body2">Type: Decision Node</Typography>
              <Typography variant="body2">Feature: {hoveredNode.feature}</Typography>
              <Typography variant="body2">Split: &lt; {hoveredNode.splitValue}</Typography>
              <Typography variant="body2">Gain: {hoveredNode.gain}</Typography>
              <Typography variant="body2">Samples: {hoveredNode.samples}</Typography>
            </>
          )}
        </Paper>
      )}

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Understanding the Tree
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            size="small"
            label="Decision Nodes"
            sx={{ backgroundColor: colors[algorithm]?.node || '#FF6B6B', color: 'white' }}
          />
          <Chip
            size="small"
            label="Leaf Nodes"
            sx={{ backgroundColor: colors[algorithm]?.leaf || '#4ECDC4', color: 'white' }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {algorithm === 'xgboost' && 
            "XGBoost trees use second-order gradients for split decisions. Each split aims to maximize the gain calculated from gradient and hessian values."}
          {algorithm === 'lightgbm' && 
            "LightGBM grows trees leaf-wise, choosing the leaf with max delta loss to grow. This can create deeper, more complex trees."}
          {algorithm === 'catboost' && 
            "CatBoost uses oblivious trees where the same splitting criterion is used across all nodes at the same level."}
        </Typography>
      </Box>
    </TreeContainer>
  );
};

// Color definitions for use in hover info
const colors = {
  xgboost: { node: '#FF6B6B', leaf: '#4ECDC4', line: '#666' },
  lightgbm: { node: '#45B7D1', leaf: '#F7DC6F', line: '#666' },
  catboost: { node: '#BB8FCE', leaf: '#85C1E2', line: '#666' }
};

export default TreeVisualization;
