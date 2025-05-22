import { configureStore } from '@reduxjs/toolkit';
import datasetsReducer from './slices/datasetsSlice';
import modelsReducer from './slices/modelsSlice';
import visualizationReducer from './slices/visualizationSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    datasets: datasetsReducer,
    models: modelsReducer,
    visualization: visualizationReducer,
    ui: uiReducer,
  },
});
