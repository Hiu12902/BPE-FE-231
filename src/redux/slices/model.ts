import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { find, indexOf, remove } from 'lodash';

interface Modeler {
  modeler: any;
  isNew?: boolean;
  id: string;
  projectId?: number;
  projectName?: string;
}

interface ModelProps {
  modelers: Modeler[];
  currentModeler?: Modeler;
}

const modelSlice = createSlice({
  name: 'model',
  initialState: {
    modelers: [],
    currentModeler: undefined,
  } as ModelProps,

  reducers: {
    setModelers: (state, action: PayloadAction<Modeler>) => {
      state.modelers.push({ ...action.payload, isNew: true });
    },
    setCurrentModeler: (state, action: PayloadAction<string>) => {
      const modeler = find(state.modelers, (modeler) => modeler.id === action.payload);
      state.currentModeler = modeler;
    },
    updateCurrentModeler: (state, action: PayloadAction<Modeler>) => {
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
        state.currentModeler = state.modelers[index - 1];
      }
    },
  },
});

export default modelSlice;
