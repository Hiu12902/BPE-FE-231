import { RootState } from '@/redux/store';
import { filter } from 'lodash';

export const getLintingIssues = (state: RootState) => state.linting.lintIssues;

export const getLintingErrors = (state: RootState) =>
  filter(state.linting.lintIssues, (issue) => issue.category === 'error');

export const getLintingState = (state: RootState) => state.linting.isLintingActive;
