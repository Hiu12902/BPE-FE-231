import comparingSlice from './comparing';
import evaluatedResultSlice from './evaluateResult';
import lintingSlice from './linting';
import membersSlice from './members';
import modelSlice from './model';
import pinnedWorkspaceSlice from './pinnedWorkspace';
import projectSlice from './project';
import requestsSlice from './requests';
import tabsSlice from './tabs';
import toolSlice from './tool';
import userSlice from './user';
import workspaceSlice from './workspaces';

const toolSliceActions = toolSlice.actions;
const tabsSliceActions = tabsSlice.actions;
const evaluatedResultActions = evaluatedResultSlice.actions;
const lintingActions = lintingSlice.actions;
const modelActions = modelSlice.actions;
const comparingActions = comparingSlice.actions;
const userActions = userSlice.actions;
const projectActions = projectSlice.actions;
const workspaceActions = workspaceSlice.actions;
const pinnedWorkspaceActions = pinnedWorkspaceSlice.actions;
const membersActions = membersSlice.actions;
const requestsActions = requestsSlice.actions;

export {
  toolSliceActions,
  toolSlice,
  tabsSliceActions,
  tabsSlice,
  evaluatedResultActions,
  evaluatedResultSlice,
  lintingActions,
  lintingSlice,
  modelActions,
  modelSlice,
  comparingActions,
  comparingSlice,
  userActions,
  userSlice,
  projectActions,
  projectSlice,
  workspaceSlice,
  workspaceActions,
  pinnedWorkspaceSlice,
  pinnedWorkspaceActions,
  membersSlice,
  membersActions,
  requestsSlice,
  requestsActions,
};
