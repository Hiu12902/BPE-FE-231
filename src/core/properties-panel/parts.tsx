//@ts-ignore
import { isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import TextField from './components/TextField';
import { PROPERTY_TYPES } from './constants/types';

class PropertiesParts {
  private static classInstance?: PropertiesParts;

  public static get instance() {
    if (!this.classInstance) {
      this.classInstance = new PropertiesParts();
    }
    return this.classInstance;
  }

  public createPropertyCycleTime = (element: any) => {
    const property = 'cycleTime';
    return [
      {
        id: PROPERTY_TYPES.CYCLE_TIME,
        label: 'Cycle Time',
        element,
        property,
        component: TextField,
        isEdited: isTextFieldEntryEdited,
      },
    ];
  };

  public createPropertyBranchingProbability = (element: any) => {
    const property = 'branchingProbability';
    const entries = element.outgoing.map((flow: any) => ({
      id: PROPERTY_TYPES.BRANCHING_PROBABILITY,
      label: flow.id,
      element,
      property,
      component: TextField,
      isEdited: isTextFieldEntryEdited,
    }));

    return entries;
  };
}

export default PropertiesParts.instance;
