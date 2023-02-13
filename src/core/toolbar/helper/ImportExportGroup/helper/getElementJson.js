export const getElementForGraph = (elementRegistry) => {
  const elements = elementRegistry.getAll();
  const obj = {};
  elements.map((element) => {
    const businessObject = element.businessObject;
    const incoming = businessObject.incoming ? businessObject.incoming.map((obj) => obj.sourceRef.id) : [];
    const outgoing = businessObject.outgoing ? businessObject.outgoing.map((obj) => obj.targetRef.id) : [];
    let type;
    let name;
    let cycletime;
    let branchingProbabilities = [];
    if (businessObject.$type.includes("Task")) {
      type = "task";
      cycletime = parseInt(businessObject.cycleTime);
    } else if (businessObject.$type.includes("Event")) {
      type = "event";
      name = businessObject.$type.split(":")[1];
    } else if (businessObject.$type.includes("Gateway")) {
      type = "gateway"
      name = businessObject.$type.split(":")[1];
      businessObject.outgoing.map((flow) => branchingProbabilities.push(parseFloat(flow.branchingProbability)))
    }
    if (type) {
      const id = businessObject.id.toString();
      obj[id] = {
        id: businessObject.id,
        name: businessObject.name || name,
        incoming: incoming,
        outgoing: outgoing,
        type: type,
        cycleTime: cycletime || 0,
        branchingProbabilities: branchingProbabilities || []
      };
    }

    return false;
  });
  return obj;
};