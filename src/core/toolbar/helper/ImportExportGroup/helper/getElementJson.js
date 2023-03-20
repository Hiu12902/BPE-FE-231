import { is } from 'bpmn-js/lib/util/ModelUtil';
import { isEventSubProcess } from 'bpmn-js/lib/util/DiUtil';
import { PROPERTY_TYPES } from "../../../../properties-panel/constants/types";
import { TASK_TYPE, EVENT_TYPE, TASK_CLASS_NAME, NON_EVENT, EVENT_CLASS_NAMES, EVENT_SUB_PROCESS } from "../../../constants/bpmnElement";

export const getElementForGraph = (elementRegistry) => {
  const elements = elementRegistry.getAll();

  const obj = {};
  elements.map((element) => {
    if (element?.parent === undefined && !is(element, 'bpmn:Collaboration')) {
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
    } else if (is(element, "bpmn:Gateway")) {
      type = "gateway"
      element.outgoing.map((flow) => branchingProbabilities.push(parseFloat(flow.businessObject.branchingProbability)))
    }

    if (element.type.includes("SequenceFlow") || element.type.includes("label")) {
      return;
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
      parentID: element?.parent?.id,
      linkCode: linkCode,
      condition: condition,
      percentage: percentage,
      timeDuration: timeDuration,
      boundary: boundary,
      isInterrupting: isInterrupting
    };
  });
  return obj;
};