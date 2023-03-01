import { TASK_TYPE, EVENT_TYPE } from "../../../constants/bpmnElement";

export const getElementForGraph = (elementRegistry) => {
  const elements = elementRegistry.getAll();
  const obj = {};
  elements.map((element) => {
    let type = '';
    let name = '';
    let type;
    let name;
    let taskType = null;
    let eventType = null;
    let cycletime;
    let branchingProbabilities = [];
    if (element.type.includes("Task")) {
      type = "task";
      cycletime = parseInt(element.cycleTime);
      taskType = TASK_TYPE[element.type]
    } else if (element.type.includes("Event")) {
      type = "event";
      name = element.type.split(":")[1];
      eventType = EVENT_TYPE[element.type];
    } else if (element.type.includes("Gateway")) {
      type = "gateway"
      name = element.type.split(":")[1];
      element.outgoing.map((flow) => branchingProbabilities.push(parseFloat(flow.branchingProbability)))
    }
    if (type) {
      const id = element.id.toString();
      obj[id] = {
        id: element.id,
        name: element.name || name,
        incoming: element?.incoming,
        outgoing: element?.outgoing,
        type: type,
        cycleTime: cycletime || 0,
        branchingProbabilities: branchingProbabilities || [],
        taskType: taskType,
        eventType: eventType,
        parentId: element?.parent?.id
      };
    }
    const id = element.id.toString();
    obj[id] = {
      id: element.id,
      name: element.name || name,
      incoming: element?.incoming?.map((v) => v?.id?.toString()),
      outgoing: element?.outgoing?.map((v) => v?.id?.toString()),
      type: type || element.type?.split(":")[1],
      cycleTime: cycletime || 0,
      branchingProbabilities: branchingProbabilities || [],
      taskType: taskType,
      eventType: eventType,
      parentID: element?.parent?.id || null
    };

    return false;
  });
  console.log(obj);
  return obj;
};