import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const LightGBMMathFormula = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        LightGBM Histogram-Based Algorithm
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        LightGBM uses a histogram-based algorithm that discretizes continuous features into bins, significantly speeding up training:
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Histogram Creation Process:</strong>
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          1. Bin all features into discrete bins (e.g., 255 bins by default)
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          2. For each bin, calculate the sum of gradients and hessians of instances falling into the bin
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          3. Find the best split between bins by evaluating the split gain for each bin boundary
        </Typography>
      </Paper>
      
      <Typography variant="h6" gutterBottom>
        Leaf-Wise Tree Growth
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        LightGBM grows trees leaf-wise (best-first) instead of level-wise:
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Leaf-Wise Growth Strategy:</strong>
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          1. Start with a single leaf node (root)
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          2. At each step, identify the leaf with maximum delta loss 
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          3. Split only that leaf, not all leaves at the same level
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          4. Continue until reaching max_leaves or no further gains
        </Typography>
      </Paper>
      
      <Typography variant="h6" gutterBottom>
        Gradient-based One-Side Sampling (GOSS)
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        GOSS keeps all instances with large gradients and randomly samples instances with small gradients:
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', mb: 3, fontFamily: 'monospace' }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          // Sort instances by absolute gradient
          Sort instances by |g_i|
          
          // Keep top-a instances (e.g., a = 20%)
          Keep instances with largest |g_i|
          
          // Randomly sample b% from the remaining instances
          Randomly sample b% instances from small gradients
          
          // Amplify the sampled instances with small gradients
          Multiply weights of sampled small-gradient instances by (1-a)/b
        </Typography>
      </Paper>
      
      <Typography variant="h6" gutterBottom>
        Exclusive Feature Bundling (EFB)
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        EFB bundles mutually exclusive features (features that rarely take non-zero values simultaneously) to reduce feature dimensions:
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>EFB Algorithm:</strong>
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          1. Construct a graph where vertices are features and edges represent conflicts
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          2. Assign a conflict score for each pair of features based on their exclusivity
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          3. Bundle features using a greedy approach based on graph coloring algorithm
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          4. Merge bundled features into a single feature with guaranteed no information loss
        </Typography>
      </Paper>
      
      <Typography variant="h6" gutterBottom>
        Split Gain Calculation
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        The split gain in LightGBM follows a similar form to XGBoost, using the histogram bins:
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', mb: 3, fontFamily: 'monospace' }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          Gain = (1/2) * [ (Σ g_L)² / (Σ h_L + λ) + (Σ g_R)² / (Σ h_R + λ) - (Σ g)² / (Σ h + λ) ]
        </Typography>
      </Paper>
      
      <Typography variant="body2">
        <strong>Where:</strong>
        <ul>
          <li>g_L and h_L are the sums of gradients and hessians in the left node</li>
          <li>g_R and h_R are the sums of gradients and hessians in the right node</li>
          <li>g and h are the sums of gradients and hessians in the current node before splitting</li>
          <li>λ is the L2 regularization parameter</li>
        </ul>
      </Typography>
    </Box>
  );
};

export default LightGBMMathFormula;
