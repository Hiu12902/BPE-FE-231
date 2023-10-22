import { IWorkspace } from "@/interfaces/workspaces";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
    [id: string]: IWorkspace;
}

const workspaceSlice = createSlice({
    name: "workspace",
    initialState: {} as IInitialState,

    reducers: {
        setWorkspace: (state, action: PayloadAction<IWorkspace>) => {
            state[action.payload.id] = action.payload;
        },
        deleteWorkspace: (state, action: PayloadAction<string>) => {
            delete state[action.payload];
        },
        // setProcessesCount: (
        //   state,
        //   action: PayloadAction<{ projectId: number; versionCount: number }>
        // ) => {
        //   const { projectId, versionCount } = action.payload;
        //   state[projectId].processesCount = versionCount;
        // },
        // updateProject: (state, action: PayloadAction<IProject>) => {
        //   return { ...state, [action.payload.id]: action.payload };
        // },
    },
});

export default workspaceSlice;
