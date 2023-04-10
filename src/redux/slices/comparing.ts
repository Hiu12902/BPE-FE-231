import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface CompareResult {
  cost: number;
  cycleTime: number;
  exceptionHandling: number;
  flexibility: number;
  quality: number;
  transparency: {
    pl: number;
    view: string;
  }[];
}

interface ComparingProps {
  compareResult: CompareResult;
  toCompareDiagram: string;
  diagramComparedTo: string;
}

const comparingSlice = createSlice({
  name: 'comparing',
  initialState: {
    compareResult: {},
  } as ComparingProps,

  reducers: {
    setCompareResult: (state, action: PayloadAction<CompareResult>) => {
      state.compareResult = action.payload;
    },
    setDiagrams: (
      state,
      action: PayloadAction<{ toCompareDiagram: string; diagramComparedTo: string }>
    ) => {
      state.toCompareDiagram = action.payload.toCompareDiagram;
      state.diagramComparedTo = action.payload.diagramComparedTo;
    },
  },
});

export default comparingSlice;
