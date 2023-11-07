import { IMembers } from "@/interfaces/workspaces";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
    [memberId: string]: IMembers;
}

const membersSlice = createSlice({
    name: "members",
    initialState: {} as IInitialState,

    reducers: {
        setMembers: (state, action: PayloadAction<IMembers>) => {
            state[action.payload.memberId] = action.payload;
        },
        deleteMembers: (state, action: PayloadAction<{ memberId: number }>) => {
            delete state[action.payload.memberId];
        },
        clearMembers: () => {
            return {};
        },
        updateMembers: (state, action: PayloadAction<IMembers>) => {
            return {
                ...state,
                [action.payload.memberId]: action.payload
            }
        },
    }
});

export default membersSlice;
