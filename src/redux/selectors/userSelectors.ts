import { RootState } from '@/redux/store';

export const getCurrentUser = (state: RootState) => state.user;
