import { RootState } from '@/redux/store';

export const getEvaluatedResult = (state: RootState) => state.evaluatedResult.evaluatedResult;
