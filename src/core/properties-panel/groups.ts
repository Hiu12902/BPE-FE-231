//@ts-ignore
import { useService } from 'bpmn-js-properties-panel';
import PropertiesParts from './parts';

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
      entries: PropertiesParts.createPropertyCycleTime(element),
    };
  };

  createExclusiveGatewayGroup = (element: any, translate: any) => {
    return {
      id: 'exclusiveGateway',
      label: translate('Branching Probabilities'),
      entries: PropertiesParts.createPropertyBranchingProbability(element),
    };
  };

  createLinkEventGroup = (element: any, translate: any) => {
    return {
      id: 'linkCode',
      label: translate('Link Code'),
      entries: PropertiesParts.createPropertyLinkCode(element),
    };
  };
}

export default PropertiesGroups.instance;
