import { EVENT_CLASS_NAMES, EVENT_SUB_PROCESS, EVENT_TYPE, NON_EVENT, TASK_CLASS_NAME, TASK_TYPE } from "@/core/toolbar/constants/bpmnElement";
import { isEventSubProcess } from 'bpmn-js/lib/util/DiUtil';
import { is, isAny } from 'bpmn-js/lib/util/ModelUtil';
import { filter, find, flatten, map } from 'lodash';
import { PROPERTY_TYPES } from "../../../../properties-panel/constants/types";

const checkHasLanes = (elements) => {
  return !!find(elements, (element) => is(element, 'bpmn:Lane'));
}

const createJsonObj = (obj, element, hasLane, parentId) => {
  if (isAny(element, ['bpmn:SubProcess', 'bpmn:EventSubProcess'])) {
    element.children.map(elem => createJsonObj(obj, elem, hasLane, element.id));
  }

  if (isAny(element, ['bpmn:SequenceFlow', 'bpmn:MessageFlow']) || element?.type === 'label') {
    return;
  }

  const businessObject = element.businessObject;
  const incoming = element.incoming ? element.incoming.flatMap((obj) => {
    if (is(obj, 'bpmn:SequenceFlow')) {
      return obj.source.id
    } else {
      return [];
    }
  }) : [];
  const outgoing = element.outgoing ? element.outgoing.flatMap((obj) => {
    if (is(obj, 'bpmn:SequenceFlow')) {
      return obj.target.id
    } else {
      return [];
    }
  }) : [];
  const incoming_messageflow = element.incoming ? element.incoming.flatMap((obj) => {
    if (is(obj, 'bpmn:MessageFlow')) {
      return obj.source.id
    } else {
      return [];
    }
  }) : [];
  const outgoing_messageflow = element.outgoing ? element.outgoing.flatMap((obj) => {
    if (is(obj, 'bpmn:MessageFlow')) {
      return obj.target.id
    } else {
      return [];
    }
  }) : [];;
  let type = '';
  let name = businessObject?.name;
  let taskType;
  let eventType;
  let cycletime;
  let className;
  let branchingProbabilities = [];
  let linkCode;
  let condition;
  let percentage;
  let timeDuration;
  let boundary;
  let isInterrupting;
  let isStart;
  let code;
  let numberOfTasks;
  let unitCost;
  if (is(element, "bpmn:Activity")) {
    type = "task";
    cycletime = parseInt(businessObject.cycleTime);
    taskType = TASK_TYPE[element.type]
    className = TASK_CLASS_NAME[element.type];
    if (isEventSubProcess(element)) {
      className = EVENT_SUB_PROCESS;
    }
    boundary = element?.attachers?.filter(attacher => attacher.type.includes("Event")).map(attacher => attacher.id);
  } else if (is(element, "bpmn:Event")) {
    type = "event";
    eventType = EVENT_TYPE[element.type];
    className = businessObject.eventDefinitions?.length ? EVENT_CLASS_NAMES[businessObject.eventDefinitions[0].$type] : NON_EVENT;
    linkCode = businessObject[PROPERTY_TYPES.LINK_CODE];
    condition = businessObject[PROPERTY_TYPES.CONDITION];
    percentage = parseFloat(businessObject[PROPERTY_TYPES.PERCENTAGE]);
    timeDuration = parseInt(businessObject[PROPERTY_TYPES.DURATION]);
    isInterrupting = is(element, 'bpmn:IntermediateCatchEvent') || is(element, 'bpmn:IntermediateThrowEvent') || (is(element, 'bpmn:BoundaryEvent') && businessObject?.cancelActivity);
    isStart = businessObject[PROPERTY_TYPES.IS_START];
    code = businessObject[PROPERTY_TYPES.CODE];
  } else if (is(element, "bpmn:Gateway")) {
    type = "gateway"
    element.outgoing.map((flow) => branchingProbabilities.push(parseFloat(flow.businessObject.branchingProbability)))
  } else if (is(element, "bpmn:Lane")) {
    numberOfTasks = filter(element.businessObject.flowNodeRef, (element) => is(element, "bpmn:Task")).length;
    unitCost = parseFloat(businessObject[PROPERTY_TYPES.UNIT_COST]);
  } else if (is(element, "bpmn:Participant")) {
    if (!hasLane) {
      numberOfTasks = filter(element.businessObject.processRef.flowElements, (element) => is(element, "bpmn:Task")).length;
      unitCost = parseFloat(businessObject[PROPERTY_TYPES.UNIT_COST]);
    }
  }

  const id = element.id.toString();
  obj[id] = {
    id: element.id,
    name: name || element.type?.split(":")[1].toLowerCase(),
    incoming: incoming,
    outgoing: outgoing,
    incoming_messageflow: incoming_messageflow,
    outgoing_messageflow: outgoing_messageflow,
    type: type || element.type?.split(":")[1].toLowerCase(),
    cycleTime: cycletime,
    className: className || element.type?.split(":")[1],
    branchingProbabilities: branchingProbabilities || [],
    taskType: taskType,
    eventType: eventType,
    parentID: parentId,
    linkCode: linkCode,
    condition: condition,
    percentage: percentage,
    timeDuration: timeDuration,
    boundary: boundary,
    isInterrupting: isInterrupting,
    isStart: isStart,
    code: code,
    numberOfTasks,
    unitCost
  };
}

export const getElementForGraph = (elementRegistry) => {
  const elements = elementRegistry.getAll();
  const obj = {};
  const participants = filter(elements, (element) => is(element, 'bpmn:Participant'));
  participants.map((participant) => {
    const hasLane = checkHasLanes(participant.children);
    const collaboration = elementRegistry.get(participant.parent?.id);
    createJsonObj(obj, collaboration, hasLane, null);
    createJsonObj(obj, elementRegistry.get(participant.id), hasLane, collaboration.id);
    if (!hasLane) {
      participant.businessObject.processRef.flowElements.map((element) => {
        createJsonObj(obj, elementRegistry.get(element.id), hasLane, participant.id);
      });
    } else {
      const lanes = flatten(map(flatten(participant.businessObject.processRef.laneSets), (element) => element.lanes));
      lanes.map((lane) => {
        createJsonObj(obj, elementRegistry.get(lane.id), hasLane, participant.id);
        lane.flowNodeRef.map((element) => {
          createJsonObj(obj, elementRegistry.get(element.id), hasLane, lane.id);
        })
      })
    }
  });
  // elements.map((element) => {
  //   createJsonObj(obj, element, hasLane);
  // });
  return obj;
};