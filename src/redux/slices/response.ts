import { Response } from "@/interfaces/index";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
    [sectionId: number]: {
        [questionId: number]: Response;
    };
    branch: boolean;
}

interface ResponseStateBody {
    sectionId: number;
    questionId: number;
    value?: string;
    isRequired?: boolean;
}

const responseSlice = createSlice({
    name: "response",
    initialState: {} as InitialState,

    reducers: {
        setSectionResponse: (state, action: PayloadAction<ResponseStateBody>) => {
            const { sectionId, questionId, value, isRequired } = action.payload;
            if (!state[sectionId]) {
                state[sectionId] = {};
            }
            state[sectionId][questionId] = {
                value: value,
                isRequired: isRequired,
            };
        },
        setBranch: (state, action: PayloadAction<boolean>) => {
            state.branch = action.payload;
        },
        deleteSectionResponse: (
            state,
            action: PayloadAction<number>
        ) => {
            delete state[action.payload];
        },
        deleteResponse: () => {
            return {} as InitialState;
        }
    }
});

export default responseSlice;
