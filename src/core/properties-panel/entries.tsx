//@ts-ignore
import { isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import Checkbox from './components/Checkbox';
import TextArea from './components/TextArea';
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

  public taskEntries = (element: any) => {
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

  public exclusiveGatewayEntries = (element: any) => {
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

  public linkEventEntries = (element: any) => {
    const property = 'linkCode';
    return [
      {
        id: PROPERTY_TYPES.LINK_CODE,
        label: 'Link Code',
        element,
        property,
        component: TextField,
        isEdited: isTextFieldEntryEdited,
      },
    ];
  };

  public conditionalEventEntries = (element: any) => {
    return [
      {
        id: PROPERTY_TYPES.CONDITION,
        label: 'Condition',
        element,
        property: PROPERTY_TYPES.CONDITION,
        component: TextArea,
        isEdited: isTextFieldEntryEdited,
      },
      {
        id: PROPERTY_TYPES.PERCENTAGE,
        label: 'Percentage',
        element,
        property: PROPERTY_TYPES.PERCENTAGE,
        component: TextField,
        isEdited: isTextFieldEntryEdited,
      },
    ];
  };

  public timerEventEntries = (element: any) => {
    return [
      {
        id: PROPERTY_TYPES.DURATION,
        label: 'Duration',
        element,
        property: PROPERTY_TYPES.DURATION,
        component: TextField,
        isEdited: isTextFieldEntryEdited,
      },
    ];
  };

  public messageEventEntries = (element: any) => {
    return [
      {
        id: PROPERTY_TYPES.IS_START,
        label: 'Is Start',
        element,
        property: PROPERTY_TYPES.IS_START,
        component: Checkbox,
        isEdited: isTextFieldEntryEdited,
      },
    ];
  };

  public codePropertyEntries = (element: any) => {
    return [
      {
        id: PROPERTY_TYPES.CODE,
        label: 'Code',
        element,
        property: PROPERTY_TYPES.CODE,
        component: TextField,
        isEdited: isTextFieldEntryEdited,
      },
    ];
  };

  public lanePropertyEntries = (element: any) => {
    return [
      {
        id: PROPERTY_TYPES.UNIT_COST,
        label: 'Unit Cost',
        element,
        property: PROPERTY_TYPES.UNIT_COST,
        component: TextField,
        isEdited: isTextFieldEntryEdited,
      },
    ];
  };
}

export default PropertiesParts.instance;
