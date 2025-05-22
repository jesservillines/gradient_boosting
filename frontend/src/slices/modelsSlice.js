import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Async thunks
export const fetchModels = createAsyncThunk('models/fetchModels', async () => {
  const response = await axios.get(`${API_URL}/models`);
  return response.data;
});

export const fetchModelInfo = createAsyncThunk('models/fetchModelInfo', async (modelId) => {
  const response = await axios.get(`${API_URL}/models/${modelId}`);
  return response.data;
});

export const trainModel = createAsyncThunk('models/trainModel', async (trainingConfig) => {
  const response = await axios.post(`${API_URL}/train`, trainingConfig);
  return response.data;
});

export const visualizeTree = createAsyncThunk('models/visualizeTree', async ({ modelId, algorithm, treeIndex }) => {
  const response = await axios.post(`${API_URL}/visualize-tree`, {
    model_id: modelId,
    algorithm,
    tree_index: treeIndex
  });
  return response.data;
});

const initialState = {
  models: [],
  modelDetails: {},
  selectedModel: null,
  currentTreeVisualization: null,
  trainingStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const modelsSlice = createSlice({
  name: 'models',
  initialState,
  reducers: {
    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
    },
    clearSelectedModel: (state) => {
      state.selectedModel = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchModels cases
      .addCase(fetchModels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.models = action.payload.models;
      })
      .addCase(fetchModels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // fetchModelInfo cases
      .addCase(fetchModelInfo.fulfilled, (state, action) => {
        const modelInfo = action.payload;
        state.modelDetails[modelInfo.model_id] = modelInfo;
      })
      
      // trainModel cases
      .addCase(trainModel.pending, (state) => {
        state.trainingStatus = 'loading';
      })
      .addCase(trainModel.fulfilled, (state, action) => {
        state.trainingStatus = 'succeeded';
        const newModel = action.payload;
        state.models.push({
          model_id: newModel.model_id,
          algorithm: newModel.algorithm,
          dataset: newModel.dataset_name
        });
        state.modelDetails[newModel.model_id] = newModel;
        state.selectedModel = newModel.model_id;
      })
      .addCase(trainModel.rejected, (state, action) => {
        state.trainingStatus = 'failed';
        state.error = action.error.message;
      })
      
      // visualizeTree cases
      .addCase(visualizeTree.fulfilled, (state, action) => {
        state.currentTreeVisualization = action.payload;
      });
  }
});

export const { setSelectedModel, clearSelectedModel } = modelsSlice.actions;

export default modelsSlice.reducer;
