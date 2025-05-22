import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const CatBoostMathFormula = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        CatBoost Ordered Boosting
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        CatBoost uses a permutation-driven ordered boosting approach to fight prediction shift and target leakage:
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Ordered Boosting Process:</strong>
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          1. Generate multiple random permutations of the training dataset
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          2. For each sample in a permutation, build a model using only the samples that come before it
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          3. Use this model to calculate the gradient for the current sample
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          4. This ensures no data point "sees" its own label information during training
        </Typography>
      </Paper>
      
      <Typography variant="h6" gutterBottom>
        Ordered Target Statistics for Categorical Features
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        CatBoost uses an innovative approach to handle categorical features, converting them to numerical values using ordered target statistics:
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', mb: 3, fontFamily: 'monospace' }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          CatEncoding(value) = (Σ_prev y + α · ȳ) / (count(prev) + α)
        </Typography>
      </Paper>
      
      <Typography variant="body2" sx={{ mb: 3 }}>
        <strong>Where:</strong>
        <ul>
          <li>Σ_prev y is the sum of target values for previous examples with this category value</li>
          <li>count(prev) is the count of previous examples with this category value</li>
          <li>ȳ is the global average target value</li>
          <li>α is a prior weight parameter</li>
        </ul>
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2 }}>
        Importantly, "previous examples" refers to instances that come before the current one in the permutation, preventing target leakage.
      </Typography>
      
      <Typography variant="h6" gutterBottom>
        Symmetric Trees
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        CatBoost by default uses symmetric (oblivious) decision trees:
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Properties of Symmetric Trees:</strong>
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          1. All nodes at the same tree level use the same splitting feature and threshold
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          2. This creates a balanced tree where all leaves are at the same depth
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          3. A tree of depth d has exactly 2^d leaves
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          4. This structure allows for faster inference and can act as a form of regularization
        </Typography>
      </Paper>
      
      <Typography variant="h6" gutterBottom>
        Loss Function and Regularization
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        CatBoost optimizes a similar objective function to other gradient boosting algorithms:
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', mb: 3, fontFamily: 'monospace' }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          L = Σ L(y_i, ŷ_i) + Σ Ω(T_j)
               i             j
        </Typography>
      </Paper>
      
      <Typography variant="body2" sx={{ mb: 3 }}>
        <strong>Where:</strong>
        <ul>
          <li>L(y_i, ŷ_i) is the loss function (e.g., logloss for classification, RMSE for regression)</li>
          <li>Ω(T_j) is the regularization term for tree j</li>
          <li>CatBoost primarily uses L2 regularization on leaf values with a parameter l2_leaf_reg</li>
        </ul>
      </Typography>
      
      <Typography variant="h6" gutterBottom>
        Random Splitting in CatBoost
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        CatBoost uses randomization to help prevent overfitting:
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Randomization Techniques:</strong>
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          1. random_strength parameter adds randomness to split selection
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          2. Feature combinations can be randomly generated to capture interactions
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          3. Bagging temperature controls the intensity of Bayesian bagging
        </Typography>
      </Paper>
      
      <Typography variant="body1">
        These mathematical concepts combine to make CatBoost particularly effective for handling categorical data while avoiding overfitting and target leakage issues that can affect other gradient boosting implementations.
      </Typography>
    </Box>
  );
};

export default CatBoostMathFormula;
