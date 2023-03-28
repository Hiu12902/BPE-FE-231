import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { uniqBy } from 'lodash';

interface TabsProps {
  tabsRoot: string[];
  activeTab?: string;
}

const tabsSlice = createSlice({
  name: 'tabs',
  initialState: { tabsRoot: [], activeTab: '' } as TabsProps,
  reducers: {
    setTabs: (state, action: PayloadAction<string[]>) => {
      const newTabs = uniqBy([...state.tabsRoot, ...action.payload], (e) => e);
      state.tabsRoot = newTabs;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
  },
});

export default tabsSlice;
