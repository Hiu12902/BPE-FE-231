import { RootState } from '@/redux/store';

export const getResponse = (state: RootState) => state.response;

export const getBranch = (state: RootState) => state.response.branch;

// export const getRequiredResponse = (state: RootState) => state.response.isRequired;