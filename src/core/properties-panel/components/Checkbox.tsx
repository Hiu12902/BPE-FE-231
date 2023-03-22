//@ts-ignore
import { CheckboxEntry } from '@bpmn-io/properties-panel';
//@ts-ignore
import { useService } from 'bpmn-js-properties-panel';
import { PROPERTY_TYPES } from '../constants/types';

interface ICheckbox {
  element: any;
  id: string;
  label: string;
  property: string;
}
const Checkbox = (props: ICheckbox) => {
  const { element, id, label, property } = props;

  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const modeling = useService('modeling');

  const getValue = () => {
    switch (id) {
      case PROPERTY_TYPES.IS_START:
        return element.businessObject[property] || false;
    }
  };

  const setValue = (value: boolean) => {
    switch (id) {
      case PROPERTY_TYPES.IS_START:
        modeling.updateProperties(element, {
          [property]: value,
        });
        break;
    }
  };

  return (
    <CheckboxEntry
      id={id}
      element={element}
      label={translate(label)}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />
  );
};

export default Checkbox;
