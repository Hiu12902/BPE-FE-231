import comparingSlice from './comparing';
import evaluatedResultSlice from './evaluateResult';
import lintingSlice from './linting';
import modelSlice from './model';
import projectSlice from './project';
import tabsSlice from './tabs';
import toolSlice from './tool';
import userSlice from './user';

const toolSliceActions = toolSlice.actions;
const tabsSliceActions = tabsSlice.actions;
const evaluatedResultActions = evaluatedResultSlice.actions;
const lintingActions = lintingSlice.actions;
const modelActions = modelSlice.actions;
const comparingActions = comparingSlice.actions;
const userActions = userSlice.actions;
const projectActions = projectSlice.actions;

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
};
