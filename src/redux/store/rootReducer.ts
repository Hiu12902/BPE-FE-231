import { combineReducers } from '@reduxjs/toolkit';
import { toolSlice } from '../slices';
import tabsSlice from '../slices/tabsSlice';

const rootReducer = combineReducers({
  [toolSlice.name]: toolSlice.reducer,
  [tabsSlice.name]: tabsSlice.reducer,
});

export default rootReducer;
