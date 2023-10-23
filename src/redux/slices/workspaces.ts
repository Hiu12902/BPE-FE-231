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
        deleteWorkspace: (state, action: PayloadAction<{id: number}>) => {
            delete state[action.payload.id];
        },
        updateWorkspaceName: (state, action: PayloadAction<{ id: number; name: string }>) => {
            state[action.payload.id].name = action.payload.name
        },
        updateWorkspaceDescription: (state, action: PayloadAction<{ id: string; description: string }>) => {
            state[action.payload.id].description = action.payload.description
        },
        updateWorkspace: (state, action: PayloadAction<IWorkspace>) => {
            return {
                ...state,
                [action.payload.id]: action.payload
            }
        },
        updatePinWorkspace: (state, action: PayloadAction<IWorkspace>) => {
            state[action.payload.id].isPinned = !action.payload.isPinned;
        },
    }
});

export default workspaceSlice;
