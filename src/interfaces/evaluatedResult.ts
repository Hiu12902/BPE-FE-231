export interface EvaluatedResultRecord {
  currentCycleTime: number;
  exceptionHandling: number;
  flexibility: number;
  numberOfHandledExceptions: number;
  numberOfOptionalTasks: number;
  numberOfUnhandledExceptions: number;
  participantName: string;
  totalCycleTimeAllLoops: number;
}
export interface EvaluationResult extends EvaluatedResultRecord {
  logsCycleTime: any[];
  logsFlexibility: any[];
  logsQuality: any[];
}
