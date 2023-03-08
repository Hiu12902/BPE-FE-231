export const TASK_TYPE = {
  'bpmn:NoneTask': 0,
  'bpmn:Task': 0,
  'bpmn:ServiceTask': 1,
  'bpmn:ManualTask': 2,
  'bpmn:ScriptTask': 3,
  'bpmn:BusinessRuleTask': 4,
  'bpmn:UserTask': 5,
};

export const EVENT_TYPE = {
  'bpmn:StartEvent': 0,
  'bpmn:EndEvent': 1,
  'bpmn:ImplicitThrowEvent': 2,
  'bpmn:IntermediateThrowEvent': 3,
  'bpmn:IntermediateCatchEvent': 4,
  'bpmn:BoundaryEvent': 5,
};

const NORMAL_TASK = 'NormalTask';

export const TASK_CLASS_NAME = {
  'bpmn:NoneTask': NORMAL_TASK,
  'bpmn:Task': NORMAL_TASK,
  'bpmn:ServiceTask': NORMAL_TASK,
  'bpmn:ManualTask': NORMAL_TASK,
  'bpmn:ScriptTask': NORMAL_TASK,
  'bpmn:BusinessRuleTask': NORMAL_TASK,
  'bpmn:UserTask': NORMAL_TASK,
};

const ESCALATION_EVENT = 'EscalationEvent';
const ERROR_EVENT = 'ErrorEvent';
const CONDITIONAL_EVENT = 'ConditionalEvent';
const COMPENSATION_EVENT = 'CompensationEvent';
const LINK_EVENT = 'LinkEvent';
const TERMINATE_EVENT = 'TerminateEvent';
const SIGNAL_EVENT = 'SignalEvent';
const CANCEL_EVENT = 'CancelEvent';
export const NON_EVENT = 'NonEvent';
const TIMER_EVENT = 'TimerEvent';
const MESSAGE_EVENT = 'MessageEvent';

export const EVENT_CLASS_NAMES = {
  'bpmn:EscalationEventDefinition': ESCALATION_EVENT,
  'bpmn:CancelEventDefinition': CANCEL_EVENT,
  'bpmn:TimerEventDefinition': TIMER_EVENT,
  'bpmn:MessageEventDefinition': MESSAGE_EVENT,
  'bpmn:SignalEventDefinition': SIGNAL_EVENT,
  'bpmn:LinkEventDefinition': LINK_EVENT,
  'bpmn:ErrorEventDefinition': ERROR_EVENT,
  'bpmn:ConditionalEventDefinition': CONDITIONAL_EVENT,
  'bpmn:CompensateEventDefinition': COMPENSATION_EVENT,
  'bpmn:TerminateEventDefinition': TERMINATE_EVENT,
};
