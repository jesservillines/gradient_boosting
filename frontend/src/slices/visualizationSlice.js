import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Boosting process visualization settings
  boostingVisualization: {
    mode: 'sequential', // 'sequential' | 'residual' | 'contribution'
    currentStep: 0,
    showPredictions: true,
    showResiduals: true,
    animationSpeed: 1000 // milliseconds
  },
  
  // Tree visualization settings  
  treeVisualization: {
    layout: 'horizontal', // 'horizontal' | 'vertical' | 'radial'
    showValues: true,
    showSplitInfo: true,
    highlightPath: true
  },
  
  // Feature importance visualization
  featureVisualization: {
    mode: 'gain', // 'gain' | 'split' | 'shap'
    sortBy: 'importance', // 'importance' | 'name'
    direction: 'desc', // 'asc' | 'desc'
    topN: 10
  },
  
  // Hyperparameter visualization
  hyperparameterVisualization: {
    selectedParameter: null,
    compareMode: false,
    baselineModel: null,
    showImpact: true
  }
};

const visualizationSlice = createSlice({
  name: 'visualization',
  initialState,
  reducers: {
    // Boosting visualization actions
    setBoostingMode: (state, action) => {
      state.boostingVisualization.mode = action.payload;
    },
    setCurrentStep: (state, action) => {
      state.boostingVisualization.currentStep = action.payload;
    },
    incrementStep: (state) => {
      state.boostingVisualization.currentStep += 1;
    },
    decrementStep: (state) => {
      if (state.boostingVisualization.currentStep > 0) {
        state.boostingVisualization.currentStep -= 1;
      }
    },
    togglePredictions: (state) => {
      state.boostingVisualization.showPredictions = !state.boostingVisualization.showPredictions;
    },
    toggleResiduals: (state) => {
      state.boostingVisualization.showResiduals = !state.boostingVisualization.showResiduals;
    },
    setAnimationSpeed: (state, action) => {
      state.boostingVisualization.animationSpeed = action.payload;
    },
    
    // Tree visualization actions
    setTreeLayout: (state, action) => {
      state.treeVisualization.layout = action.payload;
    },
    toggleTreeValues: (state) => {
      state.treeVisualization.showValues = !state.treeVisualization.showValues;
    },
    toggleSplitInfo: (state) => {
      state.treeVisualization.showSplitInfo = !state.treeVisualization.showSplitInfo;
    },
    toggleHighlightPath: (state) => {
      state.treeVisualization.highlightPath = !state.treeVisualization.highlightPath;
    },
    
    // Feature importance actions
    setFeatureMode: (state, action) => {
      state.featureVisualization.mode = action.payload;
    },
    setSortBy: (state, action) => {
      state.featureVisualization.sortBy = action.payload;
    },
    toggleSortDirection: (state) => {
      state.featureVisualization.direction = state.featureVisualization.direction === 'asc' ? 'desc' : 'asc';
    },
    setTopN: (state, action) => {
      state.featureVisualization.topN = action.payload;
    },
    
    // Hyperparameter visualization actions
    setSelectedParameter: (state, action) => {
      state.hyperparameterVisualization.selectedParameter = action.payload;
    },
    toggleCompareMode: (state) => {
      state.hyperparameterVisualization.compareMode = !state.hyperparameterVisualization.compareMode;
    },
    setBaselineModel: (state, action) => {
      state.hyperparameterVisualization.baselineModel = action.payload;
    },
    toggleImpact: (state) => {
      state.hyperparameterVisualization.showImpact = !state.hyperparameterVisualization.showImpact;
    }
  }
});

export const {
  setBoostingMode, setCurrentStep, incrementStep, decrementStep,
  togglePredictions, toggleResiduals, setAnimationSpeed,
  setTreeLayout, toggleTreeValues, toggleSplitInfo, toggleHighlightPath,
  setFeatureMode, setSortBy, toggleSortDirection, setTopN,
  setSelectedParameter, toggleCompareMode, setBaselineModel, toggleImpact
} = visualizationSlice.actions;

export default visualizationSlice.reducer;
