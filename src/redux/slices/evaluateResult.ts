import { EvaluationResult } from '@/interfaces/evaluatedResult';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface EvaluationProps {
  [id: string]: EvaluationResult[];
}

const evaluatedResultSlice = createSlice({
  name: 'evaluatedResult',
  initialState: {
    '': [] as EvaluationResult[],
  } as EvaluationProps,

  reducers: {
    setEvaluatedResult: (
      state,
      action: PayloadAction<{ result: EvaluationResult[]; id: string }>
    ) => {
      state[action.payload.id] = action.payload.result;
    },
  },
});

export default evaluatedResultSlice;
