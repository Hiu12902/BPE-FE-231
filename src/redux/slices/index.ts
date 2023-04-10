import comparingSlice from './comparing';
import evaluatedResultSlice from './evaluateResult';
import lintingSlice from './linting';
import modelSlice from './model';
import tabsSlice from './tabs';
import toolSlice from './tool';

const toolSliceActions = toolSlice.actions;
const tabsSliceActions = tabsSlice.actions;
const evaluatedResultActions = evaluatedResultSlice.actions;
const lintingActions = lintingSlice.actions;
const modelActions = modelSlice.actions;
const comparingActions = comparingSlice.actions;

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
};
