//@ts-ignore
import PropertiesParts from './entries';

class PropertiesGroups {
  private static classInstance?: PropertiesGroups;

  public static get instance() {
    if (!this.classInstance) {
      this.classInstance = new PropertiesGroups();
    }
    return this.classInstance;
  }

  createTaskGroup = (element: any, translate: any) => {
    return {
      id: 'task',
      label: translate('Cycle Time'),
      entries: PropertiesParts.taskEntries(element),
    };
  };

  createExclusiveGatewayGroup = (element: any, translate: any) => {
    return {
      id: 'exclusiveGateway',
      label: translate('Branching Probabilities'),
      entries: PropertiesParts.exclusiveGatewayEntries(element),
    };
  };

  createLinkEventGroup = (element: any, translate: any) => {
    return {
      id: 'linkEvent',
      label: translate('Link Code'),
      entries: PropertiesParts.linkEventEntries(element),
    };
  };

  createConditionalEventGroup = (element: any, translate: any) => {
    return {
      id: 'conditionalEvent',
      label: translate('Condition Information'),
      entries: PropertiesParts.conditionalEventEntries(element),
    };
  };

  createTimerEventGroup = (element: any, translate: any) => {
    return {
      id: 'timerEvent',
      label: translate('Duration'),
      entries: PropertiesParts.timerEventEntries(element),
    };
  };

  createMessageEventGroup = (element: any, translate: any) => {
    return {
      id: 'messageEvent',
      label: translate('Message Information'),
      entries: PropertiesParts.messageEventEntries(element),
    };
  };

  createCodePropertyGroup = (element: any, translate: any) => {
    return {
      id: 'codeProperty',
      label: translate('Code Information'),
      entries: PropertiesParts.codePropertyEntries(element),
    };
  };

  createLaneGroup = (element: any, translate: any) => {
    return {
      id: 'lane',
      label: translate('Lane Information'),
      entries: PropertiesParts.lanePropertyEntries(element),
    };
  };
}

export default PropertiesGroups.instance;
