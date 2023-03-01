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
