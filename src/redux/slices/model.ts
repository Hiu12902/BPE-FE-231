import { UserRole } from '@/constants/project';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { find, indexOf, remove } from 'lodash';

export interface IModeler {
  modeler: any;
  isNew?: boolean;
  id: string;
  projectId?: number;
  projectName?: string;
  name?: string;
  processId?: number;
  isEdited?: boolean;
  role?: UserRole;
}

interface ModelProps {
  modelers: IModeler[];
  currentModeler?: IModeler;
}

const modelSlice = createSlice({
  name: 'model',
  initialState: {
    modelers: [],
    currentModeler: undefined,
  } as ModelProps,

  reducers: {
    setModelers: (state, action: PayloadAction<IModeler>) => {
      const index = indexOf(
        state.modelers,
        find(state.modelers, (modeler) => modeler.id === action.payload.id)
      );
      if (index < 0) {
        state.modelers.push({ ...action.payload, isNew: true });
      }
    },
    setCurrentModeler: (state, action: PayloadAction<string>) => {
      const modeler = find(state.modelers, (modeler) => modeler.id === action.payload);
      state.currentModeler = modeler;
    },
    updateCurrentModeler: (state, action: PayloadAction<IModeler>) => {
      state.modelers = state.modelers.map((modeler) =>
        modeler.id === action.payload.id ? { ...action.payload } : modeler
      );
      state.currentModeler = action.payload;
    },
    deleteModeler: (state, action: PayloadAction<string>) => {
      const index = indexOf(
        state.modelers,
        find(state.modelers, (modeler) => modeler.id === action.payload)
      );
      remove(state.modelers, (modeler) => modeler.id === action.payload);
      if (state.currentModeler?.id === action.payload) {
        state.currentModeler = state.modelers[index > 0 ? index - 1 : 0];
      }
    },
    updateModelEditState: (
      state,
      action: PayloadAction<{ modelId: string; isEdited: boolean }>
    ) => {
      const { modelId, isEdited } = action.payload;
      const index = indexOf(
        state.modelers,
        find(state.modelers, (modeler) => modeler.id === modelId)
      );
      state.modelers[index].isEdited = isEdited;
    },
  },
});

export default modelSlice;
