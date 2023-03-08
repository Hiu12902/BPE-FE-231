import { TASK_TYPE, EVENT_TYPE, TASK_CLASS_NAME, NON_EVENT, EVENT_CLASS_NAMES } from "../../../constants/bpmnElement";

export const getElementForGraph = (elementRegistry) => {
  const elements = elementRegistry.getAll();
  const obj = {};
  elements.map((element) => {
    const businessObject = element.businessObject;
    const incoming = businessObject.incoming ? businessObject.incoming.map((obj) => obj.sourceRef.id) : [];
    const outgoing = businessObject.outgoing ? businessObject.outgoing.map((obj) => obj.targetRef.id) : [];
    let type = '';
    let name = businessObject?.name;
    let taskType;
    let eventType;
    let cycletime;
    let className;
    let branchingProbabilities = [];
    if (element.type.includes("Task")) {
      type = "task";
      cycletime = parseInt(businessObject.cycleTime);
      taskType = TASK_TYPE[element.type]
      className = TASK_CLASS_NAME[element.type];
    } else if (element.type.includes("Event")) {
      type = "event";
      eventType = EVENT_TYPE[element.type];
      className = businessObject.eventDefinitions?.length ? EVENT_CLASS_NAMES[businessObject.eventDefinitions[0].$type] : NON_EVENT;
    } else if (element.type.includes("Gateway")) {
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
      type: type || element.type?.split(":")[1].toLowerCase(),
      cycleTime: cycletime,
      className: className || element.type?.split(":")[1],
      branchingProbabilities: branchingProbabilities || [],
      taskType: taskType,
      eventType: eventType,
      parentID: element?.parent?.id
    };
  });
  return obj;
};