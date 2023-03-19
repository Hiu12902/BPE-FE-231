import { RootState } from '@/redux/store';

export const selectToolbarMode = (state: RootState) => state.tool.toolbarMode;

export const selectSimulationMode = (state: RootState) => state.tool.simulationMode;

export const selectElementSelected = (state: RootState) => state.tool.elementSelected;

export const selectCurrentEvent = (state: RootState) => state.tool.currentEvent;

export const selectCurrentScope = (state: RootState) => state.tool.currentScope;
