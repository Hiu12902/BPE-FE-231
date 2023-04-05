import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { find, remove, uniqBy } from 'lodash';

export enum TabVariant {
  SUB_PROCESS = 'SUB_PROCESS',
  RESULT = 'RESULT',
  MODEL = 'MODEL',
}

export interface tab {
  label: string;
  value: string;
  variant: TabVariant;
}

interface TabsProps {
  tabsRoot: tab[];
  activeTab?: tab;
}

const tabsSlice = createSlice({
  name: 'tabs',
  initialState: {
    tabsRoot: [],
    activeTab: {
      label: '',
      value: '',
      variant: TabVariant.MODEL,
    },
  } as TabsProps,

  reducers: {
    setTabs: (state, action: PayloadAction<tab[]>) => {
      const newTabs = uniqBy([...state.tabsRoot, ...action.payload], (e) => e.value);
      state.tabsRoot = newTabs;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      const tab = find(state.tabsRoot, (e) => e.value === action.payload);
      state.activeTab = tab || state.tabsRoot[state.tabsRoot.length - 1];
    },
    closeTab: (state, action: PayloadAction<string>) => {
      remove(state.tabsRoot, (tab) => tab.value === action.payload);
    },
  },
});

export default tabsSlice;
