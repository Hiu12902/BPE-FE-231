import { combineReducers } from '@reduxjs/toolkit';
import {
  comparingSlice,
  evaluatedResultSlice,
  lintingSlice,
  modelSlice,
  projectSlice,
  toolSlice,
  userSlice,
} from '../slices';
import tabsSlice from '../slices/tabs';

const rootReducer = combineReducers({
  [toolSlice.name]: toolSlice.reducer,
  [tabsSlice.name]: tabsSlice.reducer,
  [evaluatedResultSlice.name]: evaluatedResultSlice.reducer,
  [lintingSlice.name]: lintingSlice.reducer,
  [modelSlice.name]: modelSlice.reducer,
  [comparingSlice.name]: comparingSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [projectSlice.name]: projectSlice.reducer,
});

export default rootReducer;
