import { IWorkspace } from "@/interfaces/workspaces";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
    [id: string]: IWorkspace;
}

const pinnedWorkspaceSlice = createSlice({
    name: "pinnedWorkspace",
    initialState: {} as IInitialState,

    reducers: {
        pinWorkspace: (state, action: PayloadAction<IWorkspace>) => {
            state[action.payload.id] = action.payload;
        },
        unpinWorkspace: (state, action: PayloadAction<{ id: number }>) => {
            delete state[action.payload.id];
        },
        clearPinnedWorkspaces: () => {
            return {} as IInitialState;
        }
    }
});

export default pinnedWorkspaceSlice;
