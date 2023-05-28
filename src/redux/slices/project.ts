import { IProject } from '@/interfaces/projects';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  [id: string]: IProject;
}

const projectSlice = createSlice({
  name: 'project',
  initialState: {} as IInitialState,

  reducers: {
    setProject: (state, action: PayloadAction<IProject>) => {
      state[action.payload.id] = action.payload;
    },
    deleteProject: (state, action: PayloadAction<number>) => {
      delete state[action.payload];
    },
    increaseVersionsCount: (state, action: PayloadAction<number>) => {
      state[action.payload].versionsCount! += 1;
    },
    decreaseVersionsCount: (state, action: PayloadAction<number>) => {
      const count = state[action.payload].versionsCount;
      state[action.payload].versionsCount = count! > 0 ? count! - 1 : 0;
    },
    setVersionsCount: (
      state,
      action: PayloadAction<{ projectId: number; versionCount: number }>
    ) => {
      const { projectId, versionCount } = action.payload;
      state[projectId].versionsCount = versionCount;
    },
  },
});

export default projectSlice;
