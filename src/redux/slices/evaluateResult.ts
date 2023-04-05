import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { EvaluationResult } from '@/interfaces/evaluatedResult';

interface EvaluationProps {
  evaluatedResult: EvaluationResult[];
}

const evaluatedResultSlice = createSlice({
  name: 'evaluatedResult',
  initialState: {
    evaluatedResult: [] as EvaluationResult[],
  } as EvaluationProps,

  reducers: {
    setEvaluatedResult: (state, action: PayloadAction<EvaluationResult[]>) => {
      state.evaluatedResult = action.payload;
    },
  },
});

export default evaluatedResultSlice;
