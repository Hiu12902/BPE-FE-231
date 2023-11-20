import { combineReducers } from '@reduxjs/toolkit';
import {
  comparingSlice,
  evaluatedResultSlice,
  lintingSlice,
  membersSlice,
  modelSlice,
  notificationSlice,
  pinnedWorkspaceSlice,
  projectSlice,
  requestsSlice,
  toolSlice,
  userSlice,
  workspaceSlice
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
  [workspaceSlice.name]: workspaceSlice.reducer,
  [pinnedWorkspaceSlice.name]: pinnedWorkspaceSlice.reducer,
  [membersSlice.name]: membersSlice.reducer,
  [requestsSlice.name]: requestsSlice.reducer,
  [notificationSlice.name]: notificationSlice.reducer,
});

export default rootReducer;
