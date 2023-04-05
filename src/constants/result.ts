import { EvaluatedResultRecord } from '../interfaces';

export const ResultTableTitleMap: Record<keyof EvaluatedResultRecord, string> = {
  currentCycleTime: 'Current Cycle Time',
  exceptionHandling: 'Exception Handling',
  flexibility: 'Flexibility',
  numberOfHandledExceptions: 'Handled Exceptions',
  numberOfUnhandledExceptions: 'Unhandled Exceptions',
  numberOfOptionalTasks: 'Optional Tasks',
  participantName: 'Participant Name',
  totalCycleTimeAllLoops: 'Total Cycle Time Of All Loops',
};

export const EXCLUDED_FIELDS = ['logsCycleTime', 'logsFlexibility', 'logsQuality'];
