import { EvaluatedResultRecord } from '../interfaces';

export const ResultTableTitleMap: Record<keyof EvaluatedResultRecord, string> = {
  totalCycleTime: 'Total Cycle Time',
  exceptionHandling: 'Exception Handling',
  flexibility: 'Flexibility',
  numberOfHandledExceptions: 'Handled Exceptions',
  numberOfUnhandledExceptions: 'Unhandled Exceptions',
  numberOfOptionalTasks: 'Optional Tasks',
  name: 'Name',
  totalCycleTimeAllLoops: 'Cycle Time Of All Loops',
  totalLoop: 'Total Loop',
  totalLoopProbability: 'Total Loop Probability',
  totalNumberExplicitTasks: 'Explicit Tasks',
  totalTasks: 'Total Tasks',
  unHandledTasks: 'Unhandled Tasks',
  handledTasks: 'Handled Tasks',
  totalCost: 'Total Cost',
  quality: 'Quality',
};

export const EXCLUDED_FIELDS = [
  'logsCycleTime',
  'logsFlexibility',
  'logsQuality',
  'transparency',
  'unitCost',
];
