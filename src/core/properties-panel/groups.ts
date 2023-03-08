//@ts-ignore
import { useService } from 'bpmn-js-properties-panel';
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
}

export default PropertiesGroups.instance;