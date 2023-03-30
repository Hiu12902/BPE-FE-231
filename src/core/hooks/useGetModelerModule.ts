import { getCurrentModeler } from '@/redux/selectors';
import { map } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useGetModelerModules = (modules: string[]) => {
  const modeler = useSelector(getCurrentModeler)?.modeler;
  const [modulesToGet, setModulesToGet] = useState<any[]>([]);

  useEffect(() => {
    if (modeler) {
      const plugins = map(modules, (module) => modeler.get(module));
      setModulesToGet(plugins);
    }
  }, [modeler]);

  return modulesToGet;
};

export default useGetModelerModules;
