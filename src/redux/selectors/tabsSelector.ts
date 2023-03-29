import { RootState } from '@/redux/store';

export const getTabs = (state: RootState) => state.tabs.tabsRoot;

export const getActiveTab = (state: RootState) => state.tabs.activeTab;
