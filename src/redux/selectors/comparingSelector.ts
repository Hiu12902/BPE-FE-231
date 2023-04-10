import { RootState } from '@/redux/store';

export const getComparingResult = (state: RootState) => state.comparing.compareResult;

export const getDiagramsComparing = (state: RootState) => ({
  toComparedDiagram: state.comparing.toCompareDiagram,
  diagramComparedTo: state.comparing.diagramComparedTo,
});
