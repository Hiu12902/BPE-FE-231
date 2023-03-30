export interface EvaluatedResultRecord {
  totalCycleTime?: number;
  exceptionHandling?: number;
  flexibility?: number;
  numberOfHandledExceptions?: number;
  numberOfOptionalTasks?: number;
  numberOfUnhandledExceptions?: number;
  name?: string;
  totalCycleTimeAllLoops?: number;
  handledTasks?: number;
  totalLoop?: number;
  totalLoopProbability?: number;
  totalNumberExplicitTasks?: number;
  totalTasks?: number;
  unHandledTasks?: number;
  totalCost?: number;
  quality?: number;
}
export interface EvaluationResult extends EvaluatedResultRecord {
  logsCycleTime?: any[];
  logsFlexibility?: any[];
  logsQuality?: any[];
  transparency?: any;
  unitCost?: any[];
}
