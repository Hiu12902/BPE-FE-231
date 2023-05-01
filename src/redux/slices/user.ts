import { IUser } from '@/interfaces/user';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

const initialState: Partial<IUser> = {};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      return { ...action.payload };
    },
  },
});

export default userSlice;
