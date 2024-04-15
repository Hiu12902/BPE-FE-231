export interface EvaluatedResultStep {
  activity?: string;
  cycleTime?: number;
  cost?: number;
  label?: string;
  event?: string;
  gateWay?: string;
  branchingProbability?: number[];
  rework?: number;
}
export interface EvaluatedResultRecord {
  name?: string;
  handledTasks?: number;
  unHandledTasks?: number;
  // 1. exception handling
  exceptionHandling?: number;
  numberOfHandledExceptions?: number;
  numberOfUnhandledExceptions?: number;
  // 2. flexibility
  totalTasks?: number;
  flexibility?: number;
  numberOfOptionalTasks?: number;
  // 3. quality
  quality?: number;
  totalLoop?: number;
  totalQuality?: number;
  externalQuality?: number;
  totalLoopProbability?: number;
  // 4. Cost
  totalCost?: number;
  totalCycleTimeAllLoops?: number;
  // 5. Cycle time
  totalCycleTime?: number;
  // 6. Transperancy
  totalNumberExplicitTasks?: number;
}
export interface EvaluationResult extends EvaluatedResultRecord {
  logsCycleTime?: any[];
  logsFlexibility?: any[];
  logsQuality?: any[];
  transparency?: any;
  unitCost?: {
    lane: string,
    cost: number,
  }[];
  steps?: EvaluatedResultStep[];
}
