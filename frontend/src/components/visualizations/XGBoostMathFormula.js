import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const XGBoostMathFormula = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        XGBoost Objective Function
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        XGBoost minimizes a regularized objective function that combines a loss function and a regularization term:
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', mb: 3, fontFamily: 'monospace' }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          L(ϕ) = Σ l(ŷᵢ, yᵢ) + Σ Ω(fₖ)
                 i=1       k=1
        </Typography>
      </Paper>
      
      <Typography variant="body1" sx={{ mb: 2 }}>
        where the regularization term is defined as:
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', mb: 3, fontFamily: 'monospace' }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          Ω(f) = γT + (1/2)λΣ wⱼ²
                          j=1
        </Typography>
      </Paper>
      
      <Typography variant="body2" sx={{ mb: 3 }}>
        <strong>Where:</strong>
        <ul>
          <li>l(ŷ, y) is the training loss (e.g., squared error or logistic loss)</li>
          <li>T is the number of leaves in the tree</li>
          <li>wⱼ is the weight of leaf j</li>
          <li>γ, λ are regularization parameters</li>
        </ul>
      </Typography>
      
      <Typography variant="h6" gutterBottom>
        Split Finding using Taylor Expansion
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        XGBoost uses a second-order Taylor expansion of the loss function to approximate the improvement in the objective:
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', mb: 3, fontFamily: 'monospace' }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          L̃⁽ᵗ⁾ ≈ Σ [gᵢf(xᵢ) + (1/2)hᵢ[f(xᵢ)]²] + Ω(f)
                i=1
        </Typography>
      </Paper>
      
      <Typography variant="body2" sx={{ mb: 3 }}>
        <strong>Where:</strong>
        <ul>
          <li>gᵢ = ∂ŷ⁽ᵗ⁻¹⁾l(yᵢ, ŷ⁽ᵗ⁻¹⁾) is the first derivative of the loss</li>
          <li>hᵢ = ∂²ŷ⁽ᵗ⁻¹⁾l(yᵢ, ŷ⁽ᵗ⁻¹⁾) is the second derivative of the loss</li>
        </ul>
      </Typography>
      
      <Typography variant="h6" gutterBottom>
        Optimal Leaf Weight
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        For a given tree structure, XGBoost computes the optimal leaf weight:
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', mb: 3, fontFamily: 'monospace' }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          w*ⱼ = -( Σ gᵢ ) / ( Σ hᵢ + λ )
                  i∈Iⱼ      i∈Iⱼ
        </Typography>
      </Paper>
      
      <Typography variant="h6" gutterBottom>
        Split Gain Formula
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        The gain for a potential split is calculated as:
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', mb: 3, fontFamily: 'monospace' }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          Gain = (1/2) [ (Σ gᵢ)² / (Σ hᵢ + λ) + (Σ gᵢ)² / (Σ hᵢ + λ) - (Σ gᵢ)² / (Σ hᵢ + λ) ] - γ
                         i∈IL          i∈IL       i∈IR        i∈IR      i∈I         i∈I
        </Typography>
      </Paper>
      
      <Typography variant="body2">
        <strong>Where:</strong>
        <ul>
          <li>I is the set of indices in the node being split</li>
          <li>IL and IR are the sets of indices in the left and right nodes after the split</li>
          <li>A split is only made if the gain is positive</li>
        </ul>
      </Typography>
    </Box>
  );
};

export default XGBoostMathFormula;
