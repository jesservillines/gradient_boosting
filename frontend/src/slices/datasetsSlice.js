import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Async thunks
export const fetchDatasets = createAsyncThunk('datasets/fetchDatasets', async () => {
  const response = await axios.get(`${API_URL}/datasets`);
  return response.data;
});

export const fetchDatasetInfo = createAsyncThunk('datasets/fetchDatasetInfo', async (datasetName) => {
  const response = await axios.get(`${API_URL}/datasets/${datasetName}`);
  return response.data;
});

const initialState = {
  availableDatasets: [],
  datasetDetails: {},
  selectedDataset: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const datasetsSlice = createSlice({
  name: 'datasets',
  initialState,
  reducers: {
    setSelectedDataset: (state, action) => {
      state.selectedDataset = action.payload;
    },
    clearSelectedDataset: (state) => {
      state.selectedDataset = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatasets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDatasets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.availableDatasets = action.payload.datasets;
        state.datasetDetails = action.payload.details || {};
      })
      .addCase(fetchDatasets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchDatasetInfo.fulfilled, (state, action) => {
        const dataset = action.payload;
        state.datasetDetails[dataset.name] = dataset;
      });
  }
});

export const { setSelectedDataset, clearSelectedDataset } = datasetsSlice.actions;

export default datasetsSlice.reducer;
