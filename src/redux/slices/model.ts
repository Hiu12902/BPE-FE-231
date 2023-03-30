import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { find, remove } from 'lodash';

interface Modeler {
  modeler: any;
  isNew: boolean;
  id: string;
}

interface ModelProps {
  modelers: Modeler[];
  currentModeler: Modeler | undefined;
}

const modelSlice = createSlice({
  name: 'model',
  initialState: {
    modelers: [],
    currentModeler: undefined,
  } as ModelProps,

  reducers: {
    setModelers: (state, action: PayloadAction<{ modeler: any; id: string }>) => {
      state.modelers.push({ modeler: action.payload.modeler, isNew: true, id: action.payload.id });
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
      remove(state.modelers, (modeler) => modeler.id === action.payload);
      if (state.currentModeler?.id === action.payload) {
        state.currentModeler = state.modelers[state.modelers.length - 1];
      }
    },
  },
});

export default modelSlice;
