//@ts-ignore
import { TextAreaEntry } from '@bpmn-io/properties-panel';
//@ts-ignore
import { useService } from 'bpmn-js-properties-panel';
import { PROPERTY_TYPES } from '../constants/types';

interface ITextArea {
  element: any;
  id: string;
  label: string;
  property: string;
}
const TextArea = (props: ITextArea) => {
  const { element, id, label, property } = props;

  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const modeling = useService('modeling');

  const getValue = () => {
    switch (id) {
      case PROPERTY_TYPES.CYCLE_TIME:
      case PROPERTY_TYPES.LINK_CODE:
      case PROPERTY_TYPES.CONDITION:
        return element.businessObject[property] || '';
      case PROPERTY_TYPES.BRANCHING_PROBABILITY: {
        const flow = element.outgoing?.find((flow: any) => flow.id === label);
        return flow.businessObject[property] || '';
      }
    }
  };

  const setValue = (value: number) => {
    switch (id) {
      case PROPERTY_TYPES.CYCLE_TIME:
      case PROPERTY_TYPES.LINK_CODE:
      case PROPERTY_TYPES.CONDITION:
        modeling.updateProperties(element, {
          [property]: value,
        });
        break;
      case PROPERTY_TYPES.BRANCHING_PROBABILITY: {
        const flow = element.outgoing?.find((flow: any) => flow.id === label);
        modeling.updateProperties(flow, {
          name: value,
        });
        modeling.updateProperties(flow, {
          [property]: value,
        });
        break;
      }
    }
  };

  return (
    <TextAreaEntry
      id={id}
      element={element}
      label={translate(label)}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
      rows={3}
    />
  );
};

export default TextArea;
