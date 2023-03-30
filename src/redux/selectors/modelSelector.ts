import { RootState } from '@/redux/store';

export const getModelers = (state: RootState) => state.model.modelers;

export const getCurrentModeler = (state: RootState) => state.model.currentModeler;
