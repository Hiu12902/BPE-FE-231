import { TOOLBAR_MODE } from '@/constants/toolbar';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { find, indexOf, remove } from 'lodash';

export enum TabVariant {
  SUB_PROCESS = 'SUB_PROCESS',
  RESULT = 'RESULT',
  MODEL = 'MODEL',
}

export interface tab {
  label: string;
  value: string;
  variant: TabVariant;
  toolMode: TOOLBAR_MODE;
  id: string;
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
      toolMode: TOOLBAR_MODE.DEFAULT,
      id: '',
    },
  } as TabsProps,

  reducers: {
    setTabs: (state, action: PayloadAction<tab[]>) => {
      state.tabsRoot = [...state.tabsRoot, ...action.payload];
      state.activeTab = state.tabsRoot[state.tabsRoot.length - 1];
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      const tab = find(state.tabsRoot, (e) => e.id === action.payload);
      state.activeTab = tab || state.tabsRoot[state.tabsRoot.length - 1];
    },
    closeTab: (state, action: PayloadAction<string>) => {
      const index = indexOf(
        state.tabsRoot,
        find(state.tabsRoot, (tab) => tab.id === action.payload)
      );
      remove(state.tabsRoot, (tab) => tab.id === action.payload);
      state.activeTab = state.tabsRoot[index - 1];
    },
    updateActiveTab: (state, action: PayloadAction<tab>) => {
      state.tabsRoot = state.tabsRoot.map((tab) =>
        tab.id === action.payload.id ? { ...action.payload } : tab
      );
      state.activeTab = action.payload;
    },
  },
});

export default tabsSlice;
