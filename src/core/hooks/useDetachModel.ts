import { getCurrentModeler } from '@/redux/selectors';
import { useSelector } from 'react-redux';

export default function useDetachModel() {
  const currentModeler = useSelector(getCurrentModeler);

  const detach = () => {
    currentModeler?.modeler?.detach();
    currentModeler?.modeler?.get('propertiesPanel').detach();
  };

  return detach;
}
