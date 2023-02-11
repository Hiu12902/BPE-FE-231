import { useEffect, useState } from 'react';

const useGetModelerModules = (modeler: any, modules: string[]) => {
  const [modulesToGet, setModulesToGet] = useState([]);
  useEffect(() => {
    if (modeler) {
      modules.forEach((module) =>
        //@ts-ignore
        setModulesToGet((modulesToGet) => [...modulesToGet, modeler.get(module)])
      );
    }
  }, [modeler]);

  return modulesToGet;
};

export default useGetModelerModules;
