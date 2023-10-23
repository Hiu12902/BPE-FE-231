import { RootState } from '@/redux/store';

export const getWorkspace = (state: RootState) => state.workspace;

export const getPinnedWorkspace = (state: RootState) => state.pinnedWorkspace;
