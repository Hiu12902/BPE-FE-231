import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { TOOLBAR_MODE } from '@/constants/toolbar';
import { SIMULATION_CASE_MODE } from '@/core/toolbar/constants/simulation';

interface ToolProps {
  toolbarMode: TOOLBAR_MODE;
  simulationMode: SIMULATION_CASE_MODE;
  elementSelected: any;
  currentEvent: any;
  currentScope: any;
}

const toolSlice = createSlice({
  name: 'tool',
  initialState: {} as ToolProps,
  reducers: {
    setToolbarMode: (state, action: PayloadAction<TOOLBAR_MODE>) => {
      state.toolbarMode = action.payload;
    },
    setSimulationMode: (state, action: PayloadAction<SIMULATION_CASE_MODE>) => {
      state.simulationMode = action.payload;
    },
    setElementSelected: (state, action: PayloadAction<any>) => {
      state.elementSelected = action.payload;
    },
    setCurrentEvent: (state, action: PayloadAction<any>) => {
      state.currentEvent = action.payload;
    },
    setCurrentScope: (state, action: PayloadAction<any>) => {
      state.currentScope = action.payload;
    },
  },
});

export default toolSlice;
