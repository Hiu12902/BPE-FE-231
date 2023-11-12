import { IRequests } from "@/interfaces/workspaces";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
    [id: string]: IRequests;
}

const requestsSlice = createSlice({
    name: "requests",
    initialState: {} as IInitialState,

    reducers: {
        setRequests: (state, action: PayloadAction<IRequests>) => {
            state[action.payload.id] = action.payload;
        },
        deleteRequests: (state, action: PayloadAction<{ id: number }>) => {
            delete state[action.payload.id];
        },
        clearRequests: () => {
            return {};
        },
        updateRequests: (state, action: PayloadAction<IRequests>) => {
            return {
                ...state,
                [action.payload.id]: action.payload
            }
        },
    }
});

export default requestsSlice;
