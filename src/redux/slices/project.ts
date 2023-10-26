import { IProject } from '@/interfaces/projects';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  [id: number]: IProject;
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
    setProcessesCount: (
      state,
      action: PayloadAction<{ projectId: number; versionCount: number }>
    ) => {
      const { projectId, versionCount } = action.payload;
      state[projectId].processesCount = versionCount;
    },
    updateProject: (state, action: PayloadAction<IProject>) => {
      return { ...state, [action.payload.id]: action.payload };
    },
    clearProjects: () => {
      return {};
    }
  },
});

export default projectSlice;
