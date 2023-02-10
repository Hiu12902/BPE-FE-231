export const gatewaySymbols = [
  {
    className: 'bpmn-icon-gateway-xor custom-entry',
    tagName: 'bpmn:ExclusiveGateway',
    name: 'Exclusive Gateway'
  },
  {
    className: 'bpmn-icon-gateway-or custom-entry',
    tagName: 'bpmn:InclusiveGateway',
    name: 'Inclusive Gateway'
  },
  {
    className: 'bpmn-icon-gateway-parallel custom-entry',
    tagName: 'bpmn:ParallelGateway',
    name: 'Parallel Gateway'
  },
  {
    className: 'bpmn-icon-gateway-complex custom-entry',
    tagName: 'bpmn:ComplexGateway',
    name: 'Complex Gateway'
  },
  {
    className: 'bpmn-icon-gateway-eventbased custom-entry',
    tagName: 'bpmn:EventBasedGateway',
    name: 'Event Based Gateway'
  },
];

export const taskSymbols = [
  {
    className: 'bpmn-icon-task custom-entry',
    tagName: 'bpmn:Task',
    name: 'Task',
  },
  {
    className: 'bpmn-icon-user-task custom-entry',
    tagName: 'bpmn:UserTask',
    name: 'User Task'
  },
  {
    className: 'bpmn-icon-business-rule-task custom-entry',
    tagName: 'bpmn:BusinessRuleTask',
    name: 'Business Rule Task'
  },
  {
    className: 'bpmn-icon-manual-task custom-entry',
    tagName: 'bpmn:ManualTask',
    name: 'Manual Task'
  },
  {
    className: 'bpmn-icon-receive-task custom-entry',
    tagName: 'bpmn:ReceiveTask',
    name: 'Receive Task'
  },
  {
    className: 'bpmn-icon-send-task custom-entry',
    tagName: 'bpmn:SendTask',
    name: 'Send Task'
  },
  {
    className: 'bpmn-icon-script-task custom-entry',
    tagName: 'bpmn:ScriptTask',
    name: 'Script Task'
  },
  {
    className: 'bpmn-icon-service-task custom-entry',
    tagName: 'bpmn:ServiceTask',
    name: 'Service Task'
  }
];

export const eventSymbols = [
  {
    className: 'bpmn-icon-start-event-none custom-entry',
    tagName: 'bpmn:StartEvent',
    name: 'Start Event'
  },
  {
    className: 'bpmn-icon-end-event-none custom-entry',
    tagName: 'bpmn:EndEvent',
    name: 'End Event'
  },
  {
    className: 'bpmn-icon-intermediate-event-none custom-entry',
    tagName: 'bpmn:IntermediateThrowEvent',
    name: 'Intermediate Event'
  }
];

export const dataSymbols = [
  {
    className: 'bpmn-icon-data-object custom-entry',
    tagName: 'bpmn:DataObjectReference',
    name: 'Data Object'
  },
  {
    className: 'bpmn-icon-data-store custom-entry',
    tagName: 'bpmn:DataStoreReference',
    name: 'Data Store'
  }
]

export const subProcessSymbols = [
  {
    className: 'bpmn-icon-subprocess-collapsed custom-entry',
    tagName: 'bpmn:SubProcess',
    name: 'Sub Process (collapsed)',
    option: {
      isExpanded: false,
    }
  },
  {
    className: 'bpmn-icon-subprocess-expanded custom-entry',
    tagName: 'bpmn:SubProcess',
    name: 'Sub Process (expanded)',
    option: {
      isExpanded: true,
    }
  },
  {
    className: 'bpmn-icon-transaction custom-entry',
    tagName: 'bpmn:Transaction',
    name: 'Transaction',
    option: {
      isExpanded: true,
    }
  }
];

export const participantsSymbols = [
  {
    className: 'bpmn-icon-participant custom-entry',
    tagName: 'bpmn:Participant',
    name: 'Pool'
  },
  {
    className: 'bpmn-icon-lane custom-entry',
    tagName: 'bpmn:Lane',
    name: 'Lane'
  }
];

export const artifactSymbols = [
  {
    className: 'bpmn-icon-group custom-entry',
    tagName: 'bpmn:Group',
    name: 'Group'
  },
  {
    className: 'bpmn-icon-text-annotation custom-entry',
    tagName: 'bpmn:TextAnnotation',
    name: 'Text Annotation'
  },
]