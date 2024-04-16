import { EvaluationResult } from '../interfaces';

export const ResultTableTitleMap: Record<keyof EvaluationResult, string> = {
  totalCycleTime: 'Total Cycle Time',
  exceptionHandling: 'Exception Handling',
  flexibility: 'Flexibility',
  numberOfHandledExceptions: 'Handled Exceptions',
  numberOfUnhandledExceptions: 'Unhandled Exceptions',
  numberOfOptionalTasks: 'Optional Tasks',
  name: 'Start From Process',
  totalCycleTimeAllLoops: 'Cycle Time Of All Loops',
  totalLoop: 'Total Loop',
  totalLoopProbability: 'Total Loop Probability',
  totalNumberExplicitTasks: 'Explicit Tasks',
  totalTasks: 'Total Tasks',
  unHandledTasks: 'Unhandled Tasks',
  handledTasks: 'Handled Tasks',
  totalCost: 'Total Cost',
  quality: 'Internal Quality',
  transparency: 'Transparency',
  logsCycleTime: 'Log Cycle Time',
  logsFlexibility: 'Log Flexibility',
  logsQuality: 'Log Quality',
  unitCost: 'Unit Cost',
  steps: 'Steps',
  totalQuality: 'Total Quality',
  externalQuality: 'External Quality',
};

export const EXCLUDED_FIELDS = [
  'logsCycleTime',
  'logsFlexibility',
  'logsQuality',
  'totalLoop',
  'handledTasks',
  'unHandledTasks',
  'totalLoopProbability',
  'steps',
];
