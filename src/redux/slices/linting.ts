import { IIssue } from '@/interfaces/linting';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface LintingProps {
  lintIssues: IIssue[];
  isLintingActive: boolean;
}

const lintingSlice = createSlice({
  name: 'linting',
  initialState: {
    lintIssues: [],
    isLintingActive: false,
  } as LintingProps,

  reducers: {
    setLintingIssues: (state, action: PayloadAction<IIssue[]>) => {
      state.lintIssues = action.payload;
    },
    setIsLintingActive: (state, action: PayloadAction<boolean>) => {
      state.isLintingActive = action.payload;
    },
  },
});

export default lintingSlice;
