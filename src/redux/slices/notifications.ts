import { INotification } from "@/interfaces/workspaces";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
    [id: string]: INotification;
}

const notificationSlice = createSlice({
    name: "notification",
    initialState: {} as IInitialState,

    reducers: {
        setNotification: (state, action: PayloadAction<INotification>) => {
            state[action.payload.id] = action.payload;
        },
        deleteNotification: (state, action: PayloadAction<{ id: number }>) => {
            delete state[action.payload.id];
        },
        clearNotification: () => {
            return {};
        },
        updateNotification: (state, action: PayloadAction<INotification>) => {
            return {
                ...state,
                [action.payload.id]: action.payload
            }
        },
    }
});

export default notificationSlice;
