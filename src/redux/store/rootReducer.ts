import { combineReducers } from '@reduxjs/toolkit';
import { evaluatedResultSlice, toolSlice } from '../slices';
import tabsSlice from '../slices/tabs';

const rootReducer = combineReducers({
  [toolSlice.name]: toolSlice.reducer,
  [tabsSlice.name]: tabsSlice.reducer,
  [evaluatedResultSlice.name]: evaluatedResultSlice.reducer,
});

export default rootReducer;
