import { combineReducers } from '@reduxjs/toolkit';
import { toolSlice } from '../slices';

const rootReducer = combineReducers({
  [toolSlice.name]: toolSlice.reducer,
});

export default rootReducer;
